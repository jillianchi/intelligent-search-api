const sortSellersByDefaultSeller = (sellers: Seller[]) => {
  return sellers.sort((a: Seller, b: Seller) =>
    a.sellerDefault === b.sellerDefault ? 0 : a.sellerDefault ? -1 : 1
  )
}

/**
 * Returns a list of products, each with its sellers sorted by default seller (true first).
 * @param products List of products to be sorted.
 * @returns List of products with sellers sorted by default seller.
 */
const sortProductsSellersByDefaultSeller = (products: Product[]) => {
  return products.map((product) => ({
    ...product,
    items: product.items.map((item: Item) => ({
      ...item,
      sellers: sortSellersByDefaultSeller(item.sellers),
    })),
  }))
}

export default sortProductsSellersByDefaultSeller
