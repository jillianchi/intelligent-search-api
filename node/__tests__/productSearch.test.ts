import type { IncomingMessage } from 'http'

import type { IOContext, SegmentData } from '@vtex/api'

import IntelligentSearch from '../clients/intelligent-search'
import productSearch from '../middlewares/productSearch'
import HttpClientMock from '../__mock__/HttpClientMock'
import {
  productSearchExpectedResult,
  productSearchResponseMock,
  productSearchWithOriginVtexTrueExpectedResult,
  productSearchWithSimulationExpectedResult,
  productSearchWithSimulationOnly1PExpectedResult,
} from '../__mock__/productSearchResponseMock'
import CheckoutMock from '../__mock__/CheckoutMock'
import {
  regionsMock,
  simulationResponseMock,
} from '../__mock__/checkoutResponseMock'
import { StoreMock } from '../__mock__/StoreMock'
import { itemsWithSimulationResponseMock } from '../__mock__/itemsWithSimulationResponseMock'
import RewriterMock from '../__mock__/RewriterMock'
import SearchMock from '../__mock__/SearchMock'
import { productsByIdResponseMock } from '../__mock__/catalogResponseMock'
import VBaseMock from '../__mock__/VBaseMock'
import AppsMock from '../__mock__/AppsMock'

const ACCOUNT = 'storecomponents'
const QUERY = 'top'
const LOCALE = 'en-US'

let ctx: Context

const checkoutMock = new CheckoutMock() as any
const httpClientMock = new HttpClientMock() as any
const storeMock = new StoreMock() as any
const rewriterMock = new RewriterMock() as any
const searchMock = new SearchMock() as any
const vbaseMock = new VBaseMock() as any
const appsMock = new AppsMock() as any
const loggerWarnMock = jest.fn()

const { get: spAPI } = httpClientMock

beforeEach(() => {
  ctx = {
    clients: {
      intelligentSearch: new IntelligentSearch(
        {
          account: ACCOUNT,
        } as IOContext,
        undefined,
        httpClientMock as any
      ),
      checkout: checkoutMock,
      store: storeMock,
      rewriter: rewriterMock,
      search: searchMock,
      vbase: vbaseMock,
      apps: appsMock,
    },
    vtex: {
      route: {
        params: {},
      },
      logger: {
        warn: loggerWarnMock,
      },
    },
    state: {},
  } as any

  checkoutMock.simulation.mockImplementation(async () => simulationResponseMock)
  storeMock.itemsWithSimulation.mockImplementation(
    async () => itemsWithSimulationResponseMock
  )
})

afterEach(() => {
  spAPI.mockRestore()
  checkoutMock.simulation.mockRestore()
  storeMock.itemsWithSimulation.mockRestore()
  rewriterMock.getRoute.mockRestore()
  loggerWarnMock.mockRestore()
})

describe('productSearch', () => {
  it('should return the result for a fulltext search', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(productSearchResponseMock)
    )

    const params = {
      query: QUERY,
      simulationBehavior: 'skip',
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage

    await productSearch(ctx, async () => {})

    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/product_search/`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params: {
        query: params.query,
      },
    })
    expect(ctx.status).toBe(200)
    expect(ctx.body).toMatchObject(productSearchExpectedResult)
  })

  it('should return the result for a navigation search', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(productSearchResponseMock)
    )

    const params = {
      simulationBehavior: 'skip',
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.route.params = { path: 'category-1/shoes' }

    await productSearch(ctx, async () => {})

    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/product_search/category-1/shoes`
    )
    expect(ctx.status).toBe(200)
    expect(ctx.body).toMatchObject(productSearchExpectedResult)
  })

  it('should call the simulation when simulationBehavior=default. It also should log a warn with info about the simulation difference', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(productSearchResponseMock)
    )

    const params = {
      query: QUERY,
      simulationBehavior: 'default',
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    await productSearch(ctx, async () => {})

    expect(storeMock.itemsWithSimulation.mock.instances).toHaveLength(1)
    expect(storeMock.itemsWithSimulation.mock.calls[0][0]).toMatchObject({
      items: [
        {
          itemId: '3',
          sellers: [{ sellerId: '1' }, { sellerId: 'thirdpartyseller' }],
        },
        { itemId: '4', sellers: [{ sellerId: '1' }] },
      ],
    })
    expect(ctx.status).toBe(200)
    expect(loggerWarnMock.mock.instances).toHaveLength(1)
    expect(ctx.body).toMatchObject(productSearchWithSimulationExpectedResult)
  })

  it('should call the simulation only for first party sellers when simulationBehavior=only1P. It also should log a warn with info about the simulation difference', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(productSearchResponseMock)
    )

    const params = {
      query: QUERY,
      simulationBehavior: 'only1P',
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    await productSearch(ctx, async () => {})

    expect(storeMock.itemsWithSimulation.mock.instances).toHaveLength(1)
    expect(storeMock.itemsWithSimulation.mock.calls[0][0]).toMatchObject({
      items: [
        { itemId: '3', sellers: [{ sellerId: '1' }] },
        { itemId: '4', sellers: [{ sellerId: '1' }] },
      ],
    })
    expect(ctx.status).toBe(200)
    expect(ctx.body).toMatchObject(
      productSearchWithSimulationOnly1PExpectedResult
    )
  })

  it('should translate the linktext when the binding and the tenant are different', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(productSearchResponseMock)
    )
    rewriterMock.getRoute.mockImplementation(async () => 'translated-query')

    ctx.vtex = {
      ...ctx.vtex,
      tenant: { locale: 'pt-PT' },
      binding: { id: 'bb1fb4f6-e5c3-4d67-9347-d0b20683ea25', locale: 'en-GB' },
    }

    const params = {
      query: QUERY,
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    await productSearch(ctx, async () => {})

    expect(rewriterMock.getRoute.mock.instances).toHaveLength(1)

    expect(ctx.status).toBe(200)
    expect((ctx.body as any).products[0].linkText).toBe('translated-query')
  })

  it('should NOT translate the linktext when the binding and the tenant are different', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(productSearchResponseMock)
    )
    rewriterMock.getRoute.mockImplementation(async () => 'translated-query')

    ctx.vtex = {
      ...ctx.vtex,
      tenant: { locale: 'pt-PT' },
      binding: { id: 'bb1fb4f6-e5c3-4d67-9347-d0b20683ea25', locale: 'pt-PT' },
    }

    const params = {
      query: QUERY,
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    await productSearch(ctx, async () => {})

    expect(rewriterMock.getRoute.mock.instances).toHaveLength(0)

    expect(ctx.status).toBe(200)
    expect((ctx.body as any).products[0].linkText).toBe('tank-top')
  })

  it('should add all the querystrings to the SP API call and remove not allowed ones', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(productSearchResponseMock)
    )

    const params = {
      query: QUERY,
      simulationBehavior: 'skip',
      from: '0',
      to: '9',
      locale: LOCALE,
      hideUnavailableItems: 'false',
      fuzzy: '0',
      operator: 'or',
      searchState: 'mystate',
      myOwnQuery: 'myownquery',
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage

    await productSearch(ctx, async () => {})

    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/product_search/`
    )
    expect(spAPI.mock.calls[0][1]).toStrictEqual({
      params: {
        query: params.query,
        fuzzy: params.fuzzy,
        locale: params.locale,
        'hide-unavailable-items': params.hideUnavailableItems,
        operator: params.operator,
        searchState: params.searchState,
        count: '10',
        page: '1',
        regionId: undefined,
      },
      headers: {
        'X-VTEX-IS-Filter': '',
        'X-VTEX-IS-ID': 'storecomponents',
      },
      metric: 'search-result',
    })
    expect(ctx.status).toBe(200)
    expect(ctx.body).toMatchObject(productSearchExpectedResult)
  })

  it('should convert from/to to count/page', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(productSearchResponseMock)
    )

    const params = {
      query: QUERY,
      from: '0',
      to: '9',
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage

    await productSearch(ctx, async () => {})

    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/product_search/`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params: {
        count: '10',
        page: '1',
      },
    })
    expect(ctx.status).toBe(200)
  })

  it('should return the catalog result if product-origin-vtex is true', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(productSearchResponseMock)
    )
    searchMock.productsById.mockImplementation(async () =>
      Promise.resolve(productsByIdResponseMock)
    )

    const params = {
      query: QUERY,
      simulationBehavior: 'skip',
      productOriginVtex: 'true',
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage

    await productSearch(ctx, async () => {})

    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/product_search/`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params: {
        query: params.query,
      },
    })
    expect(ctx.status).toBe(200)
    expect(ctx.body).toMatchObject(
      productSearchWithOriginVtexTrueExpectedResult
    )
  })

  it('should add the trade-policy to the checkout and the SP call', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(productSearchResponseMock)
    )

    const params = {
      query: QUERY,
      simulationBehavior: 'skip',
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.segment = {
      ...ctx.vtex.segment,
      channel: 1,
    } as SegmentData
    ctx.vtex.route.params = { path: 'category-1/shoes' }

    await productSearch(ctx, async () => {})

    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/product_search/category-1/shoes/trade-policy/1`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params: {
        query: params.query,
      },
    })
    expect(ctx.status).toBe(200)
    expect(ctx.body).toMatchObject(productSearchExpectedResult)
  })

  it('should not add the trade-policy again if it is already in the path', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(productSearchResponseMock)
    )

    const params = {
      query: QUERY,
      simulationBehavior: 'skip',
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.segment = {
      ...ctx.vtex.segment,
      channel: 1,
    } as SegmentData
    ctx.vtex.route.params = { path: 'trade-policy/1' }

    await productSearch(ctx, async () => {})

    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/product_search/trade-policy/1`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params: {
        query: params.query,
      },
    })
    expect(ctx.status).toBe(200)
    expect(ctx.body).toMatchObject(productSearchExpectedResult)
  })

  it('should add private seller to the SP API call', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(productSearchResponseMock)
    )
    checkoutMock.regions.mockImplementation(async () => regionsMock)

    const params = {
      query: QUERY,
      simulationBehavior: 'skip',
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.segment = {
      ...ctx.vtex.segment,
      regionId: 'myregionid',
    } as SegmentData

    await productSearch(ctx, async () => {})

    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/product_search/`
    )

    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params: {
        query: params.query,
      },
      headers: {
        'X-VTEX-IS-Filter': 'private-seller#myprivateseller',
      },
    })
    expect(ctx.status).toBe(200)
    expect(ctx.body).toMatchObject(productSearchExpectedResult)
  })

  it('should add private seller to the SP API call if it is in the path', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(productSearchResponseMock)
    )
    checkoutMock.regions.mockImplementation(async () => regionsMock)

    const params = {
      query: QUERY,
      simulationBehavior: 'skip',
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.route.params = { path: 'private-seller/myprivateseller' }

    await productSearch(ctx, async () => {})

    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params: {
        query: params.query,
      },
      headers: {
        'X-VTEX-IS-Filter': 'private-seller#myprivateseller',
      },
    })
    expect(ctx.status).toBe(200)
    expect(ctx.body).toMatchObject(productSearchExpectedResult)
  })

  it('should add facets from the segment to the SP API call', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(productSearchResponseMock)
    )
    checkoutMock.regions.mockImplementation(async () => regionsMock)

    const params = {
      query: QUERY,
      simulationBehavior: 'skip',
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.segment = {
      ...ctx.vtex.segment,
      facets: 'category-1=shoes',
    } as SegmentData

    await productSearch(ctx, async () => {})

    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/product_search/category-1/shoes/`
    )

    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params: {
        query: params.query,
      },
    })
    expect(ctx.status).toBe(200)
  })

  it('should add private seller to the SP API call and itemsWithSimulation call even when it comes as a selectedFacet. It also should log a warn with info about the simulation difference', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(productSearchResponseMock)
    )
    checkoutMock.regions.mockImplementation(async () => regionsMock)

    const params = {
      query: QUERY,
      simulationBehavior: 'default',
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.segment = {
      ...ctx.vtex.segment,
      channel: 1,
    } as SegmentData
    ctx.vtex.route.params = { path: 'category-1/shoes/region-id/myregionid' }

    await productSearch(ctx, async () => {})

    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/product_search/category-1/shoes/trade-policy/1`
    )
    expect(storeMock.itemsWithSimulation.mock.calls[0][0]).toMatchObject({
      regionId: 'myregionid',
      salesChannel: '1',
    })
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params: {
        query: params.query,
      },
      headers: {
        'X-VTEX-IS-Filter': 'private-seller#myprivateseller',
      },
    })
    expect(ctx.body).toMatchObject(productSearchWithSimulationExpectedResult)
    expect(ctx.status).toBe(200)
    expect(loggerWarnMock.mock.instances).toHaveLength(1)
  })

  it('should add trade-policy to the SP API call and itemsWithSimulation call even when it comes as a selectedFacet. It also should log a warn with info about the simulation difference', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(productSearchResponseMock)
    )
    checkoutMock.regions.mockImplementation(async () => regionsMock)

    const params = {
      query: QUERY,
      simulationBehavior: 'default',
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.segment = {
      ...ctx.vtex.segment,
      regionId: 'myregionid',
    } as SegmentData
    ctx.vtex.route.params = {
      path: 'category-1/shoes/region-id/myregionid/trade-policy/1',
    }

    await productSearch(ctx, async () => {})

    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/product_search/category-1/shoes/trade-policy/1`
    )
    expect(storeMock.itemsWithSimulation.mock.calls[0][0]).toMatchObject({
      regionId: 'myregionid',
      salesChannel: '1',
    })
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params: {
        query: params.query,
      },
      headers: {
        'X-VTEX-IS-Filter': 'private-seller#myprivateseller',
      },
    })
    expect(ctx.body).toMatchObject(productSearchWithSimulationExpectedResult)
    expect(ctx.status).toBe(200)
    expect(loggerWarnMock.mock.instances).toHaveLength(1)
  })
})
