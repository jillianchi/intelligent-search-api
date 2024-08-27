import type {
  IOContext,
  ParamsContext,
  RecorderState,
  SegmentData,
  ServiceContext,
} from '@vtex/api'

import type { Clients } from './clients'

declare global {
  type Context = ServiceContext<Clients, State, CustomContext>

  interface State extends RecorderState {
    code: number
    requestHeaders?: Record<string, string>
    additionalParams?: Record<string, string>
  }

  interface CustomContext extends ParamsContext {
    cookie: string
    originalPath: string
    vtex: CustomIOContext
    translated?: boolean
  }

  interface CustomIOContext extends IOContext {
    segment?: SegmentData
  }

  interface Correction {
    correction: {
      text: string
      highlighted: string
      misspelled: boolean
      correction: boolean
    }
  }

  type BoostAction = 'add' | 'remove' | 'promote' | 'demote'

  type BoostType =
    | 'term'
    | 'id'
    | 'skuId'
    | 'skuEan'
    | 'skuReference'
    | 'productLink'
    | 'product'
    | 'sku'
    | 'productId'
    | 'attribute'

  type DynamicRule = {
    action: BoostAction
    type: BoostType
    value: string
  }

  type Rule = {
    id: string
  }

  type SearchPluginParams = {
    query?: string
    page?: string
    count?: string
    sort?: string
    operator?: string
    fuzzy?: string
    locale?: string
    allowRedirect?: boolean
    regionId?: string
    simulationBehavior?: 'skip' | 'only1P' | 'default' | null
    hideUnavailableItems?: boolean | null
    productOriginVtex?: string
    salesChannel?: string
    selectedFacets?: SelectedFacet[]
    dynamicRules?: DynamicRule[]
  }

  interface ProductParams {
    id?: string
    type?: string
    regionId?: string
    salesChannel?: string
    locale?: string
  }

  interface SearchParams {
    query?: string
    page?: string
    count?: string
    sort?: string
    operator?: string
    fuzzy?: string
    locale?: string
    bgy_leap?: boolean
    allowRedirect?: boolean
    initialAttributes?: string
    regionId?: string
    simulationBehavior?: 'skip' | 'only1P' | 'default' | null
    hideUnavailableItems?: boolean | null
    productOriginVtex?: string
    salesChannel?: string
    debugMode?: string
  }

  interface RegionSeller {
    id: string
    name: string
  }

  interface SuggestionProductsParams {
    workspaceSearchParams?: Record<string, unknown>
    hideUnavailableItems?: boolean | null
    locale?: string
  }

  interface SuggestionsParams {
    query?: string
    locale?: string
  }

  interface SuggestionProductsBody {
    term: string
    attributes: any[]
  }

  interface SearchResult {
    products: BiggySearchProduct[]
    total: number
    sampling: boolean
    operator: string
    redirect?: any
    fuzzy?: string
    correction?: Record<string, unknown>
    query?: string
    locale?: string
    translated?: boolean
    options?: Record<string, unknown>
    pagination: Pagination
  }

  interface Pagination {
    count: number
    current: Page
    before: Page[]
    after: Page[]
    perPage: number
    next: Page
    previous: Page
    first: Page
    last: Page
  }

  interface Page {
    index: number
    proxyURL?: string
  }

  interface PriceRange {
    sellingPrice: { highPrice: number; lowPrice: number }
    listPrice: { highPrice: number; lowPrice: number }
  }

  interface SpecificationGroup {
    name: string
    originalName: string
    specifications: Array<{
      name: string
      originalName: string
      values: string[]
    }>
  }
  interface Product {
    releaseDate: string
    origin: string
    productId: string
    productName: string
    brand: string
    brandId: number
    brandImageUrl?: string | null
    cacheId?: string
    linkText: string
    productReference: string
    categoryId: string
    productTitle: string
    metaTagDescription: string
    clusterHighlights: Record<string, any>
    productClusters: Record<string, string>
    searchableClusters: Record<string, string>
    categories: string[]
    categoriesIds: string[]
    link: string
    description: string
    items: Item[]
    itemMetadata?: {
      items: SearchMetadataItem[]
    }
    titleTag: string
    Specifications?: string[]
    allSpecifications?: string[]
    allSpecificationsGroups?: string[]
    completeSpecifications?: CompleteSpecification[]
    skuSpecifications?: SkuSpecification[]
    benefits?: any[]
    jsonSpecifications?: string
    propertyGroups?: Array<Record<string, string>>
    priceRange: PriceRange
    specificationGroups?: SpecificationGroup[]
    properties?: Array<{ name: string; values: string[] }>
    selectedProperties?: Array<{ key: string; value: string }>
    rule?: Rule
    debug?: Record<string, any>
    simulationDifference?: boolean
  }

  interface Item {
    itemId: string
    name: string
    nameComplete: string
    complementName: string
    ean: string
    referenceId: Array<{ Key: string; Value: string }>
    measurementUnit: string
    unitMultiplier: number
    modalType: any | null
    images: SearchImage[]
    Videos: string[]
    variations: string[]
    sellers: Seller[]
    attachments: Array<{
      id: number
      name: string
      required: boolean
      domainValues: string
    }>
    isKit: boolean
    kitItems?: Array<{
      itemId: string
      amount: number
    }>
    attributes: SearchItemAttribute[]
  }

  interface SearchItemAttribute {
    id: string
    name: string
    value: string
    visible: boolean
  }

  interface AssemblyOption {
    id: string
    name: string
    composition: Composition | null
    inputValues: InputValues
  }

  interface CategoryTreeResponse {
    id: number
    name: string
    hasChildren: boolean
    url: string
    children: CategoryTreeResponse[]
    Title: string
    MetaTagDescription: string
  }

  interface StaleRevalidateData<T> {
    ttl: Date
    data: T
  }

  interface SearchFacets {
    Departments: SearchFacet[]
    Brands: SearchFacet[]
    SpecificationFilters: Record<string, SearchFacet[]>
    CategoriesTrees: SearchFacetCategory[]
    PriceRanges: Array<{
      Slug: string
      Quantity: number
      Name: string
      Link: string
      LinkEncoded: string
      Map: null
      Value: string
    }>
    Summary: {
      Departments: SummaryItem
      CategoriesTrees: SummaryItem
      Brands: SummaryItem
      PriceRanges: SummaryItem
      SpecificationFilters: Record<string, SummaryItem>
    }
  }

  interface AppSettings {
    slugifyLinks: boolean
  }

  interface Banner {
    id: string
    name: string
    area: string
    html: string
  }

  interface DegradedSearchError {
    service: string
    error: string
    errorStack?: unknown
  }

  interface AdResponse {
    adRequestId?: string
    adResponseId?: string
    sponsoredProducts: SponsoredProduct[]
  }

  interface SponsoredProduct {
    productId: string
    identifier: SponsoredProductIdentifier
    advertisement: Advertisement
    rule: { id: string }
  }

  interface SponsoredProductIdentifier {
    field: SponsoredProductIdentifierField
    value: string
  }

  type SponsoredProductIdentifierField = 'anyId' | 'skuId' | 'product'

  interface Advertisement {
    adId: string
    campaignId: string
    actionCost: number
    adRequestId: string
    adResponseId: string
  }

  interface SelectedFacet {
    key: string
    value: string
  }

  interface SponsoredProductsArgs {
    query?: string
    page?: number
    count?: number
    sort?: string
    operator?: string
    fuzzy?: string
    searchState?: string
    regionId?: string | null
    hideUnavailableItems?: boolean | null
    selectedFacets?: SelectedFacet[]
  }

  interface Seller {
    error: string
    sellerId: string
    sellerName: string
    addToCartLink: string
    sellerDefault: boolean
    commertialOffer: CommertialOffer
  }

  interface DegradedSearchError {
    service: string
    error: string
    errorStack?: unknown
  }

  interface SponsoredProductsArgs {
    query?: string
    page?: number
    count?: number
    sort?: string
    operator?: string
    fuzzy?: string
    searchState?: string
    regionId?: string | null
    hideUnavailableItems?: boolean | null
    selectedFacets?: SelectedFacet[]
  }

  interface SkuOfferDetails {
    SkuId: string
    SkuSellers: SKUSeller[]
    SkuCommercialOfferPerSalesChannel: {
      [salesChannel: string]: SalesChannelOffer
    }
    Seller1: {
      SellerId: string
      Name: string
      SellerType: number
    }
  }

  interface OfferAPIResponse {
    [skuId: string]: SkuOfferDetails
  }
}

interface SKUSeller {
  SellerId: string
  SellerType: number
  SellerName: string
  AvailableSalesChannels: number[]
  StockKeepingUnitId: number
  SellerStockKeepingUnitId: string
  SkuCommercialOffer: SalesChannelOffer
}

interface SalesChannelOffer {
  Price: number
  ListPrice: number
  PriceWithoutDiscount: number
  RewardValue: number
  PriceValidUntil: string
  AvailableQuantity: number
  Tax: number
  GetInfoErrorMessage?: any | null
  CacheVersionUsedToCallCheckout: string
  IsAvailable: boolean
  DeliverySlaSamples: any[]
  RatesAndBenefitsData: RatesAndBenefitsData
  PaymentOptions: unknown
}

interface SearchFacet {
  Quantity: number
  Name: string
  Link: string
  LinkEncoded: string
  Map: string
  Value: string
}

export interface SearchFacetCategory {
  Id: number
  Quantity: number
  Name: string
  Link: string
  LinkEncoded: string
  Map: string
  Value: string
  Children: SearchFacetCategory[]
}

interface SummaryItem {
  DisplayedItems: number
  TotalItems: number
}

interface SearchImage {
  imageId: string
  imageLabel: string | null
  imageTag: string
  imageUrl: string
  imageText: string
}

interface SearchInstallment {
  Value: number
  InterestRate: number
  TotalValuePlusInterestRate: number
  NumberOfInstallments: number
  PaymentSystemName: string
  PaymentSystemGroupName: string
  Name: string
}

interface CommertialOffer {
  DeliverySlaSamplesPerRegion: Record<
    string,
    { DeliverySlaPerTypes: any[]; Region: any | null }
  >
  Installments: SearchInstallment[]
  DiscountHighLight: any[]
  GiftSkuIds: string[]
  Teasers: Array<Record<string, unknown>>
  teasers?: Array<Record<string, unknown>>
  BuyTogether: any[]
  ItemMetadataAttachment: any[]
  Price: number
  ListPrice: number
  spotPrice?: number
  PriceWithoutDiscount: number
  RewardValue: number
  PriceValidUntil: string
  AvailableQuantity: number
  Tax: number
  DeliverySlaSamples: Array<{
    DeliverySlaPerTypes: any[]
    Region: any | null
  }>
  GetInfoErrorMessage: any | null
  CacheVersionUsedToCallCheckout: string
}

interface CompleteSpecification {
  Values: Array<{
    Id: string
    Position: number
    Value: string
  }>
  Name: string
  Position: number
  IsOnProductDetails: boolean
  FieldId: string
}

interface SKUSpecificationField {
  name: string
  originalName?: string
  id?: string
}

interface SKUSpecificationValue {
  name: string
  id?: string
  fieldId?: string
  originalName?: string
}

interface SkuSpecification {
  field: SKUSpecificationField
  values: SKUSpecificationValue[]
}

interface SearchMetadataItem {
  Name: string
  NameComplete: string
  MainImage: string
  BrandName: string
  CategoryId: number
  ProductId: number
  id: string
  seller: string
  assemblyOptions: AssemblyOption[]
}

interface CompositionItem {
  id: string
  minQuantity: number
  maxQuantity: number
  initialQuantity: number
  priceTable: string
  seller: string
}

interface Composition {
  minQuantity: number
  maxQuantity: number
  items: CompositionItem[]
}

interface RawInputValue {
  maximumNumberOfCharacters: number
  domain: string[]
}

interface InputValues {
  [key: string]: RawInputValue
}
