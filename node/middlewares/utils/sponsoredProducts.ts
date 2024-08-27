import isAdServerAppInstalled from './isAdServerAppInstalled'
import sortProductsSellersByDefaultSeller from './sortProductsSellersByDefaultSeller'

const sponsoredProductsQuery = `
  query sponsoredProducts(
    $selectedFacets: [SelectedFacetInput]
    $query: String
    $page: Int
    $count: Int
    $sort: String
    $operator: Operator
    $fuzzy: String
    $searchState: String
    $allowRedirect: Boolean
    $regionId: String
    $simulationBehavior: SimulationBehavior
    $hideUnavailableItems: Boolean
    $dynamicRules: [DynamicRuleInput]
    $anonymousId: String
    $placement: String
    $sponsoredCount: Int
  ) {
    sponsoredProducts(
      selectedFacets: $selectedFacets
      query: $query
      page: $page
      count: $count
      sort: $sort
      operator: $operator
      fuzzy: $fuzzy
      searchState: $searchState
      allowRedirect: $allowRedirect
      regionId: $regionId
      simulationBehavior: $simulationBehavior
      hideUnavailableItems: $hideUnavailableItems
      dynamicRules: $dynamicRules
      anonymousId: $anonymousId
      placement: $placement
      sponsoredCount: $sponsoredCount
    ) @context(provider: "vtex.adserver-graphql") {
      productId
      identifier {
        field
        value
      }
      rule {
        id
      }
      advertisement {
        adId
        campaignId
        actionCost
        adRequestId
        adResponseId
      }
    }
  }
`

const getSponsoredProductId = (product: SponsoredProduct) =>
  product.identifier?.value || product.productId

export const getSponsoredProducts = async (
  ctx: Context,
  params: {
    [key: string]: string | string[] | Array<{ key: string; value: string }>
  }
) => {
  const {
    clients: { graphQLServer, intelligentSearch },
    vtex: { logger },
  } = ctx

  // To increase performance, we first check if the adserver app is installed, since this call is cached.
  const shouldGetSponsoredProducts = await isAdServerAppInstalled(ctx)
  if (!shouldGetSponsoredProducts) return []

  let sponsoreds: SponsoredProduct[] = []
  try {
    const sponsoredCount = params.sponsoredCount
      ? parseInt(params.sponsoredCount as string)
      : null

    const sponsoredsResult = await graphQLServer.query(
      sponsoredProductsQuery,
      {
        ...params,
        sponsoredCount,
        placement: params.advertisementPlacement,
      },
      { metric: 'sponsored-products' }
    )

    sponsoreds = (sponsoredsResult.data as any).sponsoredProducts
  } catch (error) {
    console.error({ message: 'Request to sponsored products failed.', error })
    logger.error({ message: 'Request to sponsored products failed.', error })
    return []
  }

  const identifierField = sponsoreds?.[0]?.identifier?.field
  const sponsoredProductIds = sponsoreds.map(getSponsoredProductId)

  const products: Product[] = await intelligentSearch.productsById(
    ctx,
    sponsoredProductIds,
    identifierField
  )

  // Some accounts use the first seller as the default one. This ensures
  // that the default seller is always the first one.
  const productsWithOrderedSellers =
    sortProductsSellersByDefaultSeller(products)

  // Merge sponsored info
  const mergedProducts = productsWithOrderedSellers
    .map((product: Product) => {
      const targetProduct = sponsoreds.find((sponsored) => {
        const sponsoredProductId = getSponsoredProductId(sponsored)

        return (
          sponsoredProductId === product.productId ||
          product.items.some((item) => item.itemId === sponsoredProductId)
        )
      })

      if (!targetProduct) {
        return null
      }

      const { rule, advertisement } = targetProduct

      return {
        ...product,
        rule,
        advertisement,
        cacheId: `${product.cacheId}-${rule.id}`,
      }
    })
    .filter((product) => !!product)

  return mergedProducts
}
