'use client'

import { useEffect, useRef } from 'react'

const BAYER_MATRIX = [
  0, 8, 2, 10,
  12, 4, 14, 6,
  3, 11, 1, 9,
  15, 7, 13, 5,
]

const PIXEL_SIZE = 3
const FRAME_INTERVAL = 1000 / 24

const DitheredAurora = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animationFrame = 0
    let lastFrame = 0
    let width = 0
    let height = 0
    let accentColour = [234, 90, 46]
    let pointerX = -100
    let pointerY = -100
    let pointerTargetX = -100
    let pointerTargetY = -100
    let pointerIsNear = false
    let pointerStrength = 0
    let pointerTargetStrength = 0

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const colourChannels = getComputedStyle(canvas).color.match(/[\d.]+/g)

      if (colourChannels && colourChannels.length >= 3) {
        accentColour = colourChannels.slice(0, 3).map(Number)
      }

      width = Math.max(1, Math.ceil(bounds.width / PIXEL_SIZE))
      height = Math.max(1, Math.ceil(bounds.height / PIXEL_SIZE))
      canvas.width = width
      canvas.height = height
      context.imageSmoothingEnabled = false
    }

    const render = (time: number) => {
      if (!width || !height) return

      const phase = time * 0.00012
      const image = context.createImageData(width, height)
      const pixels = image.data

      pointerX += (pointerTargetX - pointerX) * 0.1
      pointerY += (pointerTargetY - pointerY) * 0.1
      pointerStrength +=
        (pointerTargetStrength - pointerStrength) *
        (pointerTargetStrength > pointerStrength ? 0.12 : 0.025)

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

      context.putImageData(image, 0, 0)
    }

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect()
      const wasPointerNear = pointerIsNear
      pointerIsNear =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom
      pointerTargetStrength = pointerIsNear ? 1 : 0

      if (pointerIsNear) {
        pointerTargetX = (event.clientX - bounds.left) / PIXEL_SIZE
        pointerTargetY = (event.clientY - bounds.top) / PIXEL_SIZE

        if (!wasPointerNear) {
          pointerX = pointerTargetX
          pointerY = pointerTargetY
          pointerStrength = Math.max(pointerStrength, 0.35)
        }
      }

      if (reducedMotion.matches) {
        pointerX = pointerTargetX
        pointerY = pointerTargetY
        pointerStrength = pointerTargetStrength
        render(0)
      }
    }

    const animate = (time: number) => {
      if (time - lastFrame >= FRAME_INTERVAL) {
        render(time)
        lastFrame = time
      }
      animationFrame = requestAnimationFrame(animate)
    }

    const start = () => {
      cancelAnimationFrame(animationFrame)
      resize()

      if (reducedMotion.matches) {
        render(0)
      } else {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    const resizeObserver = new ResizeObserver(start)
    resizeObserver.observe(canvas)
    reducedMotion.addEventListener('change', start)
    window.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    })
    start()

    return () => {
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      reducedMotion.removeEventListener('change', start)
      window.removeEventListener('pointermove', handlePointerMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="dithered-aurora"
    />
  )
}

export default DitheredAurora
