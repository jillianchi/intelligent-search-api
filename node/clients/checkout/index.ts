import type { IOContext, InstanceOptions, RequestConfig } from '@vtex/api'
import { JanusClient } from '@vtex/api'

import { statusToError } from './utils'

export class Checkout extends JanusClient {
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, {
      ...options,
      headers: {
        ...options?.headers,
        vtexIdclientAutCookie: ctx.authToken,
      },
    })
  }

  public regions = (regionId: string, channel?: number | string) =>
    this.http.get(this.routes.regions(regionId, channel))

  protected post = <T>(url: string, data?: any, config: RequestConfig = {}) => {
    return this.http
      .post<T>(url, data, config)
      .catch(statusToError) as Promise<T>
  }

  private get routes() {
    const base = '/api/checkout'

    return {
      simulation: (queryString: string) =>
        `${base}/pvt/orderForms/simulation${queryString}`,
      regions: (regionId: string, channel?: number | string) =>
        `${base}/pub/regions/${regionId}${channel ? `?sc=${channel}` : ''}`,
    }
  }
}
