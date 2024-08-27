interface BiggySearchProduct {
  name: string
  id: string
  timestamp: number
  product: string
  description: string
  reference: string
  url: string
  link: string
  oldPrice: number
  price: number
  stock: number
  brand: string
  brandId: string
  installment?: BiggyInstallment
  measurementUnit: string
  unitMultiplier: number
  tax: number
  images: BiggyProductImage[]
  skus: BiggySearchSKU[]
  categories: string[]
  categoryIds: string[]
  extraData: BiggyProductExtraData[]
  productSpecifications: string[]
  specificationGroups: string
  textAttributes: BiggyTextAttribute[]
  numberAttributes: BiggyTextAttribute[]
  split: BiggySplit
  categoryTrees: BiggyCategoryTree[]
  clusterHighlights: Record<string, string>
}

interface BiggyInstallment {
  value: number
  count: number
  interest: boolean
}

interface BiggyProductImage {
  name: string
  value: string
}

interface BiggyProductExtraData {
  key: string
  value: string
}

interface BiggySKUAttribute {
  key: string
  value: string
}

interface BiggyTextAttribute {
  labelKey: string
  labelValue: string
  key: string
  value: string
  isFilter: boolean
  id: string
  valueId: string
  isSku: boolean
  joinedKey: string
  joinedValue: string
}

interface BiggySplit {
  labelKey: string
  labelValue: string
}

interface BiggyCategoryTree {
  categoryNames: string[]
  categoryIds: string[]
}

interface BiggySearchSKU {
  name: string
  nameComplete: string
  complementName?: string
  id: string
  ean?: string
  reference: string
  image: string
  images: BiggyProductImage[]
  videos?: string[]
  stock: number
  oldPrice: number
  price: number
  measurementUnit: string
  unitMultiplier: number
  link: string
  attributes: BiggySKUAttribute[]
  sellers: BiggySeller[]
  policies: BiggyPolicy[]
}

interface BiggySeller {
  id: string
  name: string
  oldPrice: number
  price: number
  stock: number
  tax: number
  default: boolean
  teasers?: Array<Record<string, unknown>>
  installment?: BiggyInstallment
}

interface BiggyPolicy {
  id: string
  sellers: BiggySeller[]
}
