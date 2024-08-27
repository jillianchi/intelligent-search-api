import slugify from 'slugify'

import { logDegradedSearchError } from '.'

export const shouldTranslateToBinding = (
  { translated, vtex: { binding, tenant } }: Context,
  ignoreIndexedTranslation?: boolean
) =>
  binding &&
  binding?.locale !== tenant?.locale &&
  (!translated || ignoreIndexedTranslation)

const urlToSlug = (slug: string | undefined) => {
  if (!slug) {
    return slug
  }

  const erasedSlash = slug.replace(/^\//g, '') // removing starting / char
  const finalSlug = erasedSlash.replace(/(\/p)$/g, '') // remove ending /p chars

  return finalSlug
}

export function Slugify(str: any) {
  return slugify(str, { lower: true, remove: /[*+~.()'"!:@]/g })
}

export const translateLinkText = async (
  { productId, linkText }: Product,
  ctx: Context
) => {
  const {
    clients: { rewriter, apps },
    vtex: { binding, logger },
  } = ctx

  const settings: AppSettings = await apps.getAppSettings(
    'jillian.intelligent-search-api@2.x'
  )

  if (!shouldTranslateToBinding(ctx, true)) {
    return settings.slugifyLinks ? Slugify(linkText) : linkText
  }

  try {
    const route = await rewriter.getRoute(productId, 'product', binding!.id!)
    const pathname = urlToSlug(route) ?? linkText

    return settings.slugifyLinks ? Slugify(pathname) : pathname
  } catch (e) {
    logDegradedSearchError(logger, {
      service: 'Rewriter getRoute',
      error: `Error while trying to translate the linkText: ${e.message}`,
      errorStack: e,
    })

    return linkText
  }
}
