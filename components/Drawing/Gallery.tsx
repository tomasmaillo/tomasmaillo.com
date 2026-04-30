'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { getApprovedDrawings } from '@/lib/supabase'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import Drawing from './Drawing'
import Link from 'next/link'
import DrawYourOwnCard from './DrawYourOwnCard'
import { ArrowRight, Pencil } from 'lucide-react'
import { usePostHog } from '@posthog/react'

interface Drawing {
  id: string
  image_url: string
  created_at: string
  author_name: string
  message: string
  position?: { x: number; y: number; rotation: number }
}

const DESKTOP_DRAWING_MAX_SIZE = 200
const MOBILE_DRAWING_MAX_SIZE = 150
const MOBILE_DRAWING_BREAKPOINT = 640
const DRAWING_PADDING = 20
const DRAWING_PLACEMENT_ATTEMPTS = 70
const DRAWING_BREATHING_ROOM = 28
const DRAW_YOUR_OWN_CARD_WIDTH = 200
const DRAW_YOUR_OWN_CARD_HEIGHT = 150
const MOBILE_ADD_BUTTON_WIDTH = 150
const MOBILE_ADD_BUTTON_HEIGHT = 40
const MOBILE_ADD_BUTTON_OFFSET = 16

interface PlacementBox {
  x: number
  y: number
  width: number
  height: number
}

const getDrawingMaxSize = (containerWidth: number) =>
  containerWidth > 0 && containerWidth < MOBILE_DRAWING_BREAKPOINT
    ? MOBILE_DRAWING_MAX_SIZE
    : DESKTOP_DRAWING_MAX_SIZE

const getOverlapArea = (a: PlacementBox, b: PlacementBox) => {
  const overlapWidth = Math.max(
    0,
    Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x),
  )
  const overlapHeight = Math.max(
    0,
    Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y),
  )

  return overlapWidth * overlapHeight
}

const expandBox = (box: PlacementBox, amount: number): PlacementBox => ({
  x: box.x - amount,
  y: box.y - amount,
  width: box.width + amount * 2,
  height: box.height + amount * 2,
})

const getDrawingBox = (
  x: number,
  y: number,
  drawingMaxSize: number,
): PlacementBox => ({
  x,
  y,
  width: drawingMaxSize,
  height: drawingMaxSize,
})

const getDrawYourOwnCardBox = (
  containerWidth: number,
  containerHeight: number,
): PlacementBox => ({
  x: Math.max(0, (containerWidth - DRAW_YOUR_OWN_CARD_WIDTH) / 2),
  y: Math.max(0, (containerHeight - DRAW_YOUR_OWN_CARD_HEIGHT) / 2),
  width: DRAW_YOUR_OWN_CARD_WIDTH,
  height: DRAW_YOUR_OWN_CARD_HEIGHT,
})

const getMobileAddButtonBox = (
  containerHeight: number,
): PlacementBox => ({
  x: MOBILE_ADD_BUTTON_OFFSET,
  y: Math.max(
    0,
    containerHeight - MOBILE_ADD_BUTTON_HEIGHT - MOBILE_ADD_BUTTON_OFFSET,
  ),
  width: MOBILE_ADD_BUTTON_WIDTH,
  height: MOBILE_ADD_BUTTON_HEIGHT,
})

const getProtectedControlBox = (
  containerWidth: number,
  containerHeight: number,
) =>
  containerWidth < MOBILE_DRAWING_BREAKPOINT
    ? getMobileAddButtonBox(containerHeight)
    : getDrawYourOwnCardBox(containerWidth, containerHeight)

const scorePlacement = (
  candidate: PlacementBox,
  placedBoxes: PlacementBox[],
  protectedControlBox: PlacementBox,
) => {
  const relaxedCandidate = expandBox(candidate, DRAWING_BREATHING_ROOM)

  const drawingPenalty = placedBoxes.reduce((score, placedBox) => {
    const overlapPenalty = getOverlapArea(candidate, placedBox) * 2.5
    const crowdingPenalty = getOverlapArea(
      relaxedCandidate,
      expandBox(placedBox, DRAWING_BREATHING_ROOM),
    )

    return score + overlapPenalty + crowdingPenalty
  }, 0)

  const controlOverlapPenalty = getOverlapArea(candidate, protectedControlBox) * 4
  const controlCrowdingPenalty = getOverlapArea(
    relaxedCandidate,
    expandBox(protectedControlBox, DRAWING_BREATHING_ROOM),
  )

  return drawingPenalty + controlOverlapPenalty + controlCrowdingPenalty
}

const getRandomPosition = (containerWidth: number, containerHeight: number) => {
  const drawingMaxSize = getDrawingMaxSize(containerWidth)
  const availableWidth = Math.max(
    0,
    containerWidth - drawingMaxSize - DRAWING_PADDING * 2,
  )
  const availableHeight = Math.max(
    0,
    containerHeight - drawingMaxSize - DRAWING_PADDING * 2,
  )

  return {
    x: DRAWING_PADDING + Math.random() * availableWidth,
    y: DRAWING_PADDING + Math.random() * availableHeight,
  }
}

type DrawingPopupTriggerVariant =
  | 'wide_screen_card'
  | 'bottom_left_mobile_button'

type DrawingDragEvent = {
  drawingId: string
  inputType: 'mouse' | 'touch'
  startX: number
  startY: number
  endX: number
  endY: number
  deltaX: number
  deltaY: number
  distance: number
}

// Custom hook for drag functionality
const useDraggable = (onDragEnd?: (event: DrawingDragEvent) => void) => {
  const handleDragStart = useCallback(
    (
      e: React.MouseEvent | React.TouchEvent,
      target: HTMLDivElement,
      drawingId: string,
    ) => {
      const container = target.parentElement
      if (!container) return

      const containerRect = container.getBoundingClientRect()
      const isTouch = 'touches' in e
      const inputType = isTouch ? 'touch' : 'mouse'
      const startX = isTouch
        ? (e as React.TouchEvent).touches[0].clientX
        : (e as React.MouseEvent).clientX
      const startY = isTouch
        ? (e as React.TouchEvent).touches[0].clientY
        : (e as React.MouseEvent).clientY
      const startLeft = target.offsetLeft
      const startTop = target.offsetTop
      let lastLeft = startLeft
      let lastTop = startTop

      // Get current rotation from transform
      const currentTransform = window.getComputedStyle(target).transform
      const matrix = new DOMMatrix(currentTransform)
      const currentRotation = Math.round(
        Math.atan2(matrix.b, matrix.a) * (180 / Math.PI),
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

        lastLeft = newLeft
        lastTop = newTop
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
          handleMove,
        )
        document.removeEventListener(
          isTouch ? 'touchend' : 'mouseup',
          handleEnd,
        )

        const deltaX = lastLeft - startLeft
        const deltaY = lastTop - startTop
        const distance = Math.hypot(deltaX, deltaY)

        if (distance >= 5) {
          onDragEnd?.({
            drawingId,
            inputType,
            startX: Math.round(startLeft),
            startY: Math.round(startTop),
            endX: Math.round(lastLeft),
            endY: Math.round(lastTop),
            deltaX: Math.round(deltaX),
            deltaY: Math.round(deltaY),
            distance: Math.round(distance),
          })
        }
      }

      document.addEventListener(
        isTouch ? 'touchmove' : 'mousemove',
        handleMove,
        { passive: false },
      )
      document.addEventListener(isTouch ? 'touchend' : 'mouseup', handleEnd)
    },
    [onDragEnd],
  )

  return handleDragStart
}

// Function to calculate initial positions for drawings
const calculateInitialPositions = (
  drawings: Drawing[],
  containerWidth: number,
  containerHeight: number,
  existingDrawings: Drawing[] = [],
) => {
  const drawingMaxSize = getDrawingMaxSize(containerWidth)
  const protectedControlBox = getProtectedControlBox(
    containerWidth,
    containerHeight,
  )
  const placedBoxes = existingDrawings
    .filter((drawing) => drawing.position)
    .map((drawing) =>
      getDrawingBox(
        drawing.position?.x || 0,
        drawing.position?.y || 0,
        drawingMaxSize,
      ),
    )

  return drawings.map((drawing) => {
    let bestPosition = getRandomPosition(containerWidth, containerHeight)
    let bestScore = Number.POSITIVE_INFINITY

    for (let i = 0; i < DRAWING_PLACEMENT_ATTEMPTS; i++) {
      const candidatePosition = getRandomPosition(containerWidth, containerHeight)
      const candidateBox = getDrawingBox(
        candidatePosition.x,
        candidatePosition.y,
        drawingMaxSize,
      )
      const score =
        scorePlacement(candidateBox, placedBoxes, protectedControlBox) +
        Math.random() * 100

      if (score < bestScore) {
        bestScore = score
        bestPosition = candidatePosition
      }
    }

    placedBoxes.push(
      getDrawingBox(bestPosition.x, bestPosition.y, drawingMaxSize),
    )

    return {
      ...drawing,
      position: {
        x: bestPosition.x,
        y: bestPosition.y,
        rotation: Math.random() * 10 - 5,
      },
    }
  })
}

export default function Gallery() {
  const posthog = usePostHog()
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  })
  const handleDrawingDragged = useCallback(
    (event: DrawingDragEvent) => {
      posthog.capture('gallery_drawing_dragged', {
        drawing_id: event.drawingId,
        input_type: event.inputType,
        start_x: event.startX,
        start_y: event.startY,
        end_x: event.endX,
        end_y: event.endY,
        delta_x: event.deltaX,
        delta_y: event.deltaY,
        distance: event.distance,
      })
    },
    [posthog],
  )
  const handleDragStart = useDraggable(handleDrawingDragged)
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

    setDrawings((prev) =>
      prev.map((d) => {
        if (!d.position) return d

        const drawingMaxSize = getDrawingMaxSize(containerSize.width)
        const maxX = containerSize.width - drawingMaxSize
        const maxY = containerSize.height - drawingMaxSize

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
      }),
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
            containerSize.height,
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
        containerSize.height,
      )
      setDrawings(drawingsWithPositions)
      hasPositionedDrawings.current = true
    }
  }, [
    drawings,
    containerSize.width,
    containerSize.height,
    isContainerReady,
  ])

  // Function to fetch only new drawings
  const fetchNewDrawings = useCallback(async () => {
    try {
      const data = await getApprovedDrawings(10)
      const newDrawings = data.filter(
        (d) => !existingDrawingIds.current.has(d.id),
      )

      if (newDrawings.length > 0) {
        newDrawings.forEach((d) => existingDrawingIds.current.add(d.id))
        const newDrawingWithPosition = calculateInitialPositions(
          [newDrawings[0]],
          containerSize.width,
          containerSize.height,
          drawings,
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
  }, [containerSize.width, containerSize.height, drawings])

  const handleDrawingSubmitted = () => {
    setIsDialogOpen(false)
    setTimeout(() => {
      fetchNewDrawings()
    }, 2000)
  }

  const handleOpenDrawingPopup = (
    triggerVariant: DrawingPopupTriggerVariant,
  ) => {
    posthog.capture('gallery_create_drawing_clicked', {
      trigger_variant: triggerVariant,
      drawings_count: drawings.length,
      has_new_drawing: Boolean(newDrawing),
    })
    setIsDialogOpen(true)
  }

  const drawingMaxSize = getDrawingMaxSize(containerSize.width)

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
    <div className="relative flex flex-col items-center h-full">
      <div className="flex gap-4 items-center justify-center h-full">
        <DrawYourOwnCard
          onClick={() => handleOpenDrawingPopup('wide_screen_card')}
          className="absolute top-1/2 -translate-y-1/2 z-10 hidden h-[150px] w-[200px] sm:block"
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
                maxWidth: `${drawingMaxSize}px`,
                maxHeight: `${drawingMaxSize}px`,
                opacity: drawing.position ? 1 : 0,
                transition: 'opacity 0.3s ease-in-out',
              }}
              onMouseDown={(e) =>
                handleDragStart(e, e.currentTarget, drawing.id)
              }
              onTouchStart={(e) =>
                handleDragStart(e, e.currentTarget, drawing.id)
              }>
              <div className="relative w-full h-full">
                <Image
                  key={`${drawing.id}-${drawingMaxSize}`}
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

                      if (aspectRatio > 1) {
                        container.style.width = `${drawingMaxSize}px`
                        container.style.height = `${
                          drawingMaxSize / aspectRatio
                        }px`
                      } else {
                        container.style.height = `${drawingMaxSize}px`
                        container.style.width = `${
                          drawingMaxSize * aspectRatio
                        }px`
                      }
                    }
                  }}
                />
                <div className="absolute bottom-1 right-1 text-xs text-gray-600 bg-white/70 px-1 rounded pointer-events-none">
                  By {drawing.author_name}
                </div>
                {drawing.message && (
                  <div className="absolute top-1 left-1 right-1 text-xs text-gray-600 bg-white/70 p-1 rounded max-h-16 overflow-y-auto pointer-events-none">
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
                maxWidth: `${drawingMaxSize}px`,
                maxHeight: `${drawingMaxSize}px`,
                opacity: 0,
                scale: 0.5,
              }}
              onMouseDown={(e: React.MouseEvent) =>
                handleDragStart(
                  e,
                  e.currentTarget as HTMLDivElement,
                  newDrawing.id,
                )
              }
              onTouchStart={(e: React.TouchEvent) =>
                handleDragStart(
                  e,
                  e.currentTarget as HTMLDivElement,
                  newDrawing.id,
                )
              }>
              <div className="relative w-full h-full">
                <Image
                  key={`${newDrawing.id}-${drawingMaxSize}`}
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

                      if (aspectRatio > 1) {
                        container.style.width = `${drawingMaxSize}px`
                        container.style.height = `${
                          drawingMaxSize / aspectRatio
                        }px`
                      } else {
                        container.style.height = `${drawingMaxSize}px`
                        container.style.width = `${
                          drawingMaxSize * aspectRatio
                        }px`
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

          <Button
            variant="link"
            className="absolute bottom-4 left-4 z-20 flex items-center gap-2 sm:hidden"
            onClick={() =>
              handleOpenDrawingPopup('bottom_left_mobile_button')
            }>
            <Pencil className="h-4 w-4" />
            Add your own
          </Button>

          <Link href="/gallery" className="absolute bottom-4 right-4 z-10">
            <Button variant="link" className="flex items-center gap-2">
              View all drawings
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}

      {drawings.length === 0 && !newDrawing && (
        <Button
          variant="link"
          className="absolute bottom-4 left-4 z-20 flex items-center gap-2 sm:hidden"
          onClick={() =>
            handleOpenDrawingPopup('bottom_left_mobile_button')
          }>
          <Pencil className="h-4 w-4" />
          Add your own
        </Button>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-[calc(100vw-1rem)] p-2 sm:w-full sm:p-6">
          <Drawing width={512} height={384} onClose={handleDrawingSubmitted} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
