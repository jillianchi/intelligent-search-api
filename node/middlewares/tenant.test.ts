import { tenantInfoToTenantLocale } from './tenant'

const tenantInfo = {
  id: '',
  slug: 'automacaoqa',
  title: 'automacaoqa',
  edition: 'vtex:tier-1339',
  infra: 'VTEX',
  metadata: {},
  bindings: [
    {
      id: 'bad2927c-40f8-4e4c-948e-267644f42436',
      canonicalBaseAddress: 'automacaoqa.myvtex.com/admin',
      alternateBaseAddresses: [],
      defaultLocale: 'pt-BR',
      supportedLocales: ['es-AR', 'pt-BR', 'en-US'],
      defaultCurrency: 'BRL',
      supportedCurrencies: ['BRL'],
      extraContext: {},
      targetProduct: 'vtex-admin',
    },
    {
      id: '6ec85710-957d-42af-83df-a496d8ac2974',
      canonicalBaseAddress: 'automacaoqa.myvtex.com/',
      alternateBaseAddresses: [],
      defaultLocale: 'pt-BR',
      supportedLocales: ['pt-BR'],
      defaultCurrency: 'BRL',
      supportedCurrencies: ['BRL'],
      extraContext: {},
      targetProduct: 'vtex-storefront',
    },
  ],
  defaultCurrency: 'BRL',
  defaultLocale: 'pt-BR',
}

describe('tenantInfoToTenantLocale', () => {
  it('works with correct data', () => {
    expect(tenantInfoToTenantLocale(tenantInfo)).toEqual({
      defaultLocale: 'pt-BR',
      supportedLocales: ['pt-BR'],
    })
  })

  it('works with null and undefined data', () => {
    expect(tenantInfoToTenantLocale(null)).toBeNull()
    expect(tenantInfoToTenantLocale(undefined)).toBeNull()
  })
})
