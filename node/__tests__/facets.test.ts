import type { IncomingMessage } from 'http'

import type { IOContext, SegmentData } from '@vtex/api'

import IntelligentSearch from '../clients/intelligent-search'
import facets from '../middlewares/facets'
import HttpClientMock from '../__mock__/HttpClientMock'
import {
  facetsCatalogResponseMock,
  facetsExpectedNavigationResult,
  facetsExpectedResult,
  facetsWithcategoryResponseMock,
  facetsResponseMock,
  getFieldResponseMock,
  listBycategoryResponseMock,
  setVisibilityExpecteResult,
  getFieldValuesResponseMock,
  facetsAfterSortExpectedResult,
  facetsMockBreadcrumb,
  facetsMockBreadcrumbWithLocation,
  facetsMockBreadcrumbWithProductClusterIds,
  facetsMockBreadcrumbWithProductClusterNames,
  facetsMockBreadcrumbWithMultipleProductClusterNames,
} from '../__mock__/facetsResponseMock'
import VBaseMock from '../__mock__/VBaseMock'
import SearchMock from '../__mock__/SearchMock'
import { regionsMock } from '../__mock__/checkoutResponseMock'
import CheckoutMock from '../__mock__/CheckoutMock'

const ACCOUNT = 'storecomponents'
const QUERY = 'top'
const LOCALE = 'en-US'
const SELLER = 'private-seller#testseller'
const PATH =
  'testattribute/shoes3/testattribute/shoes2/testattribute2/shirt3/testattribute2/shirt2'

let ctx: Context

const httpClientMock = new HttpClientMock() as any
const searchMock = new SearchMock() as any
const checkoutMock = new CheckoutMock() as any

const { get: spAPI } = httpClientMock

beforeEach(() => {
  ctx = {
    clients: {
      intelligentSearch: new IntelligentSearch(
        {
          account: ACCOUNT,
        } as IOContext,
        undefined,
        httpClientMock
      ),
      vbase: new VBaseMock() as any,
      search: searchMock,
      checkout: checkoutMock,
    },
    vtex: {
      route: {
        params: {},
      },
    },
    state: {},
  } as Context
})

afterEach(() => {
  spAPI.mockRestore()
})

describe('facets', () => {
  it('should return the result for a fulltext search', async () => {
    spAPI.mockImplementation(async () => Promise.resolve(facetsResponseMock))

    const params = {
      query: QUERY,
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.route.params = { path: PATH }

    await facets(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(1)
    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/attribute_search/testattribute/shoes3/testattribute/shoes2/testattribute2/shirt3/testattribute2/shirt2`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params,
    })
    expect(ctx.body).toMatchObject(facetsExpectedResult)
    expect(ctx.status).toBe(200)
  })

  it('should return the result for a navigation search', async () => {
    spAPI.mockImplementation(async () => Promise.resolve(facetsResponseMock))

    ctx.query = {}
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.route.params = { path: PATH }

    await facets(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(1)
    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/attribute_search/testattribute/shoes3/testattribute/shoes2/testattribute2/shirt3/testattribute2/shirt2`
    )
    expect(ctx.body).toMatchObject(facetsExpectedNavigationResult)
    expect(ctx.status).toBe(200)
  })

  it('should add the querystrings to the SP API call', async () => {
    spAPI.mockImplementation(async () => Promise.resolve(facetsResponseMock))

    const params = {
      query: QUERY,
      page: '1',
      count: '20',
      operator: 'and',
      fuzzy: '0',
      locale: LOCALE,
      initialAttributes: '',
      hideUnavailableItems: 'false',
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.route.params = { path: PATH }

    await facets(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(1)
    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/attribute_search/testattribute/shoes3/testattribute/shoes2/testattribute2/shirt3/testattribute2/shirt2`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params: {
        query: QUERY,
        page: '1',
        count: '20',
        operator: 'and',
        fuzzy: '0',
        locale: LOCALE,
        initialAttributes: '',
        'hide-unavailable-items': params.hideUnavailableItems,
      },
    })
    expect(ctx.body).toMatchObject(facetsExpectedResult)
    expect(ctx.status).toBe(200)
  })

  it('should add the x-vtex-is-filter header to the SP API call', async () => {
    spAPI.mockImplementation(async () => Promise.resolve(facetsResponseMock))

    const params = {
      query: QUERY,
    }

    ctx.query = params
    ctx.req = {
      headers: {
        'x-vtex-is-filter': SELLER,
      },
    } as any
    ctx.vtex.route.params = { path: PATH }

    await facets(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(1)
    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/attribute_search/testattribute/shoes3/testattribute/shoes2/testattribute2/shirt3/testattribute2/shirt2`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params,
      headers: {
        'X-VTEX-IS-Filter': SELLER,
      },
    })
    expect(ctx.body).toMatchObject(facetsExpectedResult)
    expect(ctx.status).toBe(200)
  })

  it('should set the visibility based on the catalog API', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(facetsWithcategoryResponseMock)
    )
    searchMock.specificationsByCategoryId.mockImplementation(
      async () => listBycategoryResponseMock
    )
    searchMock.getField.mockImplementation(async () => getFieldResponseMock)

    ctx.query = {}
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.route.params = { path: 'c/my-department' }

    await facets(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(1)
    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/attribute_search/c/my-department`
    )

    expect(ctx.body).toMatchObject(setVisibilityExpecteResult)
    expect(ctx.status).toBe(200)
  })

  it('should sort the values based on the catalog API', async () => {
    spAPI.mockImplementation(async () => Promise.resolve(facetsResponseMock))
    searchMock.specificationsByCategoryId.mockImplementation(async () => [])
    searchMock.facets.mockImplementation(async () => facetsCatalogResponseMock)
    searchMock.getFieldValues.mockImplementation(
      async () => getFieldValuesResponseMock
    )

    ctx.query = { query: QUERY }
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.route.params = { path: PATH }

    await facets(ctx, async () => {})

    expect(ctx.body).toMatchObject(facetsAfterSortExpectedResult)
    expect(ctx.status).toBe(200)
  })

  it('should add the trade-policy to the checkout and the SP call', async () => {
    spAPI.mockImplementation(async () => Promise.resolve(facetsResponseMock))

    const params = {
      query: QUERY,
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.route.params = { path: PATH }
    ctx.vtex.segment = {
      ...ctx.vtex.segment,
      channel: 1,
    } as SegmentData

    await facets(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(1)
    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/attribute_search/testattribute/shoes3/testattribute/shoes2/testattribute2/shirt3/testattribute2/shirt2/trade-policy/1`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params,
    })
    expect(ctx.status).toBe(200)
  })

  it('should add the trade-policy againt if it is alread in the path', async () => {
    spAPI.mockImplementation(async () => Promise.resolve(facetsResponseMock))

    const params = {
      query: QUERY,
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.route.params = { path: `${PATH}/trade-policy/1` }
    ctx.vtex.segment = {
      ...ctx.vtex.segment,
      channel: 1,
    } as SegmentData

    await facets(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(1)
    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/attribute_search/testattribute/shoes3/testattribute/shoes2/testattribute2/shirt3/testattribute2/shirt2/trade-policy/1`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params,
    })
    expect(ctx.status).toBe(200)
  })

  it('should add private seller to the SP API call', async () => {
    spAPI.mockImplementation(async () => Promise.resolve(facetsResponseMock))
    checkoutMock.regions.mockImplementation(async () => regionsMock)

    const params = {
      query: QUERY,
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.segment = {
      ...ctx.vtex.segment,
      regionId: 'myregionid',
    } as SegmentData

    await facets(ctx, async () => {})

    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/attribute_search/`
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
  })

  it('should add private seller to the SP API call if it is in the path', async () => {
    spAPI.mockImplementation(async () => Promise.resolve(facetsResponseMock))
    checkoutMock.regions.mockImplementation(async () => regionsMock)

    const params = {
      query: QUERY,
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.route.params = { path: `${PATH}/private-seller/myprivateseller` }

    await facets(ctx, async () => {})

    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params,
      headers: {
        'X-VTEX-IS-Filter': 'private-seller#myprivateseller',
      },
    })
    expect(ctx.status).toBe(200)
  })

  it('should add facets from the segment to the SP API call', async () => {
    spAPI.mockImplementation(async () => Promise.resolve(facetsResponseMock))
    checkoutMock.regions.mockImplementation(async () => regionsMock)

    const params = {
      query: QUERY,
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.segment = {
      ...ctx.vtex.segment,
      facets: 'category-1=shoes',
    } as SegmentData

    await facets(ctx, async () => {})

    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/attribute_search/category-1/shoes/`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params,
    })
    expect(ctx.status).toBe(200)
  })

  it('should add private seller to the SP API call even when it comes as a selectedFacet', async () => {
    spAPI.mockImplementation(async () => Promise.resolve(facetsResponseMock))
    checkoutMock.regions.mockImplementation(async () => regionsMock)

    const params = {
      query: QUERY,
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.segment = {
      ...ctx.vtex.segment,
      channel: 1,
    } as SegmentData
    ctx.vtex.route.params = { path: 'category-1/shoes/region-id/myregionid' }

    await facets(ctx, async () => {})

    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/attribute_search/category-1/shoes/trade-policy/1`
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
  })

  it('should add trade-policy seller to the SP API call even when it comes as a selectedFacet', async () => {
    spAPI.mockImplementation(async () => Promise.resolve(facetsResponseMock))
    checkoutMock.regions.mockImplementation(async () => regionsMock)

    const params = {
      query: QUERY,
    }

    ctx.query = params
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.segment = {
      ...ctx.vtex.segment,
    } as SegmentData
    ctx.vtex.route.params = { path: 'category-1/shoes/trade-policy/1' }

    await facets(ctx, async () => {})

    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/attribute_search/category-1/shoes/trade-policy/1`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params: {
        query: params.query,
      },
    })
    expect(ctx.status).toBe(200)
  })

  it('should order breadcrumb properly', async () => {
    spAPI.mockImplementation(async () => Promise.resolve(facetsMockBreadcrumb))

    ctx.query = {}
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.route.params = {
      path: 'c/sharedvalue/c/value/c/sharedvalue/shoes/shoes3/shirts/shirts1/shoes/shoes2',
    }

    await facets(ctx, async () => {})

    expect((ctx.body as any).breadcrumb).toMatchObject([
      {
        name: 'sharedvalue',
        href: '/sharedvalue',
      },
      {
        name: 'value',
        href: '/sharedvalue/value',
      },
      {
        name: 'sharedvalue',
        href: '/sharedvalue/value/sharedvalue',
      },
      {
        name: 'shoes3',
        href: '/sharedvalue/value/sharedvalue/shoes3?map=category-1,category-2,category-3,shoes',
      },
      {
        name: 'shirts1',
        href: '/sharedvalue/value/sharedvalue/shoes3/shirts1?map=category-1,category-2,category-3,shoes,shirts',
      },
      {
        name: 'shoes2',
        href: '/sharedvalue/value/sharedvalue/shoes3/shirts1/shoes2?map=category-1,category-2,category-3,shoes,shirts,shoes',
      },
    ])
  })

  it('should order breadcrumb properly when it is in another language', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(facetsMockBreadcrumbWithLocation)
    )

    ctx.query = {}
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.route.params = {
      path: 'c/sharedvalue/c/value/c/sharedvalue/shoes/shoes3/shirts/shirts1/shoes/shoes2',
    }

    await facets(ctx, async () => {})

    expect((ctx.body as any).breadcrumb).toMatchObject([
      {
        name: 'valorcompartilhado',
        href: '/valorcompartilhado',
      },
      {
        name: 'valor',
        href: '/valorcompartilhado/valor',
      },
      {
        name: 'valorcompartilhado',
        href: '/valorcompartilhado/valor/valorcompartilhado',
      },
      {
        name: 'sapatos3',
        href: '/valorcompartilhado/valor/valorcompartilhado/sapatos3?map=category-1,category-2,category-3,shoes',
      },
      {
        name: 'camisas1',
        href: '/valorcompartilhado/valor/valorcompartilhado/sapatos3/camisas1?map=category-1,category-2,category-3,shoes,shirts',
      },
      {
        name: 'sapatos2',
        href: '/valorcompartilhado/valor/valorcompartilhado/sapatos3/camisas1/sapatos2?map=category-1,category-2,category-3,shoes,shirts,shoes',
      },
    ])
  })

  it('should order breadcrumb properly when it is in another language but the keys still in the original language', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(facetsMockBreadcrumbWithLocation)
    )

    ctx.query = {}
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.route.params = {
      path: 'c/sharedvalue/c/valor/c/valorcompartilhado/shoes/sapatos3/shirts/shirts1/shoes/shoes2',
    }

    await facets(ctx, async () => {})

    expect((ctx.body as any).breadcrumb).toMatchObject([
      {
        name: 'valorcompartilhado',
        href: '/valorcompartilhado',
      },
      {
        name: 'valor',
        href: '/valorcompartilhado/valor',
      },
      {
        name: 'valorcompartilhado',
        href: '/valorcompartilhado/valor/valorcompartilhado',
      },
      {
        name: 'sapatos3',
        href: '/valorcompartilhado/valor/valorcompartilhado/sapatos3?map=category-1,category-2,category-3,shoes',
      },
      {
        name: 'camisas1',
        href: '/valorcompartilhado/valor/valorcompartilhado/sapatos3/camisas1?map=category-1,category-2,category-3,shoes,shirts',
      },
      {
        name: 'sapatos2',
        href: '/valorcompartilhado/valor/valorcompartilhado/sapatos3/camisas1/sapatos2?map=category-1,category-2,category-3,shoes,shirts,shoes',
      },
    ])
  })

  it('should not convert the breadcrumb from productClusterIds to productClusterNames when the API doesnt return any productClusterNames attribute', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(facetsMockBreadcrumbWithProductClusterIds)
    )

    ctx.query = {}
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.route.params = {
      path: 'shirts/shirts1/productclusterids/123',
    }

    await facets(ctx, async () => {})

    expect((ctx.body as any).breadcrumb).toMatchObject([
      {
        name: 'camisas1',
        href: '/camisas1?map=shirts',
      },
    ])
  })

  it('should convert the breadcrumb from productClusterIds to productClusterNames when the API returns a productClusterNames attribute', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(facetsMockBreadcrumbWithProductClusterNames)
    )

    ctx.query = {}
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.route.params = {
      path: 'shirts/shirts1/productclusterids/123',
    }

    await facets(ctx, async () => {})

    expect((ctx.body as any).breadcrumb).toMatchObject([
      {
        name: 'camisas1',
        href: '/camisas1?map=shirts',
      },
      {
        name: 'MyClusterName',
        href: '/camisas1/MyClusterName?map=shirts,productclusternames',
      },
    ])
  })

  it('should convert the breadcrumb from productClusterIds to productClusterNames even when the API returns multiple productClusterNames attributes', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(facetsMockBreadcrumbWithMultipleProductClusterNames)
    )

    ctx.query = {}
    ctx.req = { headers: {} } as IncomingMessage
    ctx.vtex.route.params = {
      path: 'shirts/shirts1/productclusterids/123/productclusterids/124',
    }

    await facets(ctx, async () => {})

    expect((ctx.body as any).breadcrumb).toMatchObject([
      {
        name: 'camisas1',
        href: '/camisas1?map=shirts',
      },
      {
        name: 'MyClusterName',
        href: '/camisas1/MyClusterName?map=shirts,productclusternames',
      },
      {
        name: 'MyClusterName2',
        href: '/camisas1/MyClusterName/MyClusterName2?map=shirts,productclusternames,productclusternames',
      },
    ])
  })
})
