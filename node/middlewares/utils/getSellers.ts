import type { Logger } from '@vtex/api'

import { logDegradedSearchError } from '.'
import type { Checkout } from '../../clients/checkout'

interface Region {
  id: string
  sellers: Array<{
    id: string
    name: string
  }>
}

export const SELLERS_BUCKET = 'sellersByRegionId'

export const getSellers = async (
  checkout: Checkout,
  logger: Logger,
  channel?: number | string,
  regionId?: string | null
): Promise<RegionSeller[]> => {
  if (!regionId) {
    return []
  }

  try {
    const result = await checkout.regions(regionId, channel)

    const sellers: RegionSeller[] = result?.find(
      (region: Region) => region.id === regionId
    )?.sellers

    return sellers.length > 0
      ? sellers
      : [{ name: 'vtex-sp-no-seller', id: 'vtex-sp-no-seller' }]
  } catch (e) {
    logDegradedSearchError(logger, {
      service: 'Checkout regions',
      error: `Error while trying to get sellers from regionId ${regionId}: ${e.message}`,
      errorStack: e,
    })

    return []
  }
}

const isSellerInSellers = (sellers: RegionSeller[], sellerId: string) =>
  sellers.find((seller) => seller.id === sellerId)

export const getPrivateSellerFromSelectedFacets = (
  sellers: RegionSeller[],
  selectedFacets: SelectedFacet[] = []
): RegionSeller[] => {
  const indexes = []
  const privateSellers: RegionSeller[] = []

  for (let i = 0; i < selectedFacets.length; i++) {
    if (selectedFacets[i].key === 'private-seller') {
      indexes.push(i)

      // If the private seller is already inside sellers, we don't need to use it again
      if (!isSellerInSellers(sellers, selectedFacets[i].value)) {
        privateSellers.push({
          name: selectedFacets[i].value,
          id: selectedFacets[i].value,
        })
      }
    }
  }

  for (let j = indexes.length - 1; j >= 0; j--) {
    selectedFacets.splice(indexes[j], 1)
  }

  return privateSellers
}
