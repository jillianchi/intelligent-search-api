interface ConvertProductInput {
  searchResult: any
  ctx: any
  simulationBehavior?: 'skip' | 'only1P' | 'default' | null
  tradePolicy?: string | null
  regionId?: string | null
}

interface ProductsByIdentifierArgs {
  field: 'id' | 'ean' | 'reference' | 'sku'
  values: string[]
  salesChannel?: string | null
  regionId?: string | null
}

interface SegmentData {
  campaigns?: any
  channel: number
  priceTables?: any
  utm_campaign: string
  regionId?: string
  utm_source: string
  utmi_campaign: string
  currencyCode: string
  currencySymbol: string
  countryCode: string
  cultureInfo: string
  [key: string]: any
}

const buildVtexSegment = (
  vtexSegment?: SegmentData,
  tradePolicy?: number,
  regionId?: string | null
): string => {
  const cookie = {
    regionId,
    channel: tradePolicy,
    utm_campaign: vtexSegment?.utm_campaign || '',
    utm_source: vtexSegment?.utm_source || '',
    utmi_campaign: vtexSegment?.utmi_campaign || '',
    currencyCode: vtexSegment?.currencyCode || '',
    currencySymbol: vtexSegment?.currencySymbol || '',
    countryCode: vtexSegment?.countryCode || '',
    cultureInfo: vtexSegment?.cultureInfo || '',
  }

  return Buffer.from(JSON.stringify(cookie), 'ascii').toString('base64')
}

const productsByIdentifier = async (
  _: any,
  args: ProductsByIdentifierArgs,
  ctx: Context
) => {
  const {
    clients: { search },
  } = ctx

  let products = [] as Product[]
  const { field, values, salesChannel } = args

  const vtexSegment =
    !ctx.vtex.segment || (!ctx.vtex.segment?.regionId && args.regionId)
      ? buildVtexSegment(
          ctx.vtex.segment,
          Number(args.salesChannel),
          args.regionId
        )
      : ctx.vtex.segmentToken

  switch (field) {
    case 'id':
      products = await search.productsById(values, vtexSegment, salesChannel)
      break

    default:
      throw new Error(`${field} is not supported`)
  }

  if (products.length > 0) {
    return products
  }

  throw new Error(`No products were found with requested ${field}`)
}

const productsCatalog = async ({
  searchResult,
  ctx,
  tradePolicy,
  regionId,
}: ConvertProductInput) => {
  const biggyProducts: any[] = searchResult.products
  let products: any[] = []
  const productIds = biggyProducts.map(
    (product) => product.product ?? product.id ?? ''
  )

  if (productIds.length) {
    // Get products' model from VTEX search API
    products = await productsByIdentifier(
      undefined,
      {
        field: 'id',
        values: productIds,
        salesChannel: tradePolicy,
        regionId,
      },
      ctx
    )

    // Add extra data and correct index
    products.forEach((product: any) => {
      const idx = productIds.indexOf(product.productId)
      const biggyProduct = biggyProducts[idx]

      // This will help to sort the products
      product.biggyIndex = idx

      if (biggyProduct.extraData?.length) {
        product.allSpecifications = product.allSpecifications || []

        biggyProduct.extraData.forEach(
          ({ key, value }: BiggyProductExtraData) => {
            if (product.allSpecifications.indexOf(key) < 0) {
              product.allSpecifications.push(key)
              product[key] = [value]
            }
          }
        )
      }
    })

    // Maintain biggySearch's order.
    products = products.sort((a, b) => a.biggyIndex - b.biggyIndex)
  }

  return products
}

export default productsCatalog
