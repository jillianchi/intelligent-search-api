export default async function product(ctx: Context, next: () => Promise<any>) {
  const {
    query,
    vtex: { segment },
    clients: { intelligentSearch: ISClient },
  } = ctx

  if (!query?.id) {
    ctx.status = 200
    ctx.body = []
    await next()

    return
  }

  const regionId = (query?.regionId as string) || segment?.regionId
  const salesChannel =
    (query.salesChannel as string) || segment?.channel?.toString()

  const parsedParams: any = {
    ...query,
    regionId,
    salesChannel,
  }

  const result = await ISClient.product(ctx, parsedParams)

  ctx.body = result
  ctx.status = 200

  await next()
}
