import { find } from 'lodash'

export default async function variantMiddleware(
  ctx: Context,
  next: () => Promise<void>
): Promise<void> {
  let {
    query: { variant },
    clients: { osiris },
    vtex: { logger },
  } = ctx

  if (variant == null) {
    logger.warn({ message: 'request without variant' })

    return next()
  }

  if (Array.isArray(variant)) {
    variant = variant[0]
  }

  const [experimentId, variantId] = variant.split('-')

  const activeExperiment = await osiris
    .activeExperiment(ctx)
    .catch((exception) => {
      logger.error({ message: 'failed to call osiris', exception })

      return undefined
    })

  if (activeExperiment == null) {
    // No active experiment for store
    logger.warn({ message: 'no active experiment' })

    return next()
  }

  if (activeExperiment.id !== experimentId) {
    // Requested variant from a no longer active experiment
    logger.warn({ message: 'variant from old experiment' })

    return next()
  }

  const variantData = find(
    activeExperiment.variants,
    ({ id }) => id === variantId
  )

  if (variantData == null) {
    // `variant` is not a valid variant for experiment
    logger.warn({ message: 'variant is not a valid', variant })

    return next()
  }

  let route = ctx.headers['x-colossus-route-id']

  if (Array.isArray(route)) {
    route = route[0]
  }

  const configuration = variantData.configuration[route ?? 'unknown'] ?? {}

  ctx.state.additionalParams = {
    ...ctx.state.additionalParams,
    ...configuration,
  }

  return next()
}
