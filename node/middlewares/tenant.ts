import type { Tenant } from '@vtex/api'
import { flatMap, filter, uniq } from 'lodash'

import { logDegradedSearchError } from './utils'

const TEN_MINUTES_S = 10 * 60
const STORE_PRODUCT = 'vtex-storefront'
const TENANT_LOCALE_HEADER = 'X-VTEX-IS-TenantLocale'

type TenantLocale = { defaultLocale: string; supportedLocales: string[] }

export function tenantInfoToTenantLocale(
  tenantInfo?: Tenant | null
): TenantLocale | null {
  if (tenantInfo == null) {
    return null
  }

  const bindings = filter(
    tenantInfo.bindings,
    (binding) => binding.targetProduct === STORE_PRODUCT
  )

  const supportedLocales = uniq(
    flatMap(bindings, (binding) => binding.supportedLocales)
  )

  return {
    defaultLocale: tenantInfo.defaultLocale,
    supportedLocales,
  }
}

export default async function tenant(ctx: Context, next: () => Promise<void>) {
  const {
    clients: { tenant: tenantClient },
  } = ctx

  try {
    const tenantInfo = await tenantClient.info({ forceMaxAge: TEN_MINUTES_S })
    const tenantLocale = tenantInfoToTenantLocale(tenantInfo)

    ctx.state.requestHeaders = ctx.state.requestHeaders ?? {}
    if (tenantLocale) {
      ctx.state.requestHeaders[TENANT_LOCALE_HEADER] = Buffer.from(
        JSON.stringify(tenantLocale)
      ).toString('base64')
    }
  } catch (error) {
    logDegradedSearchError(ctx.vtex.logger, error)
  }

  await next()
}
