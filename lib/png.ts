const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
const PNG_HEADER_CHUNK = Buffer.from('IHDR')

export const PNG_DATA_URL_PREFIX = 'data:image/png;base64,'

export function isPng(buffer: Buffer): boolean {
  return (
    buffer.length >= 24 &&
    buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE) &&
    buffer.readUInt32BE(PNG_SIGNATURE.length) === 13 &&
    buffer.subarray(12, 16).equals(PNG_HEADER_CHUNK)
  )
}
