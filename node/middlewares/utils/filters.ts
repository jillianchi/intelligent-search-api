import type { VBase } from '@vtex/api'
import { cloneDeep } from 'lodash'
import unescape from 'unescape'

import type { Search } from '../../clients/search'
import type { Attribute, TextAttribute } from './attributes'
import { staleFromVBaseWhileRevalidate } from '../vbase'

const LIST_SPECIFICATIONS_BY_CATEGORY_ID = 'specByCategoryId'
const SPECIFICATION_BUCKET = 'specificationField'

interface ElasticAttributeValue {
  count: number
  active: boolean
  key: string
  label: string
  id: string
  originalKey?: string
  originalLabel?: string
}

interface ElasticAttribute {
  visible: boolean
  active: boolean
  key: string
  label: string
  type: string
  values: ElasticAttributeValue[]
  originalKey: string
  originalLabel: string
  minValue?: number
  maxValue?: number
}

interface SelectedFacet {
  value: string
  key: string
}

interface Breadcrumb {
  href: string
  name: string
}

type ElasticAttributeWithAttributeKey = ElasticAttributeValue & {
  visible: boolean
  attributeKey: string
}

const convertCatalogKeyToEsKey = (
  selectedFacets: SelectedFacet[],
  shouldConverProductClusterIdsToProductClusterNames: boolean
) => {
  let categoryDepth = 0

  return selectedFacets.map((selectedFacet) => {
    if (selectedFacet.key === 'c') {
      categoryDepth++

      return {
        ...selectedFacet,
        key: `category-${categoryDepth}`,
      }
    }

    if (selectedFacet.key === 'b') {
      return {
        ...selectedFacet,
        key: `brand`,
      }
    }

    if (
      selectedFacet.key.toLocaleLowerCase() === 'productclusterids' &&
      shouldConverProductClusterIdsToProductClusterNames
    ) {
      return {
        ...selectedFacet,
        key: `productclusternames`,
      }
    }

    return selectedFacet
  })
}

const findAttributeIndexfromSelectedFacet = (
  selectedFacet: SelectedFacet,
  attributes: ElasticAttributeWithAttributeKey[]
) => {
  if (selectedFacet.key.toLocaleLowerCase() === 'productclusternames') {
    return attributes.findIndex(
      (attribute) =>
        attribute.attributeKey.toLowerCase() === selectedFacet.key.toLowerCase()
    )
  }

  return attributes.findIndex(
    ({ attributeKey, key, originalKey }) =>
      attributeKey.toLowerCase() === selectedFacet.key.toLowerCase() &&
      (key === decodeURIComponent(selectedFacet.value) ||
        originalKey === decodeURIComponent(selectedFacet.value))
  )
}

const sortESAttributeValuesInTheSelectedFacetsOrder = (
  selectedFacets: SelectedFacet[],
  attributes: ElasticAttributeWithAttributeKey[]
): ElasticAttributeWithAttributeKey[] => {
  // If attributes doesn't have a productclusterids it means that
  // the ES API is converting productclusterids to productclusternames (or there is no productclusternames/productclusterids in the query). In this case
  // we should convert any instance of productclusterids from the selectedFacets to productclusternames
  // This variable can be deleted after the backend deploy https://github.com/vtex/sp-node/pull/119
  const shouldConverProductClusterIdsToProductClusterNames = !attributes.find(
    (attribute) => attribute.attributeKey.toLowerCase() === 'productclusterids'
  )

  const selectedFacetsWithESKey = convertCatalogKeyToEsKey(
    selectedFacets,
    shouldConverProductClusterIdsToProductClusterNames
  )

  return selectedFacetsWithESKey
    .map((selectedFacet) => {
      const attributeIdx = findAttributeIndexfromSelectedFacet(
        selectedFacet,
        attributes
      )

      if (attributeIdx < 0) {
        return
      }

      const attribute = attributes[attributeIdx]

      attributes.splice(attributeIdx, 1)

      return attribute
    }, [])
    .filter((attribute) => !!attribute) as ElasticAttributeWithAttributeKey[]
}

const canCleanMap = (attributeKey: string, map: string[]) => {
  const categoryKeys = ['category-1', 'category-2', 'category-3', 'category-4']

  // If there is more than one category of the same level, the rewriter cannot handle the link without map
  if (map.length > 4 || map.length !== Array.from(new Set(map)).length) {
    return false
  }

  const onlySortedCategories = map.reduce((acc, item, index) => {
    if (!categoryKeys.includes(item) || !acc) {
      return false
    }

    return categoryKeys.indexOf(item) === index
  }, true)

  return onlySortedCategories || (attributeKey === 'brand' && map.length === 1)
}

export const buildBreadcrumb = (
  attributes: ElasticAttribute[],
  fullText: string,
  selectedFacets: SelectedFacet[]
) => {
  const pivotValue: string[] = []
  const pivotMap: string[] = []

  const breadcrumb: Breadcrumb[] = []

  if (fullText) {
    pivotValue.push(fullText)
    pivotMap.push('ft')

    breadcrumb.push({
      name: fullText,
      href: `/${pivotValue.join('/')}?map=${pivotMap.join(',')}`,
    })
  }

  const activeAttributes = attributes.filter((attribute) => attribute.active)
  const activeValues: ElasticAttributeWithAttributeKey[] = []

  activeAttributes.forEach((attribute) => {
    attribute.values.forEach((value) => {
      if (value.active) {
        activeValues.push({
          ...value,
          visible: attribute.visible,
          attributeKey: attribute.originalKey,
        })
      }
    })
  })

  const activeValuesInCorrectOrder =
    sortESAttributeValuesInTheSelectedFacetsOrder(selectedFacets, activeValues)

  const hiddenActiveValues = [
    'trade-policy',
    'private-seller',
    'activeprivatesellers',
  ]

  activeValuesInCorrectOrder
    .filter((x) => !hiddenActiveValues.includes(x.attributeKey.toLowerCase()))
    .forEach((value) => {
      pivotValue.push(value.key)
      pivotMap.push(value.attributeKey)

      if (value.attributeKey.toLowerCase() === 'productclusterids') {
        const clusterName = attributes
          .find((attribute) => attribute.key === 'productclusternames')
          ?.values.find((attrValue) => attrValue.id === value.key)?.label

        if (clusterName) {
          breadcrumb.push({
            name: unescape(clusterName),
            href: `/${pivotValue.join('/')}?map=${pivotMap.join(',')}`,
          })
        }

        return
      }

      if (canCleanMap(value.attributeKey, pivotMap)) {
        breadcrumb.push({
          name: unescape(value.label),
          href: `/${pivotValue.join('/')}`,
        })
      } else {
        breadcrumb.push({
          name: unescape(value.label),
          href: `/${pivotValue.join('/')}?map=${pivotMap.join(',')}`,
        })
      }
    })

  return breadcrumb
}

const getSpecificationsByCategoryId = (
  vbase: VBase,
  search: Search,
  categoryId: number
) => {
  return staleFromVBaseWhileRevalidate(
    vbase,
    `${LIST_SPECIFICATIONS_BY_CATEGORY_ID}`,
    categoryId.toString(),
    async (params: { categoryId: number; search: Search }) =>
      params.search.specificationsByCategoryId(params.categoryId),
    { categoryId, search },
    {
      expirationInMinutes: 10,
    }
  )
}

const isFilterByFieldId = async (
  vbase: VBase,
  search: Search,
  fieldId: number
) => {
  const specification = await staleFromVBaseWhileRevalidate(
    vbase,
    `${SPECIFICATION_BUCKET}`,
    fieldId.toString(),
    async (params: { fieldId: number; search: Search }) =>
      params.search.getField(params.fieldId),
    { fieldId, search },
    {
      expirationInMinutes: 10,
    }
  )

  return specification.IsFilter
}

export const setFilterVisibility = async (
  vbase: VBase,
  search: Search,
  attributes: Attribute[]
) => {
  const hiddenSpecificationsMap = new Map<string, boolean>()
  const categoryRegex = /^category-[0-9]+$/

  const categoryValues = (
    attributes.filter((attribute) =>
      categoryRegex.test(attribute.originalKey)
    ) as TextAttribute[]
  )
    .map((attribute) => attribute.values)
    .flat()

  const activeCategoryIds: number[] = categoryValues
    .filter((value) => value.active && value.id)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    .map((value) => parseInt(value.id!, 10))

  const categoryPromises = activeCategoryIds.map((categoryId) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (categoryResolve) => {
      const specifications = await getSpecificationsByCategoryId(
        vbase,
        search,
        categoryId
      )

      const specificationPromises = specifications.map(
        async (specification: { Name: string; FieldId: number }) => {
          if (hiddenSpecificationsMap.get(specification.Name)) {
            return
          }

          const isFilter = await isFilterByFieldId(
            vbase,
            search,
            specification.FieldId
          )

          hiddenSpecificationsMap.set(specification.Name, isFilter)
        }
      )

      await Promise.all(specificationPromises)

      categoryResolve()
    })
  })

  await Promise.all(categoryPromises)

  const clonedFilters = cloneDeep(attributes)

  clonedFilters.forEach((attribute) => {
    if (attribute.visible) {
      const isFilter = hiddenSpecificationsMap.get(attribute.originalLabel)

      if (typeof isFilter !== 'undefined') {
        attribute.visible = isFilter
      }
    }
  })

  return clonedFilters
}
