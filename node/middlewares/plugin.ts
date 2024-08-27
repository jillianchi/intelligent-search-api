import type { AppMetaInfo } from '@vtex/api'

import {
  parsedUrlQueryAndPathToSearchPluginParams,
  searchPluginParamsToParsedUrlQueryAndPath,
} from './utils/searchPluginParamsConversion'

const PLUGIN_NAME = 'is-api-middleware-graphql'
const PLUGIN_QUERY = `query before(
  $selectedFacets: [SelectedFacetInput]
  $query: String
  $page: Int
  $count: Int
  $sort: String
  $operator: Operator
  $fuzzy: String
  $searchState: String
  $allowRedirect: Boolean
  $regionId: String
  $simulationBehavior: SimulationBehavior
  $hideUnavailableItems: Boolean
  $dynamicRules: [DynamicRuleInput]
) {
  before(selectedFacets: $selectedFacets
    query: $query
    page: $page
    count: $count
    sort: $sort
    operator: $operator
    fuzzy: $fuzzy
    searchState: $searchState
    allowRedirect: $allowRedirect
    regionId: $regionId
    simulationBehavior: $simulationBehavior
    hideUnavailableItems: $hideUnavailableItems
    dynamicRules: $dynamicRules)
    @context(provider: "vtex.is-api-middleware-graphql") {
    query
    page
    count
    sort
    operator
    fuzzy
    allowRedirect
    regionId
    simulationBehavior
    hideUnavailableItems
    dynamicRules {
      action
      type
      value
    }
  }
}`

type CompleteAppMetaInfo = AppMetaInfo & { name: string; vendor: string }

export default async function plugin(ctx: Context, next: () => Promise<void>) {
  const {
    vtex: {
      route: {
        params: { path = '' },
      },
    },
    clients: { apps, graphQLServer },
  } = ctx

  try {
    const metaInfo = (await apps.getAppsMetaInfos()) as CompleteAppMetaInfo[]

    const isMiddlewareGraphqlInstalled = !!metaInfo.find(
      (app) => PLUGIN_NAME === app.name && app.vendor === 'vtex'
    )

    if (isMiddlewareGraphqlInstalled) {
      const params = await graphQLServer.query<
        { before: SearchPluginParams },
        SearchPluginParams
      >(
        PLUGIN_QUERY,
        parsedUrlQueryAndPathToSearchPluginParams(ctx.query, path as string),
        {
          metric: 'is-api-middleware-graphql',
        }
      )

      if (params.data) {
        const { query: pluginQuery, path: pluginPath } =
          searchPluginParamsToParsedUrlQueryAndPath(params.data.before)

        if (process.env.VTEX_APP_LINK) {
          console.log(
            `Params from plugin: ${JSON.stringify({
              query: pluginQuery,
              path: pluginPath,
            })}\nParams from client: ${JSON.stringify({
              query: ctx.query,
              path,
            })}  `
          )
        }

        ctx.query = { ...ctx.query, ...pluginQuery }
        ctx.vtex.route.params.path = params.data.before.selectedFacets
          ? pluginPath
          : path
      }
    }
  } catch (e) {
    ctx.vtex.logger.error({
      ...e,
      message: `Error on search plugin: ${e.message}`,
    })
  }

  await next()
}
