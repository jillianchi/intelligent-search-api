import type { ParsedUrlQuery } from 'querystring'

const pathToSelectedFacets = (path: string): SelectedFacet[] => {
  const pathValues = path.match(/.+?\/.+?(\/|$)/g)

  if (pathValues && pathValues.length > 0) {
    return pathValues
      .map((pathValue) => pathValue.split('/'))
      .map(([key, value]) => ({ key, value }))
  }

  return []
}

export const selectedFacetsToPath = (selectedFacets: SelectedFacet[]) =>
  selectedFacets.reduce(
    (path, selectedFacet) =>
      `${path}/${selectedFacet.key}/${selectedFacet.value}`,
    ''
  )

export const parsedUrlQueryAndPathToSearchPluginParams = (
  parsedUrlQuery: ParsedUrlQuery,
  path: string
): SearchPluginParams => ({
  selectedFacets: pathToSelectedFacets(path),
  allowRedirect: !!parsedUrlQuery.allowRedirect,
  hideUnavailableItems: !!parsedUrlQuery.hideUnavailableItems,
  ...parsedUrlQuery,
})

const objectToParsedUrlQuery = (
  obj: Record<string, unknown>
): ParsedUrlQuery => {
  const parsedUrlQuery: ParsedUrlQuery = {}

  Object.entries(obj).forEach((entry) => {
    const [key, value] = entry
    const valueType = typeof value

    switch (valueType) {
      case 'boolean':
        if (value) {
          parsedUrlQuery[key] = 'true'
        }

        break

      case 'number':
        parsedUrlQuery[key] = (value as number).toString()
        break

      case 'string':
        parsedUrlQuery[key] = value as string
        break

      default:
        break
    }
  })

  return parsedUrlQuery
}

const boostTypeToQueryString = (boostType: BoostType) => {
  switch (boostType) {
    case 'productId':
      return 'product.id'

    case 'productLink':
      return 'product.link'

    case 'skuEan':
      return 'sku.ean'

    case 'skuId':
      return 'sku.id'

    case 'skuReference':
      return 'sku.reference'

    default:
      return boostType
  }
}

const dynamicRulesToQuerySring = (dynamicRules: DynamicRule[]): string =>
  dynamicRules.reduce(
    (path, { action, type, value }, idx) =>
      `${path}${idx > 0 ? ';' : ''}${action}:${boostTypeToQueryString(
        type
      )}:${value}`,
    ''
  )

export const searchPluginParamsToParsedUrlQueryAndPath = (
  params: SearchPluginParams
): { path: string; query: ParsedUrlQuery } => ({
  path: selectedFacetsToPath(params.selectedFacets ?? []),
  query: {
    dynamicRule: dynamicRulesToQuerySring(params.dynamicRules ?? []),
    ...objectToParsedUrlQuery(params),
  },
})
