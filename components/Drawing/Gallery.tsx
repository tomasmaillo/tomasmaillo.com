'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { getApprovedDrawings } from '@/lib/supabase'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import Drawing from './Drawing'
import Link from 'next/link'
import DrawYourOwnCard from './DrawYourOwnCard'
import { ArrowRight } from 'lucide-react'

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
  const maxDrawingSize = 200
  const padding = 20 // Padding from edges

  return drawings.map((drawing, index) => {
    // Calculate available space for random positioning
    const availableWidth = containerWidth - maxDrawingSize - padding * 2
    const availableHeight = containerHeight - maxDrawingSize - padding * 2

    // Generate random position within available space
    const x = padding + Math.random() * availableWidth
    const y = padding + Math.random() * availableHeight

    // console.log(`Drawing ${index} (${drawing.id}):`)
    // console.log(`  Available space: ${availableWidth}x${availableHeight}`)
    // console.log(`  Final position: (${x}, ${y})`)

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
    width: 0,
    height: 0,
  })
  const handleDragStart = useDraggable()
  const existingDrawingIds = useRef<Set<string>>(new Set())
  const [newDrawing, setNewDrawing] = useState<Drawing | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasPositionedDrawings = useRef(false)
  const [isContainerReady, setIsContainerReady] = useState(false)
  const hasFetchedDrawings = useRef(false)

  const updateContainerSize = useCallback(() => {
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect()
      // console.log('Container size update:', { width, height })
      if (width > 0 && height > 0) {
        setContainerSize({ width, height })
        setIsContainerReady(true)
      }
    }
  }, [])

  // Update container size when it changes
  useEffect(() => {
    // Initial size update
    updateContainerSize()

    // Use MutationObserver to watch for style changes
    const observer = new MutationObserver((mutations) => {
      // console.log('Mutation detected:', mutations)
      updateContainerSize()
    })

    if (containerRef.current) {
      observer.observe(containerRef.current, {
        attributes: true,
        attributeFilter: ['style', 'class'],
        childList: true,
        subtree: true,
      })
    }

    // Force update on window resize
    const handleResize = () => {
      // console.log('Window resize detected')
      requestAnimationFrame(updateContainerSize)
    }

    window.addEventListener('resize', handleResize)

    // Force an update after a short delay to catch any initial layout
    const initialUpdate = setTimeout(updateContainerSize, 100)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      clearTimeout(initialUpdate)
    }
  }, [updateContainerSize])

  // Ensure we measure the container again **after** the drawings have been
  // rendered for the first time. Without this pass the ref might still be
  // null when the initial `useEffect` above runs (because there were no
  // drawings yet, thus the container div was not rendered). By forcing one
  // more measurement when `drawings` changes from empty → populated we make
  // sure `isContainerReady` becomes `true` and the first set of positions is
  // calculated right away - no more need for the user to resize the window.
  useEffect(() => {
    if (!isContainerReady && containerRef.current) {
      updateContainerSize()
    }
  }, [drawings, isContainerReady, updateContainerSize])

  // -------------------------------------------------------------------------
  // Keep drawings inside the container when it resizes. We DON'T randomise
  // again - we simply clamp the existing x/y to the new bounds so the layout
  // feels stable on resize.
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!hasPositionedDrawings.current) return
    if (containerSize.width === 0 || containerSize.height === 0) return

    const maxDrawingSize = 200

    setDrawings((prev) =>
      prev.map((d) => {
        if (!d.position) return d

        const maxX = containerSize.width - maxDrawingSize
        const maxY = containerSize.height - maxDrawingSize

        const clampedX = Math.min(Math.max(0, d.position.x), maxX)
        const clampedY = Math.min(Math.max(0, d.position.y), maxY)

        if (clampedX === d.position.x && clampedY === d.position.y) {
          return d // no change needed
        }

        return {
          ...d,
          position: {
            ...d.position,
            x: clampedX,
            y: clampedY,
          },
        }
      })
    )
  }, [containerSize.width, containerSize.height])

  // Fetch initial drawings and position them immediately when container is ready
  useEffect(() => {
    async function fetchDrawings() {
      try {
        const data = await getApprovedDrawings(10)
        existingDrawingIds.current = new Set(data.map((d) => d.id))

        // If container is ready, position drawings immediately
        if (
          isContainerReady &&
          containerSize.width > 0 &&
          containerSize.height > 0
        ) {
          const drawingsWithPositions = calculateInitialPositions(
            data,
            containerSize.width,
            containerSize.height
          )
          setDrawings(drawingsWithPositions)
          hasPositionedDrawings.current = true
        } else {
          // Otherwise, just set the drawings and wait for container to be ready
          setDrawings(data)
        }
      } catch (err) {
        setError('Failed to load drawings')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    if (!hasFetchedDrawings.current) {
      fetchDrawings()
      hasFetchedDrawings.current = true
    }
  }, [isContainerReady, containerSize.width, containerSize.height])

  // Calculate positions when container becomes ready
  useEffect(() => {
    if (
      !hasPositionedDrawings.current &&
      drawings.length > 0 &&
      isContainerReady &&
      containerSize.width > 0 &&
      containerSize.height > 0
    ) {
      // console.log('Calculating positions with container size:', containerSize)
      const drawingsWithPositions = calculateInitialPositions(
        drawings,
        containerSize.width,
        containerSize.height
      )
      setDrawings(drawingsWithPositions)
      hasPositionedDrawings.current = true
    }
  }, [
    drawings.length,
    containerSize.width,
    containerSize.height,
    isContainerReady,
  ])

  // Function to fetch only new drawings
  const fetchNewDrawings = useCallback(async () => {
    try {
      const data = await getApprovedDrawings(10)
      const newDrawings = data.filter(
        (d) => !existingDrawingIds.current.has(d.id)
      )

      if (newDrawings.length > 0) {
        newDrawings.forEach((d) => existingDrawingIds.current.add(d.id))
        const newDrawingWithPosition = calculateInitialPositions(
          [newDrawings[0]],
          containerSize.width,
          containerSize.height
        )[0]
        setNewDrawing(newDrawingWithPosition)
        setTimeout(() => {
          setDrawings((prev) => [...prev, newDrawingWithPosition])
          setNewDrawing(null)
        }, 1000)
      }
    } catch (err) {
      console.error('Error fetching new drawings:', err)
    }
  }, [containerSize.width, containerSize.height])

  const handleDrawingSubmitted = () => {
    setIsDialogOpen(false)
    setTimeout(() => {
      fetchNewDrawings()
    }, 2000)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-pulse text-muted">
          Looking for visitors&apos; drawings...
        </div>
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
      <div className="flex gap-4 items-center justify-center h-full">
        <DrawYourOwnCard
          onClick={() => setIsDialogOpen(true)}
          className="absolute top-1/2 -translate-y-1/2 z-10 h-[150px] w-[200px]"
        />
      </div>

      {drawings.length === 0 && !newDrawing ? (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-muted">
            No drawings yet. Be the first to create one!
          </p>
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative h-full w-full overflow-hidden"
          style={{ minHeight: '400px' }}
          onTransitionEnd={updateContainerSize}>
          {/* Render existing drawings */}
          {drawings.map((drawing, index) => (
            <div
              key={drawing.id}
              className="absolute cursor-grab active:cursor-grabbing transition-colors shadow-md active:shadow-lg"
              style={{
                left: `${drawing.position?.x || 0}px`,
                top: `${drawing.position?.y || 0}px`,
                transform: `rotate(${drawing.position?.rotation || 0}deg)`,
                zIndex: index + 10,
                touchAction: 'none',
                width: 'auto',
                height: 'auto',
                maxWidth: '200px',
                maxHeight: '200px',
                opacity: drawing.position ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
              }}
              onMouseDown={(e) => handleDragStart(e, e.currentTarget)}
              onTouchStart={(e) => handleDragStart(e, e.currentTarget)}>
              <div className="relative w-full h-full">
                <Image
                  unoptimized
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
              style={{
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
              }}
              onMouseDown={(e: React.MouseEvent) =>
                handleDragStart(e, e.currentTarget as HTMLDivElement)
              }
              onTouchStart={(e: React.TouchEvent) =>
                handleDragStart(e, e.currentTarget as HTMLDivElement)
              }>
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

          <Link href="/gallery" className="absolute bottom-4 right-4 z-10">
            <Button
              variant="link"
              className="flex items-center gap-2">
              View all drawings
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <Drawing width={512} height={384} onClose={handleDrawingSubmitted} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
