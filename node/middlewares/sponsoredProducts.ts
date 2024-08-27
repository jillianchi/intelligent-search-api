import { getSelectedFacetsFromPath } from './utils'
import { getSponsoredProducts } from './utils/sponsoredProducts'
import getTradePolicyFromSelectedFacets from './utils/getTradePolicyFromSelectedFacets'

export default async function sponsoredProducts(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    vtex: {
      route: {
        params: { path = '' },
      },
      segment,
    },
    query,
  } = ctx

  const selectedFacets = getSelectedFacetsFromPath(path as string)

  if (!getTradePolicyFromSelectedFacets(selectedFacets)) {
    const tradePolicy = segment?.channel.toString()

    if (tradePolicy) {
      selectedFacets.push({ key: 'trade-policy', value: tradePolicy })
    }
  }

  const params = {
    ...query,
    selectedFacets,
  }

  const sponsoredsResult = await getSponsoredProducts(ctx, params)

  if (!sponsoredsResult) {
    ctx.status = 500
    await next()

    return
  }

  ctx.body = sponsoredsResult
  ctx.status = 200

  await next()
}
