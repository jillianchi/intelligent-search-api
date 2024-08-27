import { ExternalClient, InstanceOptions, IOContext } from '@vtex/api'

const BASE_URL = 'http://is-ab.vtex.systems/api'

type Experiment = {
  id: string
  variants: Variant[]
}

type Variant = {
  id: string
  configuration: Record<string, Record<string, string>>
}

export class Osiris extends ExternalClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(BASE_URL, context, options)
  }

  public proxy(account: string, path: string, params: any): Promise<unknown> {
    return this.http.get(path, {
      params: {
        ...params,
        an: account,
      },
      headers: {
        'X-Vtex-Use-Https': 'true',
      },
      maxRedirects: 5,
    })
  }

  public activeExperiment({ vtex: { account } }: Context): Promise<Experiment> {
    return this.http.get('/v1/experiment/active', {
      params: {
        an: account,
      },
      headers: {
        'X-Vtex-Use-Https': 'true',
      },
      maxRedirects: 5,
    })
  }
}
