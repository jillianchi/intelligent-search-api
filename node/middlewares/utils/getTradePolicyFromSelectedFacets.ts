const getTradePolicyFromSelectedFacets = (
  selectedFacets: SelectedFacet[] = []
): string | null => {
  const tradePolicy = selectedFacets.filter(
    (selectedFacet) => selectedFacet.key === 'trade-policy'
  )

  return tradePolicy.length > 0 ? tradePolicy[0].value : null
}

export default getTradePolicyFromSelectedFacets
