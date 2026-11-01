const BAYER_MATRIX = [
  0, 8, 2, 10,
  12, 4, 14, 6,
  3, 11, 1, 9,
  15, 7, 13, 5,
]

export const PIXEL_SIZE = 3

// Shared by the animated homepage and its static social preview.
export function renderAuroraPixels(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  accentColour: readonly number[],
  time: number,
  pointerX = -100,
  pointerY = -100,
  pointerStrength = 0,
) {
  const phase = time * 0.00012
  for (let y = 0; y < height; y += 1) {
    const ny = y / height

    for (let x = 0; x < width; x += 1) {
      const nx = x / width
      const edgeFade = Math.min(1, nx * 6, (1 - nx) * 6)
      const lowerFade = Math.max(0, 1 - Math.pow(ny, 2.1))
      const curtain =
        0.72 +
        0.18 * Math.sin(nx * 42 + phase * 5) +
        0.1 * Math.sin(nx * 91 - phase * 3)

      const firstCurve =
        0.26 +
        0.075 * Math.sin(nx * 5.4 + phase) +
        0.025 * Math.sin(nx * 14 - phase * 1.7)
      const secondCurve =
        0.43 +
        0.09 * Math.sin(nx * 4.1 - phase * 0.8 + 1.8) +
        0.018 * Math.sin(nx * 17 + phase)
      const thirdCurve =
        0.16 + 0.04 * Math.sin(nx * 7.2 + phase * 1.3 + 3.4)

      const firstRibbon = Math.exp(
        -Math.pow((ny - firstCurve) / 0.085, 2),
      )
      const secondRibbon = Math.exp(
        -Math.pow((ny - secondCurve) / 0.105, 2),
      )
      const highRibbon = Math.exp(
        -Math.pow((ny - thirdCurve) / 0.055, 2),
      )
      const trailingGlow =
        ny > firstCurve
          ? Math.exp(-(ny - firstCurve) * 6.5) * 0.3
          : 0

      const grain =
        0.94 + 0.06 * Math.sin(x * 1.73 + y * 2.37 + phase * 4)
      const pointerDistance =
        Math.pow(x - pointerX, 2) + Math.pow(y - pointerY, 2)
      const pointerInfluence =
        Math.exp(-pointerDistance / (2 * Math.pow(16, 2))) *
        0.18 *
        pointerStrength
      const intensity = Math.min(
        1,
        (firstRibbon * 0.68 +
          secondRibbon * 0.42 +
          highRibbon * 0.28 +
          trailingGlow) *
          curtain *
          edgeFade *
          lowerFade *
          grain +
          pointerInfluence * edgeFade * lowerFade,
      )
      const threshold =
        (BAYER_MATRIX[(y % 4) * 4 + (x % 4)] + 0.5) / 16

      if (intensity > threshold) {
        const index = (y * width + x) * 4
        pixels[index] = accentColour[0]
        pixels[index + 1] = accentColour[1]
        pixels[index + 2] = accentColour[2]
        pixels[index + 3] = Math.round(90 + intensity * 130)
      }
    }
  }
}
