export const MAX_ESTIMATE_REQUEST_BYTES = 1024
export const MIN_ESTIMATE_ITEM_LENGTH = 3
export const MAX_ESTIMATE_ITEM_LENGTH = 160

export type EstimatedCost = number | 'Infinity'

export class EstimateRequestError extends Error {
  readonly status: 400 | 413

  constructor(message: string, status: 400 | 413) {
    super(message)
    this.name = 'EstimateRequestError'
    this.status = status
  }
}

export function parseEstimateRequestBody(body: string) {
  if (new TextEncoder().encode(body).byteLength > MAX_ESTIMATE_REQUEST_BYTES) {
    throw new EstimateRequestError('Request body is too large', 413)
  }

  let payload: unknown

  try {
    payload = JSON.parse(body)
  } catch {
    throw new EstimateRequestError('Request body must be valid JSON', 400)
  }

  if (
    typeof payload !== 'object' ||
    payload === null ||
    !('item' in payload) ||
    typeof payload.item !== 'string'
  ) {
    throw new EstimateRequestError('Item is required', 400)
  }

  const item = payload.item.trim().replace(/\s+/g, ' ')

  if (item.length < MIN_ESTIMATE_ITEM_LENGTH) {
    throw new EstimateRequestError(
      `Item must be at least ${MIN_ESTIMATE_ITEM_LENGTH} characters`,
      400,
    )
  }

  if (item.length > MAX_ESTIMATE_ITEM_LENGTH) {
    throw new EstimateRequestError(
      `Item must be no more than ${MAX_ESTIMATE_ITEM_LENGTH} characters`,
      400,
    )
  }

  return {
    item,
    cacheItem: item.toLocaleLowerCase('en'),
  }
}

export function parseEstimateOutput(output: string): EstimatedCost {
  const value = output.trim()

  if (value.toUpperCase() === 'ILLEGAL') {
    return 'Infinity'
  }

  if (!/^\d+$/.test(value)) {
    throw new Error('OpenAI returned an invalid estimate')
  }

  const estimate = Number(value)

  if (!Number.isSafeInteger(estimate) || estimate < 1) {
    throw new Error('OpenAI returned an invalid estimate')
  }

  return estimate
}
