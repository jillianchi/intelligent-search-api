import type { Cached, ClientsConfig } from '@vtex/api'
import { LRUCache, method, Service } from '@vtex/api'

import { Clients } from './clients'
import autocompleteSearchSuggestions from './middlewares/autocompleteSearchSuggestions'
import banners from './middlewares/banners'
import correction from './middlewares/correction'
import facets from './middlewares/facets'
import productSearch from './middlewares/productSearch'
import product from './middlewares/product'
import searchSuggestions from './middlewares/searchSuggestions'
import topSearches from './middlewares/topSearches'
import withSegment from './middlewares/withSegment'
import tenant from './middlewares/tenant'
import sponsoredProducts from './middlewares/sponsoredProducts'
import variant from './middlewares/variant'
import variantProxy from './middlewares/variantProxy'

const TWO_SECONDS_MS = 2 * 1000
const THREE_SECONDS_MS = 3 * 1000
const SIX_SECONDS_MS = 6 * 1000

// Segments are small and immutable.
const MAX_SEGMENT_CACHE = 10000
const segmentCache = new LRUCache<string, Cached>({ max: MAX_SEGMENT_CACHE })
const searchCache = new LRUCache<string, Cached>({ max: 3000 })
const messagesCache = new LRUCache<string, Cached>({ max: 3000 })
const vbaseCache = new LRUCache<string, Cached>({ max: 3000 })
const appsCache = new LRUCache<string, Cached>({ max: 3000 })
const biggySearchCache = new LRUCache<string, Cached>({ max: 300 })

metrics.trackCache('segment', segmentCache)
metrics.trackCache('search', searchCache)
metrics.trackCache('messages', messagesCache)
metrics.trackCache('vbase', vbaseCache)
metrics.trackCache('biggySearch', biggySearchCache)

const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: THREE_SECONDS_MS,
    },
    apps: {
      retries: 2,
      concurrency: 5,
      memoryCache: appsCache,
      timeout: TWO_SECONDS_MS,
    },
    segment: {
      concurrency: 10,
      memoryCache: segmentCache,
      timeout: THREE_SECONDS_MS,
    },
    search: {
      concurrency: 10,
      memoryCache: searchCache,
      timeout: SIX_SECONDS_MS,
    },
    intelligentSearch: {
      retries: 0,
      concurrency: 10,
      memoryCache: biggySearchCache,
      timeout: SIX_SECONDS_MS,
    },
    rewriter: {
      timeout: SIX_SECONDS_MS,
    },
    vbase: {
      concurrency: 2,
      memoryCache: vbaseCache,
      timeout: TWO_SECONDS_MS,
    },
    store: {
      retries: 0,
      timeout: TWO_SECONDS_MS,
    },
  },
}

export default new Service({
  clients,
  routes: {
    topSearches: method({
      GET: [tenant, topSearches],
    }),
    searchSuggestions: method({
      GET: [tenant, searchSuggestions],
    }),
    correction: method({
      GET: [tenant, correction],
    }),
    autocompleteSearchSuggestions: method({
      GET: [tenant, autocompleteSearchSuggestions],
    }),
    banners: method({
      GET: [tenant, banners],
    }),
    facets: method({
      GET: [tenant, withSegment, facets],
    }),
    productSearch: method({
      GET: [tenant, withSegment, variant, productSearch],
    }),
    sponsoredProducts: method({
      GET: [tenant, withSegment, variant, sponsoredProducts],
    }),
    product: method({
      GET: [tenant, withSegment, product],
    }),
    variantProxy: method({
      GET: [variantProxy],
      POST: [variantProxy],
      PUT: [variantProxy],
      DELETE: [variantProxy],
    }),
  },
})
