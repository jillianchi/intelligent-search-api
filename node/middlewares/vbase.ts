import { createHash } from 'crypto'

import type { VBase } from '@vtex/api'

const normalizedJSONFile = (filePath: string) =>
  `${createHash('md5').update(filePath).digest('hex')}.json`

const getTTL = (expirationInMinutes?: number) => {
  const ttl = new Date()

  ttl.setMinutes(ttl.getMinutes() + (expirationInMinutes || 30))

  return ttl
}

const revalidate = async <T>(
  vbase: VBase,
  bucket: string,
  filePath: string,
  endDate: Date,
  validateFunction: (params?: any) => Promise<T>,
  params?: any
) => {
  const data = await validateFunction(params)
  const revalidatedData = { data, ttl: endDate }

  vbase
    .saveJSON<StaleRevalidateData<T>>(bucket, filePath, revalidatedData)
    .catch()

  return data
}

export const staleFromVBaseWhileRevalidate = async <T>(
  vbase: VBase,
  bucket: string,
  filePath: string,
  validateFunction: (params?: any) => Promise<T>,
  params?: any,
  options?: { expirationInMinutes?: number }
): Promise<T> => {
  const normalizedFilePath = normalizedJSONFile(filePath)
  const cachedData = (await vbase
    .getJSON<StaleRevalidateData<T>>(bucket, normalizedFilePath, true)
    .catch()) as StaleRevalidateData<T>

  if (!cachedData) {
    const endDate = getTTL(options?.expirationInMinutes)

    const result = await revalidate<T>(
      vbase,
      bucket,
      normalizedFilePath,
      endDate,
      validateFunction,
      params
    )

    return result
  }

  const { data, ttl } = cachedData as StaleRevalidateData<T>

  const today = new Date()
  const ttlDate = new Date(ttl)

  if (today < ttlDate) {
    return data
  }

  const endDate = getTTL(options?.expirationInMinutes)

  revalidate<T>(
    vbase,
    bucket,
    normalizedFilePath,
    endDate,
    validateFunction,
    params
  )

  return data
}
