export default async function variantProxy(
  ctx: Context,
  next: () => Promise<void>
): Promise<void> {
  let {
    query,
    clients: { osiris },
    vtex: { route: {
        params: { path = '' },
      } },
  } = ctx

  const result =  await osiris.proxy(ctx.vtex.account, path as string, query)

  ctx.body = result
  ctx.status = 200

  return next()
}
