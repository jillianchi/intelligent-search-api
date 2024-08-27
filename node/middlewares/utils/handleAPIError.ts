import { ResolverWarning } from '@vtex/api'
import type { AxiosError } from 'axios'

export default function handleAPIError(error: AxiosError) {
  if (!error.response) {
    throw error
  }

  const { response } = error
  const { status } = response!

  return new ResolverWarning(error, status)
}
