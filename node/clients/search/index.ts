import type {
  InstanceOptions,
  IOContext,
  RequestConfig,
  SegmentData,
} from '@vtex/api'
import { AppClient } from '@vtex/api'
import { stringify } from 'qs'

const inflightKey = ({ baseURL, url, params, headers }: RequestConfig) => {
  return `${
    baseURL! +
    url! +
    stringify(params, { arrayFormat: 'repeat', addQueryPrefix: true })
  }&segmentToken=${headers['x-vtex-segment']}`
}

/** Search API
 * Docs: https://documenter.getpostman.com/view/845/catalogsystem-102/Hs44
 */
export class Search extends AppClient {
  private basePath: string

  private addSalesChannel = (
    url: string,
    salesChannel?: string | number | null
  ) => {
    if (!salesChannel) {
      return url
    }

    if (!url.includes('?')) {
      return url.concat(`?sc=${salesChannel}`)
    }

    return url.concat(`&sc=${salesChannel}`)
  }

  private addCompleteSpecifications = (url: string) => {
    if (!url.includes('?')) {
      return `${url}?compSpecs=true`
    }

    return `${url}&compSpecs=true`
  }

  private getVtexSegmentCookieAsHeader = (vtexSegment?: string) => {
    return vtexSegment ? { 'x-vtex-segment': vtexSegment } : {}
  }

  constructor(ctx: IOContext, opts?: InstanceOptions) {
    super('vtex.catalog-api-proxy@0.x', ctx, opts)

    this.basePath = ctx.sessionToken
      ? '/proxy/authenticated/catalog'
      : '/proxy/catalog'
  }

  public productsById = (
    ids: string[],
    vtexSegment?: string,
    salesChannel?: string | number | null
  ) =>
    this.get<Product[]>(
      this.addCompleteSpecifications(
        this.addSalesChannel(
          `/pub/products/search?${ids
            .map((id) => `fq=productId:${id}`)
            .join('&')}`,
          salesChannel
        )
      ),
      {
        metric: 'search-productById',
        headers: this.getVtexSegmentCookieAsHeader(vtexSegment),
      }
    )

  private get = <T = any>(url: string, config: RequestConfig = {}) => {
    const segmentData: SegmentData | undefined = (
      this.context! as CustomIOContext
    ).segment

    const { channel: salesChannel = '' } = segmentData || {}

    config.params = {
      ...config.params,
      ...(!!salesChannel && { sc: salesChannel }),
    }
    config.inflightKey = inflightKey

    return this.http.get<T>(`${this.basePath}${url}`, config)
  }

  public specificationsByCategoryId = (categoryId: number) => {
    return this.get(`/pub/specification/field/listByCategoryId/${categoryId}`, {
      metric: 'catalog-get-field-value-by-id',
    })
  }

  public getField = (id: number) =>
    this.get(`/pub/specification/fieldGet/${id}`, {
      metric: 'catalog-get-field-by-id',
    })

  public getFieldValues = (id: number) => {
    try {
      return this.get(`/pub/specification/fieldvalue/${id}`, {
        metric: 'catalog-get-field-value-by-id',
      })
    } catch {
      return []
    }
  }
}
