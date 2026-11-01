'use client'

import { useEffect, useRef } from 'react'
import { PIXEL_SIZE, renderAuroraPixels } from '@/lib/aurora'

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
      let colourChanged = false

      if (colourChannels && colourChannels.length >= 3) {
        const nextAccentColour = colourChannels.slice(0, 3).map(Number)
        colourChanged = nextAccentColour.some(
          (channel, index) => channel !== accentColour[index],
        )
        accentColour = nextAccentColour
      }

      const nextWidth = Math.max(1, Math.ceil(bounds.width / PIXEL_SIZE))
      const nextHeight = Math.max(1, Math.ceil(bounds.height / PIXEL_SIZE))
      const dimensionsChanged = nextWidth !== width || nextHeight !== height

      if (!dimensionsChanged) return colourChanged

      width = nextWidth
      height = nextHeight
      canvas.width = nextWidth
      canvas.height = nextHeight
      context.imageSmoothingEnabled = false

      return true
    }

    const render = (time: number) => {
      if (!width || !height) return

      const image = context.createImageData(width, height)
      const pixels = image.data

      pointerX += (pointerTargetX - pointerX) * 0.1
      pointerY += (pointerTargetY - pointerY) * 0.1
      pointerStrength +=
        (pointerTargetStrength - pointerStrength) *
        (pointerTargetStrength > pointerStrength ? 0.12 : 0.025)

      renderAuroraPixels(
        pixels, width, height, accentColour, time,
        pointerX, pointerY, pointerStrength,
      )

      context.putImageData(image, 0, 0)
      canvas.classList.add('dithered-aurora--visible')
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

    const handleResize = () => {
      if (!resize()) return

      const time = reducedMotion.matches ? 0 : performance.now()
      render(time)

      if (!reducedMotion.matches) {
        lastFrame = time
      }
    }

    const handleMotionPreferenceChange = () => {
      cancelAnimationFrame(animationFrame)

      if (reducedMotion.matches) {
        render(0)
      } else {
        lastFrame = performance.now()
        render(lastFrame)
        animationFrame = requestAnimationFrame(animate)
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(canvas)
    reducedMotion.addEventListener('change', handleMotionPreferenceChange)
    window.addEventListener('pointermove', handlePointerMove, {
      passive: true,
    })
    handleResize()

    if (!reducedMotion.matches) {
      animationFrame = requestAnimationFrame(animate)
    }

    return () => {
      cancelAnimationFrame(animationFrame)
      resizeObserver.disconnect()
      reducedMotion.removeEventListener('change', handleMotionPreferenceChange)
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
