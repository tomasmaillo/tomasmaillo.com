'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { getApprovedDrawings } from '@/lib/supabase'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import Drawing from './Drawing'

interface Drawing {
  id: string
  image_url: string
  created_at: string
  author_name: string
  message: string
  position?: { x: number; y: number; rotation: number }
}

// Custom hook for drag functionality
const useDraggable = () => {
  const handleDragStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent, target: HTMLDivElement) => {
      const container = target.parentElement
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const isTouch = 'touches' in e
      const startX = isTouch
        ? (e as React.TouchEvent).touches[0].clientX
        : (e as React.MouseEvent).clientX
      const startY = isTouch
        ? (e as React.TouchEvent).touches[0].clientY
        : (e as React.MouseEvent).clientY
      const startLeft = target.offsetLeft
      const startTop = target.offsetTop

      // Get current rotation from transform
      const currentTransform = window.getComputedStyle(target).transform
      const matrix = new DOMMatrix(currentTransform)
      const currentRotation = Math.round(
        Math.atan2(matrix.b, matrix.a) * (180 / Math.PI)
      )

      // Set dragging styles
      target.style.zIndex = '1000'
      target.style.transition = 'none'
      target.style.transform = `rotate(${currentRotation}deg) scale(1.05)`
      if (!isTouch) target.style.cursor = 'grabbing'

      const handleMove = (moveEvent: MouseEvent | TouchEvent) => {
        const currentX =
          'touches' in moveEvent
            ? moveEvent.touches[0].clientX
            : moveEvent.clientX
        const currentY =
          'touches' in moveEvent
            ? moveEvent.touches[0].clientY
            : moveEvent.clientY
        const deltaX = currentX - startX
        const deltaY = currentY - startY

        let newLeft = startLeft + deltaX
        let newTop = startTop + deltaY

        // Apply boundaries considering image size
        const maxX = containerRect.width - target.offsetWidth
        const maxY = containerRect.height - target.offsetHeight

        newLeft = Math.max(0, Math.min(newLeft, maxX))
        newTop = Math.max(0, Math.min(newTop, maxY))

        target.style.left = `${newLeft}px`
        target.style.top = `${newTop}px`
      }

      const handleEnd = () => {
        target.style.zIndex = '1000'
        target.style.transition = 'transform 0.2s ease-out'
        target.style.transform = `rotate(${currentRotation}deg) scale(1)`
        if (!isTouch) target.style.cursor = 'grab'

        document.removeEventListener(
          isTouch ? 'touchmove' : 'mousemove',
          handleMove
        )
        document.removeEventListener(
          isTouch ? 'touchend' : 'mouseup',
          handleEnd
        )
      }

      document.addEventListener(
        isTouch ? 'touchmove' : 'mousemove',
        handleMove,
        { passive: false }
      )
      document.addEventListener(isTouch ? 'touchend' : 'mouseup', handleEnd)
    },
    []
  )

  return handleDragStart
}

// Function to calculate initial positions for drawings
const calculateInitialPositions = (
  drawings: Drawing[],
  containerWidth: number,
  containerHeight: number
) => {
  return drawings.map((drawing, index) => {
    // Create a grid-like distribution
    const gridSize = Math.ceil(Math.sqrt(drawings.length))
    const cellWidth = containerWidth / gridSize
    const cellHeight = containerHeight / gridSize

    // Calculate base position in grid
    const row = Math.floor(index / gridSize)
    const col = index % gridSize

    // Add some randomness within the cell
    const x = col * cellWidth + (Math.random() * 0.8 + 0.1) * cellWidth
    const y = row * cellHeight + (Math.random() * 0.8 + 0.1) * cellHeight

    return {
      ...drawing,
      position: {
        x,
        y,
        rotation: Math.random() * 10 - 5,
      },
    }
  })
}

export default function Gallery() {
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [containerSize, setContainerSize] = useState({
    width: 800,
    height: 600,
  }) // Default size
  const handleDragStart = useDraggable()
  const existingDrawingIds = useRef<Set<string>>(new Set())
  const [newDrawing, setNewDrawing] = useState<Drawing | null>(null)

  // Fetch initial drawings
  useEffect(() => {
    async function fetchDrawings() {
      try {
        const data = await getApprovedDrawings(10)
        // Store positions in state to prevent re-randomization on re-render
        const drawingsWithPositions = calculateInitialPositions(
          data,
          containerSize.width,
          containerSize.height
        )
        setDrawings(drawingsWithPositions)

        // Store existing drawing IDs
        existingDrawingIds.current = new Set(data.map((d) => d.id))
      } catch (err) {
        setError('Failed to load drawings')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDrawings()
  }, []) // Remove containerSize dependency

  // Function to fetch only new drawings
  const fetchNewDrawings = useCallback(async () => {
    try {
      const data = await getApprovedDrawings(10)

      // Filter out drawings we already have
      const newDrawings = data.filter(
        (d) => !existingDrawingIds.current.has(d.id)
      )

      if (newDrawings.length > 0) {
        // Add the new drawing IDs to our set
        newDrawings.forEach((d) => existingDrawingIds.current.add(d.id))

        // Calculate position for the new drawing
        const newDrawingWithPosition = calculateInitialPositions(
          [newDrawings[0]], // Just position the first new drawing
          containerSize.width,
          containerSize.height
        )[0]

        // Set the new drawing with animation
        setNewDrawing(newDrawingWithPosition)

        // After animation completes, add to main drawings list
        setTimeout(() => {
          setDrawings((prev) => [...prev, newDrawingWithPosition])
          setNewDrawing(null)
        }, 1000) // Match this with CSS animation duration
      }
    } catch (err) {
      console.error('Error fetching new drawings:', err)
    }
  }, [containerSize.width, containerSize.height])

  const handleDrawingSubmitted = () => {
    setIsDialogOpen(false)
    // Fetch new drawings after a short delay to allow for moderation
    setTimeout(() => {
      fetchNewDrawings()
    }, 3000)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-pulse text-muted">Loading gallery...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-4 bg-red-50 text-red-700 rounded-lg">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center h-full">
      <div className="mb-4">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="link"
              className="absolute top-0 -translate-x-1/2 z-10">
              Log your visit
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Drawing
              width={512}
              height={384}
              onClose={handleDrawingSubmitted}
            />
          </DialogContent>
        </Dialog>
      </div>

      {drawings.length === 0 && !newDrawing ? (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-muted">
            No drawings yet. Be the first to create one!
          </p>
        </div>
      ) : (
        <div
          className="relative h-full w-full overflow-hidden"
          ref={(el) => {
            if (el) {
              const newWidth = el.clientWidth
              const newHeight = el.clientHeight
              if (
                newWidth !== containerSize.width ||
                newHeight !== containerSize.height
              ) {
                setContainerSize({
                  width: newWidth || 800,
                  height: newHeight || 600,
                })
              }
            }
          }}>
          {/* Render existing drawings */}
          {drawings.map((drawing, index) => (
            <div
              key={drawing.id}
              className="absolute cursor-grab active:cursor-grabbing transition-colors shadow-md active:shadow-lg"
              style={{
                left: `${drawing.position?.x || 0}px`,
                top: `${drawing.position?.y || 0}px`,
                transform: `rotate(${drawing.position?.rotation || 0}deg)`,
                zIndex: index,
                touchAction: 'none',
                width: 'auto',
                height: 'auto',
                maxWidth: '200px',
                maxHeight: '200px',
              }}
              onMouseDown={(e) => handleDragStart(e, e.currentTarget)}
              onTouchStart={(e) => handleDragStart(e, e.currentTarget)}>
              <div className="relative w-full h-full">
                <Image
                  src={drawing.image_url}
                  alt="User drawing"
                  fill
                  className="object-contain rounded-sm"
                  draggable={false}
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement
                    const container = img.parentElement
                      ?.parentElement as HTMLDivElement
                    if (container) {
                      const aspectRatio = img.naturalWidth / img.naturalHeight
                      const maxSize = 200

                      if (aspectRatio > 1) {
                        container.style.width = `${maxSize}px`
                        container.style.height = `${maxSize / aspectRatio}px`
                      } else {
                        container.style.height = `${maxSize}px`
                        container.style.width = `${maxSize * aspectRatio}px`
                      }
                    }
                  }}
                />
                <div className="absolute bottom-1 right-1 text-xs text-gray-600 bg-white/70 px-1 rounded">
                  By {drawing.author_name}
                </div>
                {drawing.message && (
                  <div className="absolute top-1 left-1 right-1 text-xs text-gray-600 bg-white/70 p-1 rounded max-h-16 overflow-y-auto">
                    {drawing.message}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Render new drawing with animation */}
          {newDrawing && (
            <div
              key={newDrawing.id}
              className="absolute cursor-grab active:cursor-grabbing transition-all shadow-md active:shadow-lg animate-drawing-appear"
              style={
                {
                  left: `${newDrawing.position?.x || 0}px`,
                  top: `${newDrawing.position?.y || 0}px`,
                  transform: `rotate(${newDrawing.position?.rotation || 0}deg)`,
                  zIndex: 1000,
                  touchAction: 'none',
                  width: 'auto',
                  height: 'auto',
                  maxWidth: '200px',
                  maxHeight: '200px',
                  opacity: 0,
                  scale: 0.5,
                  '--rotation': `${newDrawing.position?.rotation || 0}deg`,
                } as React.CSSProperties
              }
              onMouseDown={(e) => handleDragStart(e, e.currentTarget)}
              onTouchStart={(e) => handleDragStart(e, e.currentTarget)}>
              <div className="relative w-full h-full">
                <Image
                  src={newDrawing.image_url}
                  alt="New drawing"
                  fill
                  className="object-contain rounded-sm"
                  draggable={false}
                  onLoad={(e) => {
                    const img = e.target as HTMLImageElement
                    const container = img.parentElement
                      ?.parentElement as HTMLDivElement
                    if (container) {
                      const aspectRatio = img.naturalWidth / img.naturalHeight
                      const maxSize = 200

                      if (aspectRatio > 1) {
                        container.style.width = `${maxSize}px`
                        container.style.height = `${maxSize / aspectRatio}px`
                      } else {
                        container.style.height = `${maxSize}px`
                        container.style.width = `${maxSize * aspectRatio}px`
                      }
                    }
                  }}
                />
                <div className="absolute bottom-1 right-1 text-xs text-gray-600 bg-white/70 px-1 rounded">
                  By {newDrawing.author_name}
                </div>
                {newDrawing.message && (
                  <div className="absolute top-1 left-1 right-1 text-xs text-gray-600 bg-white/70 p-1 rounded max-h-16 overflow-y-auto">
                    {newDrawing.message}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
