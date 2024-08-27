import type { IOContext } from '@vtex/api'

import IntelligentSearch from '../clients/intelligent-search'
import topSearches from '../middlewares/topSearches'
import HttpClientMock from '../__mock__/HttpClientMock'
import { topSearchesResponseMock } from '../__mock__/topSearchesResponseMock'

const ACCOUNT = 'storecomponents'
const LOCALE = 'en-US'

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
    state: {},
  } as Context
})

afterEach(() => {
  spAPI.mockRestore()
})

describe('topSearches', () => {
  it('should calls the SP API properly and returns the result if it was 2xx', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(topSearchesResponseMock)
    )

    await topSearches(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(1)
    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/top_searches`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params: {},
    })
    expect(ctx.body).toStrictEqual(topSearchesResponseMock)
    expect(ctx.status).toBe(200)
  })

  it('should add the locale to the SP API call', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(topSearchesResponseMock)
    )

    const params = {
      locale: LOCALE,
    }

    ctx.query = params

    await topSearches(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(1)
    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/top_searches`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params,
    })
  })

  it('throws an error if the SP API call fails', async () => {
    spAPI.mockImplementation(async () => {
      throw new Error('Api Error')
    })

    await expect(topSearches(ctx, async () => {})).rejects.toThrow()
  })
})
