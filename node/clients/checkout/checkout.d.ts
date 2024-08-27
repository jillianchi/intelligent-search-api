interface PayloadItem {
  id: string
  quantity: number
  seller: string
  parentItemIndex?: number | null
  parentAssemblyBinding?: string | null
}

interface ShippingData {
  logisticsInfo?: Array<{ regionId?: string | null }>
}

interface SimulationPayload {
  items: PayloadItem[]
  postalCode?: string
  isCheckedIn?: boolean
  priceTables?: string[]
  marketingData?: Record<string, string>
  shippingData?: ShippingData
  country?: string
}

interface OrderFormItem {
  id: string
  name: string
  detailUrl: string
  imageUrl: string
  productRefId: string
  skuName: string
  quantity: number
  uniqueId: string
  productId: string
  refId: string
  ean: string
  priceValidUntil: string
  price: number
  tax: number
  listPrice: number
  sellingPrice: number
  rewardValue: number
  isGift: boolean
  parentItemIndex: number | null
  parentAssemblyBinding: string | null
  productCategoryIds: string
  priceTags: string[]
  measurementUnit: string
  additionalInfo: {
    brandName: string
    brandId: string
    offeringInfo: any | null
    offeringType: any | null
    offeringTypeId: any | null
  }
  productCategories: Record<string, string>
  seller: string
  sellerChain: string[]
  availability: string
  unitMultiplier: number
}

interface LogisticsInfo {
  itemIndex: number
  selectedSla: string
  selectedDeliveryChannel: string
  addressId: string
  stockBalance: number
  slas: {
    id: string
    deliveryChannel: string
    name: string
    deliveryIds: Array<{
      courierId: string
      warehouseId: string
      dockId: string
      courierName: string
      quantity: number
    }>
    shippingEstimate: string
    shippingEstimateDate: string | null
    lockTTL: string | null
    availableDeliveryWindows: any[]
    deliveryWindow: string | null
    price: number
    listPrice: number
    tax: number
    pickupStoreInfo: {
      isPickupStore: boolean
      friendlyName: string | null

      address: CheckoutAddress | null
      additionalInfo: any | null
      dockId: string | null
    }
    pickupPointId: string | null
    pickupDistance: number
    polygonName: string | null
  }
  shipsTo: string[]
  itemId: string
  deliveryChannels: Array<{ id: string }>
}

interface OrderForm {
  orderFormId: string
  salesChannel: string
  loggedIn: boolean
  isCheckedIn: boolean
  storeId: string | null
  checkedInPickupPointId: string | null
  allowManualPrice: boolean
  canEditData: boolean
  userProfileId: string | null
  userType: string | null
  ignoreProfileData: boolean
  value: number
  messages: any[]
  items: OrderFormItem[]
  selectableGifts: any[]
  totalizers: Array<{ id: string; name: string; value: number }>
  logisticsInfo: LogisticsInfo[]
  shippingData: {
    address: CheckoutAddress
    selectedAddresses: CheckoutAddress[]
    availableAddresses: CheckoutAddress[]
    pickupPoints: Array<{
      friendlyName: string
      address: CheckoutAddress
      additionalInfo: string
      id: string
      businessHours: Array<{
        DayOfWeek: number
        OpeningTime: string
        ClosingTime: string
      }>
    }>
  }
  clientProfileData: any | null
  paymentData: PaymentData
  marketingData: OrderFormMarketingData | null
  sellers: Array<{
    id: string
    name: string
    logo: string
  }>
  clientPreferencesData: {
    locale: string
    optinNewsLetter: any | null
  }
  commercialConditionData: any | null
  storePreferencesData: {
    countryCode: string
    saveUserData: boolean
    timeZone: string
    currencyCode: string
    currencyLocale: number
    currencySymbol: string
    currencyFormatInfo: {
      currencyDecimalDigits: number
      currencyDecimalSeparator: string
      currencyGroupSeparator: string
      currencyGroupSize: number
      startsWithCurrencySymbol: boolean
    }
  }
  giftRegistryData: any | null
  openTextField: any | null
  invoiceData: any | null
  customData: any | null
  itemMetadata: {
    items: MetadataItem[]
  }
  hooksData: any | null
  ratesAndBenefitsData: RatesAndBenefitsData
  subscriptionData: any | null
  itemsOrdination: any | null
}

interface MetadataItem {
  id: string
  name: string
  imageUrl: string
  detailUrl: string
  seller: string
  assemblyOptions: AssemblyOption[]
  skuName: string
  productId: string
  refId: string
  ean: string | null
}

interface CheckoutAddress {
  addressType: string
  receiverName: string
  addressId: string
  postalCode: string
  city: string
  state: string
  country: string
  street: string
  number: string
  neighborhood: string
  complement: string
  reference: string | null
  geoCoordinates: [number, number]
}

interface PaymentData {
  installmentOptions: Array<{
    paymentSystem: string
    bin: string | null
    paymentName: string | null
    paymentGroupName: string | null
    value: number
    installments: Array<{
      count: number
      hasInterestRate: false
      interestRate: number
      value: number
      total: number
      sellerMerchantInstallments: Array<{
        count: number
        hasInterestRate: false
        interestRate: number
        value: number
        total: number
      }>
    }>
  }>
  paymentSystems: Array<{
    id: string
    name: string
    groupName: string
    validator: {
      regex: string
      mask: string
      cardCodeRegex: string
      cardCodeMask: string
      weights: number[]
      useCvv: boolean
      useExpirationDate: boolean
      useCardHolderName: boolean
      useBillingAddress: boolean
    }
    stringId: string
    template: string
    requiresDocument: boolean
    isCustom: boolean
    description: string | null
    requiresAuthentication: boolean
    dueDate: string
    availablePayments: any | null
  }>
  payments: any[]
  giftCards: any[]
  giftCardMessages: any[]
  availableAccounts: any[]
  availableTokens: any[]
}

interface RatesAndBenefitsData {
  rateAndBenefitsIdentifiers: Array<{
    id: string
    name: string
    featured: boolean
    description: string
  }>
  teaser: Array<{
    featured: boolean
    id: string
    name: string
    conditions: {
      parameters: Array<{
        name: string
        value: string
      }>
      minimumQuantity: number
    }
    effects: {
      parameters: Array<{
        name: string
        value: string
      }>
    }
    teaserType: string
  }>
}

interface OrderFormMarketingData {
  utmCampaign?: string
  utmMedium?: string
  utmSource?: string
  utmiCampaign?: string
  utmiPart?: string
  utmipage?: string
  marketingTags?: string
}
