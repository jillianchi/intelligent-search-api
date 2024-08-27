import type { Logger } from '@vtex/api'
import {
  convertISProduct,
  mergeProductWithItems,
} from '@vtex/vtexis-compatibility-layer'

import removeUnnecessaryFields from '../middlewares/utils/filterFields'
import type { Store } from './store'
import {
  logDegradedSearchError,
  hasSimulationPriceDifference,
  mapColdAndHotInfo,
} from './utils'

export const fillProductWithSimulation = async (
  product: Product,
  store: Store,
  simulationBehavior: 'default' | 'only1P',
  logger: Logger,
  regionId?: string,
  salesChannel?: string,
  debugMode?: boolean
  // eslint-disable-next-line max-params
) => {
  const payload = {
    items: product.items.map((item) => ({
      itemId: item.itemId,
      sellers:
        simulationBehavior === 'only1P'
          ? [{ sellerId: '1' }]
          : item.sellers.map((seller) => ({
              sellerId: seller.sellerId,
            })),
    })),
    regionId,
    salesChannel,
  }

  try {
    const itemsWithSimulation = await store.itemsWithSimulation(payload)

    if (!itemsWithSimulation.data) {
      return product
    }

    const hasError = itemsWithSimulation.data.itemsWithSimulation.some((item) =>
      item.sellers.some((seller) => seller.error)
    )

    const coldAndHotInfo = mapColdAndHotInfo(
      product.items,
      itemsWithSimulation.data.itemsWithSimulation
    )

    product.simulationDifference = hasSimulationPriceDifference(coldAndHotInfo)

    if (debugMode) {
      product.debug = coldAndHotInfo
    }

    if (hasError) {
      logDegradedSearchError(logger, {
        service: 'itemsWithSimulation',
        error: `itemsWithSimulation returned an error for ${product.productId}. Simulation will be skipped for one or more item + seller combination. 
          Try this query on Splunk to retrieve error log: 'index=io_vtex_logs account={ACCOUNT} level=error OR level=warn | spath app | search app="jillian.store-graphql@*"| spath "data.config.metric" | search "data.config.metric"="pvt-checkout-simulation"'`,
      })
    }

    return mergeProductWithItems(
      product,
      itemsWithSimulation.data.itemsWithSimulation,
      simulationBehavior
    )
  } catch (error) {
    // TODO: PER-2503 - Improve error observability
    if (process.env.VTEX_APP_LINK) {
      console.error(error)
    }

    return product
  }
}

export const convertProducts = async (
  products: BiggySearchProduct[],
  ctx: Context,
  simulationBehavior?: 'skip' | 'default' | 'only1P' | null,
  channel?: string,
  regionId?: string,
  debugMode?: boolean
  // eslint-disable-next-line max-params
) => {
  const {
    vtex: { segment, logger },
    clients: { store },
  } = ctx

  const salesChannel = channel?.toString() ?? segment?.channel?.toString()

  let convertedProducts: Product[] = products.map((product) =>
    convertISProduct(product, salesChannel)
  )

  if (simulationBehavior === 'default' || simulationBehavior === 'only1P') {
    const simulationPromises = convertedProducts.map((product) =>
      fillProductWithSimulation(
        product as Product,
        store,
        simulationBehavior,
        logger,
        regionId,
        salesChannel,
        debugMode
      )
    )

    convertedProducts = (await Promise.all(simulationPromises)) as Product[]

    const productsWithDifferentPrices = convertedProducts.filter(
      (product) => product.simulationDifference
    ).length

    logger.warn({
      message: 'Difference between hot and cold price',
      productsWithDifference: productsWithDifferentPrices,
      productsWithoutDifference:
        convertedProducts.length - productsWithDifferentPrices,
      hasRegion: !!regionId,
      hasMarketingData: !!(segment?.utm_campaign || segment?.utm_source || segment?.utmi_campaign || segment?.campaigns),
      hasPriceTables: !!segment?.priceTables,
    })
  }

  return convertedProducts.map((product) => removeUnnecessaryFields(product))
}
