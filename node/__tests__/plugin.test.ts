import type { IOContext } from '@vtex/api'

import { GraphQLServer } from '../clients/graphql-server'
import plugin from '../middlewares/plugin'
import HttpClientMock from '../__mock__/HttpClientMock'

const ACCOUNT = 'storecomponents'
const QUERY = 'top'
const PATH = 'category-1/shoes'

let ctx: Context

const httpClientMock = new HttpClientMock()
const getAppsMetaInfosMock = jest.fn()
const loggerErrorMock = jest.fn()

const { getWithBody: pluginResolverMock } = httpClientMock

beforeEach(() => {
  ctx = {
    clients: {
      apps: {
        getAppsMetaInfos: getAppsMetaInfosMock,
      },
      graphQLServer: new GraphQLServer(
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
      logger: {
        error: loggerErrorMock,
      },
    },
    state: {},
  } as any
})

afterEach(() => {
  pluginResolverMock.mockRestore()
  getAppsMetaInfosMock.mockRestore()
  loggerErrorMock.mockRestore()
})

describe('plugin', () => {
  it('should ignore the plugin if vtex.is-api-middleware-graphql is not installed', async () => {
    getAppsMetaInfosMock.mockImplementation(async () => Promise.resolve([]))

    const params = {
      query: QUERY,
    }

    ctx.query = params
    ctx.vtex.route.params = { path: PATH }

    await plugin(ctx, async () => {})

    expect(pluginResolverMock.mock.instances).toHaveLength(0)
    expect(ctx.query).toStrictEqual(params)
    expect(ctx.vtex.route.params.path).toStrictEqual(PATH)
  })

  it('should call graphqlServer when the vtex.is-api-middleware-graphql is installed and overwrite the client params', async () => {
    getAppsMetaInfosMock.mockImplementation(async () =>
      Promise.resolve([
        {
          name: 'is-api-middleware-graphql',
          vendor: 'vtex',
        },
      ])
    )

    const pluginParams = {
      dynamicRules: [
        {
          action: 'add',
          type: 'id',
          value: '123',
        },
        {
          action: 'promote',
          type: 'skuId',
          value: '456',
        },
      ],
      selectedFacets: [
        {
          key: 'color',
          value: 'blue',
        },
        {
          key: 'brand',
          value: 'awesome',
        },
      ],
      query: 'overwrite query',
    }

    pluginResolverMock.mockImplementation(async () =>
      Promise.resolve({
        data: {
          before: pluginParams,
        },
      })
    )

    const params = {
      query: QUERY,
      page: '1',
      sort: 'price:asc',
    }

    ctx.query = params
    ctx.vtex.route.params = { path: PATH }

    await plugin(ctx, async () => {})

    expect(pluginResolverMock.mock.instances).toHaveLength(1)

    expect(pluginResolverMock.mock.calls[0][1].variables).toMatchObject({
      ...params,
      allowRedirect: false,
      hideUnavailableItems: false,
      selectedFacets: [{ key: 'category-1', value: 'shoes' }],
    })
    expect(ctx.query).toStrictEqual({
      ...params,
      query: pluginParams.query,
      dynamicRule: 'add:id:123;promote:sku.id:456',
    })
    expect(ctx.vtex.route.params.path).toStrictEqual(
      '/color/blue/brand/awesome'
    )
  })

  it('should ignore the plugin if the apps throws an error. It also should log the error to the log', async () => {
    getAppsMetaInfosMock.mockImplementation(async () => {
      throw new Error('test error')
    })

    const params = {
      query: QUERY,
    }

    ctx.query = params
    ctx.vtex.route.params = { path: PATH }

    await plugin(ctx, async () => {})

    expect(loggerErrorMock.mock.instances).toHaveLength(1)
    expect(ctx.query).toStrictEqual(params)
    expect(ctx.vtex.route.params.path).toStrictEqual(PATH)
  })

  it('should ignore the plugin if the grpahqlServer throws an error. It also should log the error to the log', async () => {
    getAppsMetaInfosMock.mockImplementation(async () =>
      Promise.resolve([
        {
          name: 'is-api-middleware-graphql',
          vendor: 'vtex',
        },
      ])
    )

    pluginResolverMock.mockImplementation(() => {
      throw new Error('test error')
    })

    const params = {
      query: QUERY,
    }

    ctx.query = params
    ctx.vtex.route.params = { path: PATH }

    await plugin(ctx, async () => {})

    expect(loggerErrorMock.mock.instances).toHaveLength(1)
    expect(ctx.query).toStrictEqual(params)
    expect(ctx.vtex.route.params.path).toStrictEqual(PATH)
  })
})
