export default async function correction(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    query,
    clients: { intelligentSearch: ISClient },
  } = ctx

  if (!query?.query) {
    ctx.body = {
      correction: {
        correction: false,
        misspelled: false,
        text: '',
        highlighted: '',
      },
    }
    ctx.status = 200
    await next()

    return
  }

  const result = await ISClient.correction(ctx, query)

  ctx.body = { correction: result.correction }
  ctx.status = 200

  await next()
}
