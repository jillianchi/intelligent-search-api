export default async function banners(ctx: Context, next: () => Promise<any>) {
  const {
    query,
    vtex: {
      route: {
        params: { path = '' },
      },
    },
    clients: { intelligentSearch: ISClient },
  } = ctx

  const result = await ISClient.banners(ctx, path as string, query)

  ctx.body = {
    banners: (result.banners ?? []).map(({ id, name, area, html }: Banner) => ({
      id,
      name,
      area,
      html,
    })),
  }
  ctx.status = 200

  await next()
}
