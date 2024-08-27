import type { Logger } from '@vtex/api'

export const getSelectedFacetsFromPath = (
  path: string
): { key: string; value: string }[] => {
  const pathArray = path.split('/').filter((value) => value)

  if (pathArray.length < 2) {
    return []
  }

  const selectedFacets = []

  for (let i = 0; i < pathArray.length - 1; i += 2) {
    selectedFacets.push({ key: pathArray[i], value: pathArray[i + 1] })
  }

  return selectedFacets
}

export const logDegradedSearchError = (
  logger: Logger,
  error: DegradedSearchError
) => {
  logger.warn({
    message: 'Degraded search',
    ...error,
  })
}
