import unescape from 'unescape'

import type { Search } from '../../clients/search'

interface Breadcrumb {
  href: string
  name: string
}

export type Attribute = (NumericalAttribute | TextAttribute) & {
  key: string
  originalKey: string
  label: string
  type: 'text' | 'number' | 'location'
  visible: boolean
  originalLabel: string
}

interface CatalogAttributeValues {
  FieldValueId: number
  Value: string
  Position: number
}

interface NumericalAttribute {
  type: 'number' | 'location'
  maxValue: number
  minValue: number
  active: boolean
  activeFrom?: string
  activeTo?: string
  values: Array<{
    count: number
    from: string
    to: string
    active: boolean
  }>
}

export interface TextAttribute {
  type: 'text'
  values: Array<{
    id?: string
    key: string
    count: number
    active: boolean
    label: string
    originalLabel?: string 
  }>
}

interface AttributesToFilters {
  total: number
  attributes?: Attribute[]
  breadcrumb: Breadcrumb[]
  removeHiddenFacets: boolean
}

type FilterType = 'PRICERANGE' | 'TEXT' | 'NUMBER' | 'CATEGORYTREE'

interface Filter {
  type: FilterType
  name: string
  hidden: boolean
  values: FilterValue[]
  quantity?: number
}

interface FilterValue {
  quantity: number
  name: string
  key: string
  value: string
  selected?: boolean
  link?: string
  linkEncoded?: string
  href?: string
  range?: {
    from: number
    to: number
  }
  children?: FilterValue[]
  id?: string
}

export const buildHref = (
  baseHref: string,
  key: string,
  value: string
): string => {
  if (key === '' || value === '') {
    return baseHref
  }

  const [path = '', map = ''] = baseHref.split('?map=')
  const pathValues = [...path.split('/'), value].filter((x) => x)
  const mapValues = [...map.split(','), key].filter((x) => x)

  return `${pathValues.join('/')}?map=${mapValues.join(',')}`
}

/**
 * Convert values, and create FilterType, that can be either `PRICERANGE` or
 * `TEXT`, only price uses the `PRICERANGE` type, other number attributes that
 * come from Biggy's API are transformed into TEXT filters.
 *
 * Location attributes are also transformed in TEXT filters, but when a location
 * is selected, only a single bucket is returned (the API returns multiple buckets,
 * but does not return the selected one, and there's no need to select multiple
 * location buckets).
 *
 * If an attribute is not of type `'text' | 'number' | 'location'`, an error will
 * be thrown.
 *
 * @param {Attribute} attribute
 * @returns {{ type: FilterType; values: FilterValue[] }}
 */
const convertValues = (
  attribute: Attribute,
  total: number,
  baseHref: string
): { type: FilterType; values: FilterValue[] } => {
  // When creating a filter for price attribute, it should be the only one to use
  // the type `'PRICERANGE'`.
  const knownPriceKeys = [
    'price',
    'pre-',
    'precio',
    'preco',
    'pret',
    'prezzo',
    'prix',
  ]

  if (
    attribute.type === 'number' &&
    (knownPriceKeys.some((p) => p === attribute.key) ||
      knownPriceKeys.some((p) => p === attribute.originalKey))
  ) {
    return {
      type: 'PRICERANGE',
      values: attribute.values.map((value: any) => {
        return {
          quantity: value.count,
          name: unescape(value.label ?? ''),
          key: attribute.originalKey,
          value: value.key,
          selected: value.active,
          range: {
            from: parseFloat(
              isNaN(value.from) ? attribute.minValue : value.from
            ),
            to: parseFloat(isNaN(value.to) ? attribute.maxValue : value.to),
          },
        }
      }),
    }
  }

  // For other `number` and `location` attributes we use TEXT based filters (checkboxes),
  // with buckets (e.g.: 0 - 30, 30 - 90, etc).
  if (attribute.type === 'number' || attribute.type === 'location') {
    const valuePrefix = attribute.type === 'location' ? 'l:' : ''

    // When a bucket is active, we should only show it, and none of the othter options.
    if (attribute.active) {
      const from = !Number.isNaN(parseFloat(attribute.activeFrom ?? ''))
        ? parseFloat(attribute.activeFrom!)
        : attribute.minValue

      const to = !Number.isNaN(parseFloat(attribute.activeTo ?? ''))
        ? parseFloat(attribute.activeTo!)
        : attribute.maxValue

      return {
        type: 'TEXT',
        values: [
          {
            quantity: total,
            name: unescape(`${from} - ${to}`),
            value: `${valuePrefix}${from}:${to}`,
            key: attribute.originalKey,
            selected: attribute.active,
            range: {
              // Using absolute values so that slider remains the same.
              from: attribute.minValue,
              to: attribute.maxValue,
            },
          },
        ],
      }
    }

    return {
      type: 'TEXT',
      values: attribute.values.map((value) => {
        const from = !Number.isNaN(parseFloat(value.from))
          ? parseFloat(value.from)
          : attribute.minValue

        const to = !Number.isNaN(parseFloat(value.to))
          ? parseFloat(value.to)
          : attribute.maxValue

        return {
          quantity: value.count,
          name: unescape(`${from} - ${to}`),
          key: attribute.originalKey,
          value: `${valuePrefix}${from}:${to}`,
          selected: value.active,
          range: {
            from,
            to,
          },
        }
      }),
    }
  }

  // Basic `text` attributes.
  if (attribute.type === 'text') {
    return {
      type: 'TEXT',
      values: attribute.values.map((value) => {
        return {
          id: value.id,
          quantity: value.count,
          name: unescape(value.label ?? ''),
          key: attribute.originalKey,
          value: value.key,
          selected: value.active,
          href: buildHref(baseHref, attribute.key, value.key),
        }
      }),
    }
  }

  throw new Error(`Not recognized attribute type: ${attribute.type}`)
}

/**
 * Convert from Biggy's attributes into Specification Filters.
 *
 * @export
 * @param {Attribute[]} [attributes] Attributes from Biggy's API.
 * @returns {Filter[]}
 */
export const attributesToFilters = ({
  total,
  attributes,
  breadcrumb,
  removeHiddenFacets,
}: AttributesToFilters): Filter[] => {
  if (!attributes || attributes.length === 0) {
    return []
  }

  const response = attributes?.map((attribute) => {
    const baseHref = (
      breadcrumb[breadcrumb.length - 1] ?? { href: '', name: '' }
    ).href

    const { type, values } = convertValues(attribute, total, baseHref)

    return {
      values,
      type,
      name: attribute.label,
      hidden: !attribute.visible,
      key: attribute.originalKey,
    }
  })

  if (removeHiddenFacets) {
    return response.filter((attribute) => !attribute.hidden)
  }

  return response
}

export const resolveFacets = (filters: Filter[]) => {
  return filters.map((facet) => {
    facet.quantity = facet.values.length ?? 0

    return facet
  })
}

const sortAttributeValuesByCatalog = (
  attribute: TextAttribute,
  values: CatalogAttributeValues[]
) => {
  const findPositionByLabel = (label: string) => {
    const catalogValue = values.find((value) => value.Value === label)

    return catalogValue ? catalogValue.Position : -1
  }

  attribute.values.sort((a, b) => {
    // Use originalLabel to respect the field value sorting in the admin. Fallback to label.
    const aPosition = findPositionByLabel(a.originalLabel ?? a.label)
    const bPosition = findPositionByLabel(b.originalLabel ?? b.label)

    // Order attribute values keeping selected ones at the top.
    if (a.active && !b.active) {
      return -1
    }

    if (b.active && !a.active) {
      return 1
    }

    // If both, or neither, are selected, order using catalog's position.
    return aPosition < bPosition ? -1 : 1
  })
}

export const sortAttributes = (attributes: any[], search: Search) => {
  return Promise.all(
    attributes.map(async (attribute: any) => {
      if (attribute.type === 'text' && attribute.ids && attribute.ids.length) {
        const catalogValues = await search.getFieldValues(attribute.ids[0])

        if (catalogValues?.length) {
          sortAttributeValuesByCatalog(attribute, catalogValues)
        }
      }

      return attribute
    })
  )
}
