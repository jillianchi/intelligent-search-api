import type { Logger } from '@vtex/api'

export const logDegradedSearchError = (
  logger: Logger,
  error: DegradedSearchError
) => {
  logger.warn({
    message: 'Degraded search',
    ...error,
  })
}

export const mapColdAndHotInfo = (
  itemsFromIS: Item[],
  itemsFromSimulation: Item[]
) => {
  const mapInfo: Record<string, any> = {}

  itemsFromSimulation.forEach((item) => {
    item.sellers.forEach((seller) => {
      const key = `sku${item.itemId}-seller${seller.sellerId}`

      mapInfo[key] = {
        hot: seller.error ? null : seller.commertialOffer,
      }
    })
  })

  itemsFromIS.forEach((item) => {
    item.sellers.forEach((seller) => {
      const key = `sku${item.itemId}-seller${seller.sellerId}`
      const currentInfo = mapInfo[key]

      mapInfo[key] = {
        ...currentInfo,
        cold: seller.commertialOffer,
      }
    })
  })

  return mapInfo
}

export const hasSimulationPriceDifference = (
  coldAndHotInfo: Record<string, any>
) => {
  const hasDifference = Object.keys(coldAndHotInfo).reduce(
    (final, currentValue) => {
      if (final || !coldAndHotInfo[currentValue].hot) {
        return final
      }

      const currentColdInfo = coldAndHotInfo[currentValue].cold
      const currentHotInfo = coldAndHotInfo[currentValue].hot

      const diffPrice = currentColdInfo?.Price !== currentHotInfo?.Price
      const diffSpotPrice =
        currentColdInfo?.spotPrice !== currentHotInfo?.spotPrice

      const diffQuantity =
        currentColdInfo?.AvailableQuantity !== currentHotInfo?.AvailableQuantity

      const diffListPrice =
        currentColdInfo?.ListPrice !== currentHotInfo?.ListPrice

      return diffPrice || diffSpotPrice || diffQuantity || diffListPrice
    },
    false
  )

  return hasDifference
}
