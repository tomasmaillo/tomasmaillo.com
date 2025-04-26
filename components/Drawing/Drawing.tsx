'use client'

import { useEffect, useRef, useState } from 'react'
import { Undo2, Eraser, Download, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface DrawingProps {
  width?: number
  height?: number
  onClose?: () => void
}

type ColorOption = {
  name: string
  value: string
}

const COLORS: ColorOption[] = [
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#E53935' }, // mid-tone red
  { name: 'Orange', value: '#FB8C00' }, // mid-tone orange
  { name: 'Yellow', value: '#FDD835' }, // mid-tone yellow
  { name: 'Green', value: '#43A047' }, // mid-tone green
  { name: 'Teal', value: '#00897B' }, // mid-tone teal
  { name: 'Blue', value: '#1E88E5' }, // mid-tone blue
  { name: 'Purple', value: '#8E24AA' }, // mid-tone purple
]

const RANDOM_TITLES = [
  'pencil',
  'artist',
  'creator',
  'dreamer',
  'explorer',
  'wanderer',
  'thinker',
  'observer',
  'storyteller',
  'imagineer',
  'adventurer',
  'visionary',
  'painter',
  'sketcher',
  'illustrator',
  'designer',
]

export default function Drawing({
  width = 128,
  height = 64,
  onClose,
}: DrawingProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [brushSize] = useState(4)
  const [lastX, setLastX] = useState(0)
  const [lastY, setLastY] = useState(0)
  const [history, setHistory] = useState<ImageData[]>([])
  const [currentStep, setCurrentStep] = useState(-1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [canvasScale, setCanvasScale] = useState(1)

  // New state for author and message
  const [authorName, setAuthorName] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const updateCanvasScale = () => {
      if (!containerRef.current || !canvasRef.current) return

      const containerWidth = containerRef.current.clientWidth
      const scale = containerWidth / width
      setCanvasScale(scale)

      const canvas = canvasRef.current
      canvas.style.width = `${width * scale}px`
      canvas.style.height = `${height * scale}px`
    }

    updateCanvasScale()
    window.addEventListener('resize', updateCanvasScale)
    return () => window.removeEventListener('resize', updateCanvasScale)
  }, [width, height])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = brushSize
    ctx.strokeStyle = color

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    saveState()
  }, [width, height])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = color
  }, [color])

  const saveState = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const imageData = ctx.getImageData(0, 0, width, height)
    setHistory((prev) => [...prev.slice(0, currentStep + 1), imageData])
    setCurrentStep((prev) => prev + 1)
  }

  const undo = () => {
    if (currentStep > 0) {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      setCurrentStep((prev) => prev - 1)
      ctx.putImageData(history[currentStep - 1], 0, 0)
    }
  }

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = color

    const rect = canvas.getBoundingClientRect()
    let x, y

    if ('touches' in e) {
      // Touch event
      x = (e.touches[0].clientX - rect.left) / canvasScale
      y = (e.touches[0].clientY - rect.top) / canvasScale
    } else {
      // Mouse event
      x = (e.clientX - rect.left) / canvasScale
      y = (e.clientY - rect.top) / canvasScale
    }

    setIsDrawing(true)
    setLastX(x)
    setLastY(y)
  }

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.strokeStyle = color

    const rect = canvas.getBoundingClientRect()
    let x, y

    if ('touches' in e) {
      // Touch event
      x = (e.touches[0].clientX - rect.left) / canvasScale
      y = (e.touches[0].clientY - rect.top) / canvasScale
    } else {
      // Mouse event
      x = (e.clientX - rect.left) / canvasScale
      y = (e.clientY - rect.top) / canvasScale
    }

    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(x, y)
    ctx.stroke()

    setLastX(x)
    setLastY(y)
  }

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false)
      saveState()
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    saveState()
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = 'my-drawing.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  const submitDrawing = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    setIsSubmitting(true)

    try {
      const imageData = canvas.toDataURL('image/png')

      const response = await fetch('/api/moderate-drawing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageData: imageData.split(',')[1],
          authorName,
          message,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit drawing')
      }

      const result = await response.json()

      if (result.isApproved) {
        toast.success('Your visitor log is now in the gallery!')
      } else {
        toast.error('🤨')
      }

      if (onClose) onClose()
    } catch (error) {
      toast.error('Error saving your drawing. Please try again.')
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto p-4">
      <div className="flex flex-col items-center gap-4 w-full">
        <div className="grid grid-cols-8 gap-2 w-full">
          {COLORS.map((colorOption) => (
            <button
              key={colorOption.value}
              onClick={() => setColor(colorOption.value)}
              className={`aspect-square rounded-lg border-2 transition-all ${
                color === colorOption.value ? 'scale-90' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: colorOption.value }}
              title={colorOption.name}
            />
          ))}
        </div>

        <div className="relative w-full" ref={containerRef}>
          <canvas
            ref={canvasRef}
            width={width}
            height={height}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseOut={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            className="border border-gray-300 rounded-lg cursor-crosshair bg-white w-full"
            style={{
              imageRendering: 'pixelated',
              touchAction: 'none', // Prevent scrolling while drawing
            }}
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={undo}
              disabled={currentStep <= 0}
              className="p-2 bg-white/60 hover:bg-white rounded-lg shadow-sm transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-md border border-gray-300">
              <Undo2 className="w-4 h-4 text-gray-800" />
            </button>
            <button
              onClick={clearCanvas}
              className="p-2 bg-white/60 hover:bg-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md border border-gray-300">
              <Eraser className="w-4 h-4 text-gray-800" />
            </button>
            <button
              onClick={downloadCanvas}
              className="p-2 bg-white/60 hover:bg-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md border border-gray-300">
              <Download className="w-4 h-4 text-gray-800" />
            </button>
          </div>
        </div>

        <div className="w-full space-y-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Message for your drawing (optional)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none text-sm"
            rows={1}
          />
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            placeholder="Your name (or be anonymous)"
          />
        </div>

        <button
          onClick={submitDrawing}
          disabled={isSubmitting}
          className="w-full px-4 py-2 bg-accent text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-200">
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            'Submit Drawing'
          )}
        </button>
      </div>
    </div>
  )
}
