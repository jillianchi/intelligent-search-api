import { getProductsCountAndPage } from '@vtex/vtexis-compatibility-layer'

import parseFacetsFromSegment from './parseFacetsFromSegment'
import { getSelectedFacetsFromPath } from './utils'
import buildAttributePath from './utils/buildAttributePath'
import buildBSearchFilterHeader from './utils/buildBSearchFilterHeader'
import buildPathFromArgs from './utils/buildPathFromArgs'
import getRegionIdFromSelectedFacets from './utils/getRegionIdFromSelectedFacets'
import {
  getPrivateSellerFromSelectedFacets,
  getSellers,
} from './utils/getSellers'
import getTradePolicyFromSelectedFacets from './utils/getTradePolicyFromSelectedFacets'
import { mergeSponsoredProducts } from './utils/mergeSponsoredProducts'
import { getSponsoredProducts } from './utils/sponsoredProducts'

const decodeQuery = (query: string | string[]) => {
  try {
    if (typeof query !== 'string') {
      return
    }

    return decodeURIComponent(query)
  } catch (e) {
    return query
  }
}

export default async function productSearch(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    query,
    req: { headers },
    vtex: {
      route: {
        params: { path = '' },
      },
      segment,
      logger,
    },
    clients: { intelligentSearch: ISClient, checkout },
  } = ctx

  const selectedFacetsFromPath = getSelectedFacetsFromPath(path as string)

  const [region, selectedFacets] = getRegionIdFromSelectedFacets(
    selectedFacetsFromPath
  )

  const selectedFacetsFromSegment = parseFacetsFromSegment(segment?.facets)

  // We need to use the operator || for query.salesChannel even though it isn't recommended by eslint
  // because this value can be an empty string
  const tradePolicy =
    getTradePolicyFromSelectedFacets(selectedFacets) ??
    ((query.salesChannel as string) || segment?.channel)

  const regionId = region ?? ((query?.regionId as string) || segment?.regionId)

  const privateSellers = await getSellers(
    checkout,
    logger,
    tradePolicy,
    regionId
  )

  const privateSellersFromSelectedFacets = getPrivateSellerFromSelectedFacets(
    privateSellers,
    selectedFacets
  )

  const sellers = privateSellersFromSelectedFacets.concat(privateSellers)
  const shippingRoutes = headers['x-vtex-shipping-options'] ?? ''

  const ISFilterHeader =
    headers['x-vtex-is-filter'] ??
    buildBSearchFilterHeader(sellers, shippingRoutes as string) ??
    ''

  const parsedParams: any = {
    ...query,
    query: query.query && decodeQuery(query.query),
    regionId,
    salesChannel: tradePolicy,
  }

  if (query?.from && query?.to) {
    const [count, page] = getProductsCountAndPage(
      parseInt(query.from as string, 10),
      parseInt(query.to as string, 10)
    )

    parsedParams.count = count.toString()
    parsedParams.page = page.toString()
  }

  const searchPromises: Array<Promise<any>> = [
    ISClient.productSearch(
      ctx,
      buildPathFromArgs({
        attributePath: buildAttributePath(selectedFacets),
        tradePolicy,
        selectedFacetsFromSegment,
      }),
      parsedParams,
      ISFilterHeader as string
    ),
  ]

  // If the flag showSponsored is enabled for this placement, we should return the sponsored products in the beggining of the products list
  if ((query.showSponsored as string) === 'true') {
    const sponsoredParams = {
      ...query,
      selectedFacets: getSelectedFacetsFromPath(
        buildPathFromArgs({
          attributePath: buildAttributePath(selectedFacets),
          tradePolicy,
          selectedFacetsFromSegment,
        })
      ),
    }

    searchPromises.push(getSponsoredProducts(ctx, sponsoredParams))
  }

  const [result, sponsoredProducts] = await Promise.all(searchPromises)

  const { repeatSponsoredProducts = 'true' } = query
  const advertisementOptions = {
    repeatSponsoredProducts: repeatSponsoredProducts === 'true',
  }

  ctx.body = sponsoredProducts?.length
    ? {
        ...result,
        products: mergeSponsoredProducts(
          result.products,
          sponsoredProducts,
          advertisementOptions
        ),
      }
    : result

  ctx.status = 200

  await next()
}
