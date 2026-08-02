import assert from 'node:assert/strict'
import test from 'node:test'
import {
  EstimateRequestError,
  MAX_ESTIMATE_ITEM_LENGTH,
  MAX_ESTIMATE_REQUEST_BYTES,
  parseEstimateOutput,
  parseEstimateRequestBody,
} from './estimate-cost.ts'

test('normalises an estimate item and creates a case-insensitive cache value', () => {
  assert.deepEqual(
    parseEstimateRequestBody(JSON.stringify({ item: '  Visit\n  JAPAN  ' })),
    {
      item: 'Visit JAPAN',
      cacheItem: 'visit japan',
    },
  )
})

test('rejects missing, short, and overly long items', () => {
  const invalidBodies = [
    '{}',
    JSON.stringify({ item: 42 }),
    JSON.stringify({ item: 'ab' }),
    JSON.stringify({ item: 'x'.repeat(MAX_ESTIMATE_ITEM_LENGTH + 1) }),
  ]

  for (const body of invalidBodies) {
    assert.throws(
      () => parseEstimateRequestBody(body),
      (error) => error instanceof EstimateRequestError && error.status === 400,
    )
  }
})

test('rejects malformed and oversized request bodies', () => {
  assert.throws(
    () => parseEstimateRequestBody('{'),
    (error) => error instanceof EstimateRequestError && error.status === 400,
  )
  assert.throws(
    () => parseEstimateRequestBody('x'.repeat(MAX_ESTIMATE_REQUEST_BYTES + 1)),
    (error) => error instanceof EstimateRequestError && error.status === 413,
  )
})

test('parses numeric and illegal estimates without accepting extra text', () => {
  assert.equal(parseEstimateOutput('125'), 125)
  assert.equal(parseEstimateOutput(' illegal '), 'Infinity')
  assert.throws(() => parseEstimateOutput('$125'))
  assert.throws(() => parseEstimateOutput('125 dollars'))
  assert.throws(() => parseEstimateOutput('0'))
})
