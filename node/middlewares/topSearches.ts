export default async function topSearches(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    query,
    clients: { intelligentSearch: ISClient },
  } = ctx

  const result = await ISClient.topSearches(ctx, query)

  ctx.body = result
  ctx.status = 200

  await next()
}
