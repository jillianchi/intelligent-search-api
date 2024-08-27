import type { HttpClient, InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'
import { convertSearchDocument } from '@vtex/vtexis-compatibility-layer'

import handleAPIError from '../middlewares/utils/handleAPIError'
import productsCatalog from '../middlewares/utils/productsCatalog'
import { translateLinkText } from '../middlewares/utils/translation'
import validNavigationPage from '../middlewares/utils/validateNavigationPage'
import {
  convertProducts,
  fillProductWithSimulation,
} from './compatibility-layer'
import { logDegradedSearchError } from './utils'
import removeUnnecessaryFields from '../middlewares/utils/filterFields'

const ALLOWED_QUERYSTRINGS = [
  'query',
  'q',
  'page',
  'p',
  'count',
  'c',
  'sort',
  's',
  'operator',
  'o',
  'fuzzy',
  'f',
  'biggy-search',
  'location',
  'image',
  'hide-unavailable-items',
  'locale',
  'letorEnabled',
  'letorModel',
  'merchRulesEnabled',
  'priorityBoostsEnabled',
  'secondaryBoostsEnabled',
  'privateSellersFilterEnabled',
  'regionalizationTradePolicy',
  'regionalizationV2',
  'regionalizationBehavior',
  'regionId',
  'allowRedirect',
  'bgy_leap',
  'initialAttributes',
  'searchState',
  'term',
  'letorWindowSize',
  'v',
  'dynamicRule',
  'show-invisible-items',
]

const TENANT_LOCALE_HEADER = 'X-VTEX-IS-TenantLocale'

const filterAllowedQuerystrings = (params: { [key: string]: unknown }) =>
  Object.keys(params ?? {}).reduce((finalObj, currentParam) => {
    if (ALLOWED_QUERYSTRINGS.indexOf(currentParam) > -1) {
      finalObj[currentParam] = params[currentParam]
    }

    return finalObj
  }, {} as { [key: string]: unknown })

export default class IntelligentSearch extends JanusClient {
  private store: string

  constructor(
    context: IOContext,
    options?: InstanceOptions,
    http?: HttpClient
  ) {
    super(context, { ...options })

    const { account } = context

    this.store = account

    // Useful for testing
    if (http) {
      this.http = http
    }
  }

  public async topSearches(
    ctx: Context,
    params: { locale?: string }
  ): Promise<any> {
    return this.http
      .get(`/search-api/v1/${this.store}/api/top_searches`, {
        params: filterAllowedQuerystrings(params),
        headers: { ...ctx.state.requestHeaders },
        metric: 'top-searches',
      })
      .catch((e) => {
        throw handleAPIError(e)
      })
  }

  public async searchSuggestions(
    ctx: Context,
    params: SuggestionsParams
  ): Promise<any> {
    const url = `/search-api/v1/${this.store}/api/io/split/suggestion_search/`

    return this.http
      .get(url, {
        params: filterAllowedQuerystrings(params as { [key: string]: unknown }),
        headers: { ...ctx.state.requestHeaders },
        metric: 'search-suggestions',
      })
      .catch((e) => {
        throw handleAPIError(e)
      })
  }

  public async autocompleteSearchSuggestions(
    ctx: Context,
    params: {
      query?: string
      locale?: string
    }
  ): Promise<any> {
    return this.http
      .get(`/search-api/v1/${this.store}/api/suggestion_searches`, {
        params: {
          term: params.query,
          locale: params.locale,
        },
        headers: { ...ctx.state.requestHeaders },
        metric: 'search-autocomplete-suggestions',
      })
      .catch((e) => {
        throw handleAPIError(e)
      })
  }

  public async correction(
    ctx: Context,
    params: SuggestionsParams
  ): Promise<Correction> {
    const url = `/search-api/v1/${this.store}/api/io/split/correction_search/`

    return this.http
      .get(url, {
        params: filterAllowedQuerystrings(params as { [key: string]: unknown }),
        headers: { ...ctx.state.requestHeaders },
        metric: 'search-correction',
      })
      .catch((e) => {
        throw handleAPIError(e)
      })
  }

  public async banners(
    ctx: Context,
    path: string,
    params: { query?: string; locale?: string }
  ): Promise<any> {
    const url = `/search-api/v1/${this.store}/api/io/split/banner_search/${
      path ?? ''
    }`

    return this.http
      .get(url, {
        params: filterAllowedQuerystrings(params as { [key: string]: unknown }),
        headers: { ...ctx.state.requestHeaders },
        metric: 'banners',
      })
      .catch((e) => {
        throw handleAPIError(e)
      })
  }

  public async product(ctx: Context, params: ProductParams) {
    let { id } = params

    if (params.type !== 'product.id') {
      const searchUrl = `/search-api/v1/${
        this.store
      }/api/io/split/product_search/trade-policy/${params.salesChannel ?? '1'}`

      const searchProduct: SearchResult = await this.http.get(searchUrl, {
        params: {
          query: `${params.type}:${params.id}`,
          locale: params.locale,
          sourceIncludes: 'product',
        },
        headers: { ...ctx.state.requestHeaders },
        metric: 'searchWithId',
      })

      if (!searchProduct.products[0]?.product) {
        return []
      }

      id = searchProduct.products[0].product
    }

    const documentsURL = `/api/search-documents/documents/skudocument/${id}`
    const offersURL = `/api/search-documents/documents/skuoffer/${id}`

    const documentsPromise = this.http
      .get(documentsURL, {
        params: {
          an: this.store,
          decompress: true,
          v: 1,
        },
        headers: { ...ctx.state.requestHeaders },
        metric: 'product-documents',
      })
      .catch((e) => {
        throw handleAPIError(e)
      })

    const offersPromise = this.http
      .get<{ [skuId: string]: SkuOfferDetails } | null | undefined>(offersURL, {
        params: {
          an: this.store,
          decompress: true,
          v: 1,
        },
        headers: { ...ctx.state.requestHeaders },
        metric: 'product-offers',
      })
      .catch((e) => {
        throw handleAPIError(e)
      })

    const [documents, offers] = await Promise.all([
      documentsPromise,
      offersPromise,
    ])

    const offersMap = new Map(Object.entries(offers ?? {}))
    const filteredOffers: Record<string, SkuOfferDetails> = {}

    offersMap.forEach((value, key) => {
      const salesChannelOffer =
        value.SkuCommercialOfferPerSalesChannel[params.salesChannel ?? '1']

      if (!salesChannelOffer) {
        return
      }

      const filteredSkuSellers = value.SkuSellers.filter((seller) =>
        seller.AvailableSalesChannels.includes(Number(params.salesChannel))
      )

      filteredOffers[key] = {
        ...value,
        SkuSellers: filteredSkuSellers,
        SkuCommercialOfferPerSalesChannel: {
          [params.salesChannel ?? '1']: salesChannelOffer,
        },
      }
    })

    if (!documents?.length || !Object.keys(filteredOffers).length) {
      return []
    }

    let translationsInfo

    if (ctx.state.requestHeaders?.[TENANT_LOCALE_HEADER]) {
      const tenantInfo = JSON.parse(
        Buffer.from(
          ctx.state.requestHeaders[TENANT_LOCALE_HEADER],
          'base64'
        ).toString('ascii')
      )

      const localeSelected =
        params.locale ?? ctx.vtex.locale ?? tenantInfo.defaultLocale

      if (tenantInfo.defaultLocale !== localeSelected) {
        const translationsUrl = `/api/search-documents/documents/translations/${id}`
        const translations = await this.http
          .get<Record<string, string[]> | null>(translationsUrl, {
            params: {
              an: this.store,
              decompress: true,
              v: 1,
            },
            headers: { ...ctx.state.requestHeaders },
            metric: 'product-documents',
          })
          .catch((e) => {
            throw handleAPIError(e)
          })

        translationsInfo = translations?.fields.map((field, index) => ({
          field,
          context: translations.context?.[index] ?? '',
          translation:
            translations[localeSelected]?.[index] ??
            translations[tenantInfo.defaultLocale][index],
        }))
      }
    }

    const productResponse = await convertSearchDocument(
      documents,
      filteredOffers,
      this.store,
      translationsInfo
    )

    const {
      vtex: { logger },
      clients: { store },
    } = ctx

    const productWithSimulationPromise = productResponse.map((product) =>
      fillProductWithSimulation(
        product,
        store,
        'default',
        logger,
        params.regionId,
        params.salesChannel ?? '1'
      )
    )

    const productsWithSimulation = (await Promise.all(
      productWithSimulationPromise
    )) as Product[]

    return productsWithSimulation.map((product) =>
      removeUnnecessaryFields(product)
    )
  }

  // eslint-disable-next-line max-params
  public async facets(
    ctx: Context,
    path: string,
    params: SearchParams,
    ISFilterHeader: string
  ): Promise<any> {
    const cache = validNavigationPage(path, params.query)
      ? { forceMaxAge: 3600 }
      : {}

    const url = `/search-api/v1/${this.store}/api/io/split/attribute_search/${path}`

    return this.http
      .get(url, {
        params: {
          ...filterAllowedQuerystrings(params as { [key: string]: unknown }),
          'hide-unavailable-items': params.hideUnavailableItems,
        },
        metric: 'facets',
        headers: {
          'X-VTEX-IS-Filter': ISFilterHeader,
          'X-VTEX-IS-ID': `${this.store}`,
          ...ctx.state.requestHeaders,
        },
        ...cache,
      })
      .catch((e) => {
        throw handleAPIError(e)
      })
  }

  // eslint-disable-next-line max-params
  public async suggestionProducts(
    ctx: Context,
    params: SuggestionProductsParams,
    body: SuggestionProductsBody,
    ISFilterHeader: string
  ): Promise<any> {
    return this.http
      .post(`/search-api/v1/${this.store}/api/suggestion_products`, body, {
        metric: 'suggestion-products',
        params: filterAllowedQuerystrings(params as { [key: string]: unknown }),
        headers: {
          'X-VTEX-IS-Filter': ISFilterHeader,
          'X-VTEX-IS-ID': `${this.store}`,
          ...ctx.state.requestHeaders,
        },
      })
      .catch((e) => {
        throw handleAPIError(e)
      })
  }

  // eslint-disable-next-line max-params
  public async productSearch(
    ctx: Context,
    path: string,
    params: SearchParams,
    ISFilterHeader: string
  ) {
    const cache = validNavigationPage(path, params.query)
      ? { forceMaxAge: 3600 }
      : {}

    const url = `/search-api/v1/${this.store}/api/io/split/product_search/${path}`

    const requestParams = {
      ...filterAllowedQuerystrings(params as { [key: string]: unknown }),
      ...filterAllowedQuerystrings(
        ctx.state.additionalParams as { [key: string]: unknown }
      ),
      'hide-unavailable-items': params.hideUnavailableItems,
    }

    if (process.env.VTEX_APP_LINK) {
      // eslint-disable-next-line no-console
      console.log({
        url,
        requestParams,
        'X-VTEX-IS-Filter': ISFilterHeader,
        ...ctx.state.requestHeaders,
      })
    }

    const result = await this.http
      .get(url, {
        params: requestParams,
        metric: 'search-result',
        headers: {
          'X-VTEX-IS-Filter': ISFilterHeader,
          'X-VTEX-IS-ID': `${this.store}`,
          ...ctx.state.requestHeaders,
        },
        ...cache,
      })
      .catch((e) => {
        throw handleAPIError(e)
      })

    if (!result?.total) {
      this.context.logger.warn({
        message: 'Empty search',
        url,
        params,
      })
    }

    let convertedProducts = []
    let productOriginFailed = false

    if (params.productOriginVtex === 'true') {
      try {
        convertedProducts = await productsCatalog({
          searchResult: result,
          ctx,
          tradePolicy: params.salesChannel,
          regionId: params.regionId,
        })
      } catch (e) {
        productOriginFailed = true

        logDegradedSearchError(ctx.vtex.logger, {
          service: 'Catalog productsById',
          error:
            'It was not possible to get products from SOLR (productOriginVtex=true). Elastic Search will be returned instead',
          errorStack: e,
        })
      }
    }

    if (params.productOriginVtex !== 'true' || productOriginFailed) {
      convertedProducts = await convertProducts(
        result.products,
        ctx,
        params.simulationBehavior ?? 'default',
        params.salesChannel,
        params.regionId,
        Boolean(params.debugMode)
      )
    }

    convertedProducts.forEach(async (product) => {
      product.origin =
        params.productOriginVtex === 'true' ? 'catalog' : 'intelligent-search'
    })

    // translate link text
    const translationPromises = convertedProducts.map((product) =>
      translateLinkText(product, ctx).then(
        (linkText) => (product.linkText = linkText.normalize('NFC'))
      )
    )

    await Promise.all(translationPromises)

    return {
      products: convertedProducts,
      recordsFiltered: result.total,
      correction: result.correction,
      fuzzy: result.fuzzy,
      operator: result.operator,
      redirect: result.redirect,
      translated: result.translated,
      pagination: result.pagination,
    }
  }

  public async productsById(
    ctx: Context,
    ids: string[],
    indetifierField: SponsoredProductIdentifierField = 'anyId'
  ) {
    if (!ids.length) {
      return []
    }

    const identifierQuery = this.identifierFieldToQuery[indetifierField]
    const query = `${identifierQuery}:${ids.join(';')}`

    const result = await this.productSearch(ctx, '', { query }, '')

    return result.products
  }

  private identifierFieldToQuery: Record<
    SponsoredProductIdentifierField,
    string
  > = {
    skuId: 'sku.id',
    product: 'product',
    anyId: 'id',
  }
}
