const join = (paths: Array<string | undefined>) =>
  paths.filter((path) => path).join('/')

const encodeSafeURI = (uri: string) => encodeURI(decodeURI(uri))

const removeDiacriticsFromURL = (url: string) =>
  encodeURIComponent(
    decodeURIComponent(url)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  )

const buildPathFromArgs = (args: {
  attributePath: string
  tradePolicy?: number | string
  selectedFacetsFromSegment?: SelectedFacet[]
}) => {
  const { attributePath, tradePolicy, selectedFacetsFromSegment } = args

  const selectedFacetsFromSegmentPath = selectedFacetsFromSegment
    ? selectedFacetsFromSegment.reduce((attributePathFromSegment, facet) => {
        if (facet.key === 'priceRange') {
          facet.key = 'price'
          facet.value = facet.value.replace(` TO `, ':')
        }

        return facet.key !== 'ft'
          ? `${attributePathFromSegment}${encodeSafeURI(
              facet.key
            )}/${removeDiacriticsFromURL(encodeSafeURI(facet.value)).replace(
              / |%20/,
              '-'
            )}/`
          : attributePathFromSegment
      }, '')
    : ''

  // On headless stores, the trade-policy is already present in the selectedFacets, so there is no need to add it again.
  const alreadyHasTradePolicy = /(\/|^)trade-policy\//.test(attributePath)

  const policyAttr =
    !alreadyHasTradePolicy && tradePolicy ? `trade-policy/${tradePolicy}` : ''

  return join([
    attributePath.split('%20').join('-'),
    policyAttr,
    selectedFacetsFromSegmentPath,
  ])
}

export default buildPathFromArgs
