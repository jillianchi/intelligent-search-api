const buildBSearchFilterHeader = (
  sellers?: RegionSeller[],
  shippingRoutes?: string
) => {
  let header = ''

  if (sellers?.length) {
    const privateSellersValue = sellers.reduce(
      (cookie: string, seller: RegionSeller, idx: number) => {
        return `${cookie}${idx > 0 ? '/' : 'private-seller#'}${seller.id}`
      },
      ''
    )

    header = header.concat(privateSellersValue)
  }

  if (shippingRoutes?.length) {
    const shippingRoutesValue = shippingRoutes.split(', ').join('/')
    const separator = header.length ? '|' : ''

    header = header.concat(`${separator}shipping-route#${shippingRoutesValue}`)
  }

  return header
}

export default buildBSearchFilterHeader
