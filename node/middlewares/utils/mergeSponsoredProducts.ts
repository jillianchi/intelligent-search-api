type Options = {
  repeatSponsoredProducts?: boolean
}

export const mergeSponsoredProducts = (
  products: Product[],
  sponsoredProducts: Product[] = [],
  { repeatSponsoredProducts = true }: Options = {}
): Product[] => {
  const mergedProducts = sponsoredProducts.concat(products)
  if (repeatSponsoredProducts) return mergedProducts

  const uniqueProductsMap = new Map<string, Product>()
  mergedProducts.forEach((product) => {
    if (uniqueProductsMap.has(product.productId)) return
    uniqueProductsMap.set(product.productId, product)
  })

  return Array.from(uniqueProductsMap.values())
}
