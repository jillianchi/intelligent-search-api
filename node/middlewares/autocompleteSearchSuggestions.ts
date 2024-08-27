export default async function autocompleteSearchSuggestions(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    query,
    clients: { intelligentSearch: ISClient },
  } = ctx

  if (!query?.query) {
    ctx.status = 200
    ctx.body = { searches: [] }
    await next()

    return
  }

  const suggestions = await ISClient.autocompleteSearchSuggestions(ctx, query)

  ctx.body = suggestions
  ctx.status = 200

  await next()
}
