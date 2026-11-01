import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { renderAuroraPixels } from '@/lib/aurora'

export const alt = 'Tomas Maillo'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const OG_PIXEL_SIZE = 6

function auroraImage() {
  const width = 1152 / OG_PIXEL_SIZE
  const height = 384 / OG_PIXEL_SIZE
  const pixels = new Uint8ClampedArray(width * height * 4)
  renderAuroraPixels(pixels, width, height, [234, 91, 46], 0)

  // Group pixels by opacity to keep the SVG small. Match the homepage's
  // light-theme opacity and CSS mask, with a coarser grid for the preview.
  const paths = new Map<number, string[]>()
  for (let y = 0; y < height; y++) {
    const position = y / height
    const mask = Math.min(1, position / 0.15, (1 - position) / 0.32)
    for (let x = 0; x < width; x++) {
      const alpha = Math.round(pixels[(y * width + x) * 4 + 3] * mask * 0.78)
      if (!alpha) continue
      if (!paths.has(alpha)) paths.set(alpha, [])
      paths.get(alpha)!.push(`M${x * OG_PIXEL_SIZE} ${y * OG_PIXEL_SIZE}h${OG_PIXEL_SIZE}v${OG_PIXEL_SIZE}h-${OG_PIXEL_SIZE}z`)
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1152" height="384">${
    [...paths].map(([alpha, path]) =>
      `<path fill="hsl(14,82%,55%)" fill-opacity="${alpha / 255}" d="${path.join('')}"/>`,
    ).join('')
  }</svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

export default async function Image() {
  const editorial = await readFile(join(process.cwd(), 'public/fonts/PPEditorialNew-Regular.otf'))

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        background: 'hsl(0, 0%, 100%)', color: 'hsl(222.2, 84%, 4.9%)',
        fontFamily: 'Editorial New', padding: '0 80px',
      }}>
        {/* Static snapshot of DitheredAurora; colours match globals.css. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" src={auroraImage()} width={1152} height={384}
          style={{ position: 'absolute', top: -24, left: 24 }} />
        <div style={{ display: 'flex', marginTop: 'auto', marginBottom: 64, fontSize: 64 }}>
          Tomas Maillo
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Editorial New', data: editorial, weight: 400, style: 'normal' }],
    },
  )
}
