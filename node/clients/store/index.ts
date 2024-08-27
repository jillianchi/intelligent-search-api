import type { IOContext, InstanceOptions } from '@vtex/api'
import { AppGraphQLClient } from '@vtex/api'

import { itemsWithSimulation } from './queries'

interface ItemsWithSimulationPayload {
  items: Array<{
    itemId: string
    sellers: Array<{ sellerId: string }>
  }>
  regionId?: string
  salesChannel?: string
}

export class Store extends AppGraphQLClient {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  constructor(context: IOContext, options?: InstanceOptions) {
    super('jillian.store-graphql@3.x', context, {
      ...options,
      headers: {
        ...options?.headers,
      },
    })
  }

  public itemsWithSimulation = (variables: ItemsWithSimulationPayload) => {
    return this.graphql.query<
      { itemsWithSimulation: Item[] },
      ItemsWithSimulationPayload
    >(
      {
        query: itemsWithSimulation,
        variables,
      },
      {
        metric: 'search-items-with-simulation',
      }
    )
  }
}
