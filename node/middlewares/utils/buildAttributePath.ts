const encodeSafeURI = (uri: string) => encodeURI(decodeURI(uri))

const removeDiacriticsFromURL = (url: string) =>
  encodeURIComponent(
    decodeURIComponent(url)
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  )

const buildAttributePath = (selectedFacets: SelectedFacet[]) => {
  return selectedFacets
    ? selectedFacets.reduce((attributePath, facet, idx) => {
        if (facet.key === 'priceRange') {
          facet.key = 'price'
          facet.value = facet.value.replace(` TO `, ':')
        }

        return facet.key !== 'ft'
          ? `${attributePath}${encodeSafeURI(
              facet.key
            )}/${removeDiacriticsFromURL(encodeSafeURI(facet.value)).replace(
              / |%20/,
              '-'
            )}${idx === selectedFacets.length - 1 ? '' : '/'}`
          : attributePath
      }, '')
    : ''
}

export default buildAttributePath
