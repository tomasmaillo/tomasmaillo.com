import assert from 'node:assert/strict'
import test from 'node:test'
import { isPng } from './png.ts'

test('accepts a PNG with a valid signature and IHDR chunk', () => {
  const png = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9Z4x0AAAAASUVORK5CYII=',
    'base64',
  )

  assert.equal(isPng(png), true)
})

test('rejects non-PNG image data', () => {
  const gif = Buffer.from('R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==', 'base64')

  assert.equal(isPng(gif), false)
})

test('rejects a PNG signature without an IHDR chunk', () => {
  const malformedPng = Buffer.from([
    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 66, 65, 68, 33, 0, 0,
    0, 0, 0, 0, 0, 0,
  ])

  assert.equal(isPng(malformedPng), false)
})
