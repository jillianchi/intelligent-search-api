import type { IOContext } from '@vtex/api'

import IntelligentSearch from '../clients/intelligent-search'
import correction from '../middlewares/correction'
import { correctionResponseMock } from '../__mock__/correctionResponseMock'
import HttpClientMock from '../__mock__/HttpClientMock'

const ACCOUNT = 'storecomponents'
const QUERY = 'topi'
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

describe('correction', () => {
  it('should call the SP API properly and returns the result if it was 2xx', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(correctionResponseMock)
    )

    const params = {
      query: QUERY,
    }

    ctx.query = params

    await correction(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(1)
    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/correction_search/`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params,
    })
    expect(ctx.body).toStrictEqual({
      correction: correctionResponseMock.correction,
    })
    expect(ctx.status).toBe(200)
  })

  it('should add the locale to the SP API call', async () => {
    spAPI.mockImplementation(async () =>
      Promise.resolve(correctionResponseMock)
    )

    const params = {
      query: QUERY,
      locale: LOCALE,
    }

    ctx.query = params

    await correction(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(1)
    expect(spAPI.mock.calls[0][0]).toBe(
      `/search-api/v1/${ACCOUNT}/api/io/split/correction_search/`
    )
    expect(spAPI.mock.calls[0][1]).toMatchObject({
      params,
    })
    expect(ctx.body).toStrictEqual({
      correction: correctionResponseMock.correction,
    })
    expect(ctx.status).toBe(200)
  })

  it('should return the default response if there is no query', async () => {
    await correction(ctx, async () => {})

    expect(spAPI.mock.instances).toHaveLength(0)
    expect(ctx.body).toStrictEqual({
      correction: {
        correction: false,
        misspelled: false,
        text: '',
        highlighted: '',
      },
    })
  })

  it('throws an error if the SP API call fails', async () => {
    spAPI.mockImplementation(async () => {
      throw new Error('Api Error')
    })

    const params = {
      query: QUERY,
      locale: LOCALE,
    }

    ctx.query = params

    await expect(correction(ctx, async () => {})).rejects.toThrow()
  })
})
