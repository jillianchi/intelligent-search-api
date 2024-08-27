import type { IOContext } from '@vtex/api'

import IntelligentSearch from '../clients/intelligent-search'
import autocompleteSearchSuggestions from '../middlewares/autocompleteSearchSuggestions'
import { autocompleteSearchSuggestionsResponseMock } from '../__mock__/autocompleteSearchSuggestionsResponseMock'
import HttpClientMock from '../__mock__/HttpClientMock'

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

describe('autocompleteSearchSuggestions', () => {
  it('should call the SP API properly and returns the result if it was 2xx', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(autocompleteSearchSuggestionsResponseMock)
    )

    const params = {
      query: QUERY,
    }

    ctx.query = params

    await autocompleteSearchSuggestions(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(1)
    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/suggestion_searches`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params: {
        term: params.query,
      },
    })
    expect(ctx.body).toStrictEqual(autocompleteSearchSuggestionsResponseMock)
    expect(ctx.status).toBe(200)
  })

  it('should add the locale to the SP API call', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(autocompleteSearchSuggestionsResponseMock)
    )

    const params = {
      query: QUERY,
      locale: LOCALE,
    }

    ctx.query = params

    await autocompleteSearchSuggestions(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(1)
    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/suggestion_searches`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params: {
        term: params.query,
        locale: LOCALE,
      },
    })
    expect(ctx.body).toStrictEqual(autocompleteSearchSuggestionsResponseMock)
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

    await expect(
      autocompleteSearchSuggestions(ctx, async () => {})
    ).rejects.toThrow()
  })

  it('should return the default response if there is no query', async () => {
    await autocompleteSearchSuggestions(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(0)
    expect(ctx.body).toStrictEqual({
      searches: [],
    })
  })
})
