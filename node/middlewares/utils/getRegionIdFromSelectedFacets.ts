const getRegionIdFromSelectedFacets = (
  selectedFacets: SelectedFacet[] = []
): [string | null, SelectedFacet[]] => {
  let regionId = null

  const regionIdIndex = selectedFacets.findIndex(
    (selectedFacet) => selectedFacet.key === 'region-id'
  )

  if (regionIdIndex > -1) {
    regionId = selectedFacets[regionIdIndex].value

    selectedFacets.splice(regionIdIndex, 1)
  }

  return [regionId, selectedFacets]
}

export default getRegionIdFromSelectedFacets
