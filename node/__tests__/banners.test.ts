import type { IOContext } from '@vtex/api'

import IntelligentSearch from '../clients/intelligent-search'
import banners from '../middlewares/banners'
import { bannersResponseMock } from '../__mock__/bannersResponseMock'
import HttpClientMock from '../__mock__/HttpClientMock'

const ACCOUNT = 'storecomponents'
const QUERY = 'top'
const LOCALE = 'en-US'
const PATH = 'category-1/shoes'
const bannersExpectedResult = {
  banners: bannersResponseMock.banners.map(({ id, name, area, html }) => ({
    id,
    name,
    area,
    html,
  })),
}

let ctx: Context

const httpClientMock = new HttpClientMock()

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

describe('banners', () => {
  it('should call the SP API properly and returns the result if it was 2xx', async () => {
    spAPI.mockImplementation(async () => Promise.resolve(bannersResponseMock))

    const params = {
      query: QUERY,
    }

    ctx.query = params

    await banners(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(1)
    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/banner_search/`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params,
    })
    expect(ctx.body).toStrictEqual(bannersExpectedResult)
    expect(ctx.status).toBe(200)
  })

  it('should add the locale to the SP API call', async () => {
    spAPI.mockImplementation(async () => Promise.resolve(bannersResponseMock))

    const params = {
      query: QUERY,
      locale: LOCALE,
    }

    ctx.query = params

    await banners(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(1)
    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/banner_search/`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params,
    })
    expect(ctx.body).toStrictEqual(bannersExpectedResult)
    expect(ctx.status).toBe(200)
  })

  it('should add the path to the SP API call', async () => {
    spAPI.mockImplementation(async () => Promise.resolve(bannersResponseMock))

    const params = {
      query: QUERY,
    }

    ctx.query = params
    ctx.vtex.route.params = { path: PATH }

    await banners(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(1)
    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/banner_search/${PATH}`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params,
    })
    expect(ctx.body).toStrictEqual(bannersExpectedResult)
    expect(ctx.status).toBe(200)
  })

  it('throws an error if the SP API call fails', async () => {
    spAPI.mockImplementation(async () => {
      throw new Error('Api Error')
    })

    const params = {
      query: QUERY,
    }

    ctx.query = params

    await expect(banners(ctx, async () => {})).rejects.toThrow()
  })
})
