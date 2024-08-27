import parseFacetsFromSegment from './parseFacetsFromSegment'
import { getSelectedFacetsFromPath } from './utils'
import {
  attributesToFilters,
  resolveFacets,
  sortAttributes,
} from './utils/attributes'
import buildAttributePath from './utils/buildAttributePath'
import buildBSearchFilterHeader from './utils/buildBSearchFilterHeader'
import buildPathFromArgs from './utils/buildPathFromArgs'
import { buildBreadcrumb, setFilterVisibility } from './utils/filters'
import getRegionIdFromSelectedFacets from './utils/getRegionIdFromSelectedFacets'
import {
  getPrivateSellerFromSelectedFacets,
  getSellers,
} from './utils/getSellers'
import getTradePolicyFromSelectedFacets from './utils/getTradePolicyFromSelectedFacets'

export default async function facets(ctx: Context, next: () => Promise<any>) {
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
    clients: { intelligentSearch: ISClient, vbase, search, checkout },
  } = ctx

  const selectedFacetsFromPath = getSelectedFacetsFromPath(path as string)

  const [regionId, selectedFacets] = getRegionIdFromSelectedFacets(
    selectedFacetsFromPath
  )

  const selectedFacetsFromSegment = parseFacetsFromSegment(segment?.facets)

  const tradePolicy =
    getTradePolicyFromSelectedFacets(selectedFacets) || segment?.channel

  const privateSellers = await getSellers(
    checkout,
    logger,
    tradePolicy,
    regionId || segment?.regionId
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
    regionId,
    salesChannel: tradePolicy,
  }

  const intelligentSearchFacets = await ISClient.facets(
    ctx,
    buildPathFromArgs({
      attributePath: buildAttributePath(selectedFacets),
      tradePolicy,
      selectedFacetsFromSegment,
    }),
    parsedParams,
    ISFilterHeader as string
  )

  // FIXME: This is used to sort values based on catalog API.
  // Remove it when it is not necessary anymore
  if (intelligentSearchFacets?.attributes) {
    intelligentSearchFacets.attributes = await sortAttributes(
      intelligentSearchFacets.attributes,
      search
    )
  }

  const breadcrumb = buildBreadcrumb(
    intelligentSearchFacets.attributes || [],
    query.query as string,
    selectedFacets
  )

  const attributesWithVisibilitySet = await setFilterVisibility(
    vbase,
    search,
    intelligentSearchFacets.attributes ?? []
  )

  const response = attributesToFilters({
    breadcrumb,
    total: intelligentSearchFacets.total,
    attributes: attributesWithVisibilitySet,
    removeHiddenFacets: query.removeHiddenFacets === 'true',
  })

  // add fulltext to the selectedFacets in order to build the queryArgs propertly
  if (query.query) {
    selectedFacets.push({ key: 'ft', value: query.query as string })
  }

  ctx.body = {
    facets: resolveFacets(response),
    sampling: intelligentSearchFacets.sampling,
    breadcrumb,
    queryArgs: {
      query: query?.query ?? '',
      selectedFacets,
    },
    translated: intelligentSearchFacets.translated,
  }

  ctx.status = 200
  await next()
}
