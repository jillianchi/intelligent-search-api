export default async function searchSuggestions(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    query,
    clients: { intelligentSearch: ISClient },
  } = ctx

  if (!query?.query) {
    ctx.status = 200
    ctx.body = {
      searches: [],
    }
    await next()

    return
  }

  const suggestions = await ISClient.searchSuggestions(ctx, query)

  ctx.status = 200
  ctx.body = suggestions.suggestion

  await next()
}
