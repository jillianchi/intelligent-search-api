import atob from 'atob'

/**
 * Warning: we stopped using the segment client to decode the segment token for us because it added unnecessary overhead for now.
 * If the getSegment API evolves to do more than a decode we must stop decoding it here and start calling the API once again.
 */
export default async function withSegment(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    vtex: { segmentToken },
    clients: { segment },
  } = ctx

  ctx.vtex.segment = segmentToken
    ? JSON.parse(atob(segmentToken))
    : await segment.getSegment()

  return next()
}
