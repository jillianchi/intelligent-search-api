import type { IOContext } from '@vtex/api'

import IntelligentSearch from '../clients/intelligent-search'
import searchSuggestions from '../middlewares/searchSuggestions'
import HttpClientMock from '../__mock__/HttpClientMock'
import { searchSuggestionsResponseMock } from '../__mock__/searchSuggestionsResponseMock'

const ACCOUNT = 'storecomponents'
const QUERY = 'top'
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

describe('searchSuggestions', () => {
  it('should call the SP API properly and returns the result if it was 2xx', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(searchSuggestionsResponseMock)
    )

    const params = {
      query: QUERY,
    }

    ctx.query = params

    await searchSuggestions(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(1)
    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/suggestion_search/`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params,
    })
    expect(ctx.body).toStrictEqual(searchSuggestionsResponseMock.suggestion)
    expect(ctx.status).toBe(200)
  })

  it('should add the locale to the SP API call', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(searchSuggestionsResponseMock)
    )

    const params = {
      query: QUERY,
      locale: LOCALE,
    }

    ctx.query = params

    await searchSuggestions(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(1)
    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/suggestion_search/`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params,
    })
    expect(ctx.body).toStrictEqual(searchSuggestionsResponseMock.suggestion)
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

    await expect(searchSuggestions(ctx, async () => {})).rejects.toThrow()
  })

  it('should return the default response if there is no query', async () => {
    await searchSuggestions(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(0)
    expect(ctx.body).toStrictEqual({
      searches: [],
    })
  })
})
