import type {
  HttpClient,
  InstanceOptions,
  IOContext,
  RequestConfig,
  Serializable,
} from '@vtex/api'
import { AppClient, GraphQLClient } from '@vtex/api'

export class GraphQLServer extends AppClient {
  protected graphql: GraphQLClient

  constructor(ctx: IOContext, opts?: InstanceOptions, http?: HttpClient) {
    super('vtex.graphql-server@1.x', ctx, opts)

    // Useful for testing
    if (http) {
      this.http = http
    }

    this.graphql = new GraphQLClient(this.http)
  }

  public async query<T extends Serializable, U extends Record<string, unknown>>(
    query: string,
    variables: U,
    config: RequestConfig
  ) {
    return this.graphql.query<T, U>(
      {
        query,
        variables,
      },
      {
        ...config,
        params: {
          ...config.params,
          locale: this.context.locale,
        },
        url: '/graphql',
      }
    )
  }
}
