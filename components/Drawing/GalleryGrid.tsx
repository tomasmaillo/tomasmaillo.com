'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { getApprovedDrawings } from '@/lib/supabase'
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns'
import { useInView } from 'react-intersection-observer'
import DrawYourOwnCard from './DrawYourOwnCard'
import Drawing from './Drawing'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { usePostHog } from '@posthog/react'
import {
  NEW_DRAWING_EVENT,
  NEW_DRAWING_HIGHLIGHT_DURATION_MS,
  NEW_DRAWING_REFRESH_DELAY_MS,
  NEW_DRAWING_STORAGE_KEY,
} from './new-drawing'

interface Drawing {
  id: string
  image_url: string
  created_at: string
  author_name: string
  message: string
}

const DRAWINGS_PER_PAGE = 12

function formatTimeAgo(date: Date) {
  const now = new Date()
  const days = differenceInDays(now, date)
  const hours = differenceInHours(now, date)
  const minutes = differenceInMinutes(now, date)

  if (days > 0) return `${days}d`
  if (hours > 0) return `${hours}h`
  if (minutes > 0) return `${minutes}m`
  return 'now'
}

function SkeletonCard({ showMessage = true }: { showMessage?: boolean }) {
  return (
    <div className="flex flex-col space-y-2 animate-pulse">
      <div className="relative w-full aspect-[4/3] bg-muted/60 rounded-sm overflow-hidden shadow-md">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/40 via-muted/70 to-muted/40" />
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-3">
          <div className="h-4 w-24 sm:w-28 rounded bg-muted/70" />
          <div className="h-3 w-10 rounded bg-muted/60" />
        </div>
        {showMessage && (
          <div className="space-y-1">
            <div className="h-3 w-full rounded bg-muted/50" />
            <div className="h-3 w-4/5 rounded bg-muted/50" />
          </div>
        )}
      </div>
    </div>
  )
}

export default function GalleryGrid() {
  const posthog = usePostHog()
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [highlightedDrawingId, setHighlightedDrawingId] = useState<
    string | null
  >(null)
  const requestedPagesRef = useRef(new Set<number>())
  const wasLoadMoreInViewRef = useRef(false)
  const refreshTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )
  const { ref, inView } = useInView()

  const loadDrawings = useCallback(async () => {
    if (requestedPagesRef.current.has(page)) return

    requestedPagesRef.current.add(page)

    setIsLoading(true)
    try {
      const newDrawings = await getApprovedDrawings(
        DRAWINGS_PER_PAGE,
        (page - 1) * DRAWINGS_PER_PAGE,
      )

      setLoadError('')

      if (newDrawings.length === 0 || newDrawings.length < DRAWINGS_PER_PAGE) {
        setHasMore(false)
      }

      // Filter out any duplicates by ID
      setDrawings((prev) => {
        const existingIds = new Set(prev.map((d) => d.id))
        const uniqueNewDrawings = newDrawings.filter(
          (d) => !existingIds.has(d.id),
        )
        return [...prev, ...uniqueNewDrawings]
      })
    } catch (error) {
      console.error('Error loading drawings:', error)
      setHasMore(false)
      setLoadError('The gallery could not be loaded. Refresh to try again.')
    } finally {
      setIsLoading(false)
    }
  }, [page])

  useEffect(() => {
    const enteredView = inView && !wasLoadMoreInViewRef.current
    wasLoadMoreInViewRef.current = inView

    if (enteredView && hasMore && !isLoading) {
      setPage((prev) => prev + 1)
    }
  }, [inView, hasMore, isLoading])

  useEffect(() => {
    loadDrawings()
  }, [page, loadDrawings])

  const refreshForNewDrawing = useCallback(async (drawingId: string) => {
    setIsLoading(true)

    try {
      const latestDrawings = await getApprovedDrawings(DRAWINGS_PER_PAGE, 0)

      setDrawings(latestDrawings)
      setPage(1)
      setHasMore(latestDrawings.length === DRAWINGS_PER_PAGE)
      setLoadError('')
      requestedPagesRef.current = new Set([1])
      wasLoadMoreInViewRef.current = false

      if (latestDrawings.some((drawing) => drawing.id === drawingId)) {
        setHighlightedDrawingId(drawingId)

        if (highlightTimeoutRef.current) {
          clearTimeout(highlightTimeoutRef.current)
        }

        highlightTimeoutRef.current = setTimeout(() => {
          setHighlightedDrawingId(null)
        }, NEW_DRAWING_HIGHLIGHT_DURATION_MS)
      }
    } catch (error) {
      console.error('Error refreshing drawings:', error)
      setLoadError('Your drawing was added, but the gallery could not refresh.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const queueNewDrawingRefresh = useCallback(
    (drawingId: string) => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current)
      }

      refreshTimeoutRef.current = setTimeout(() => {
        refreshForNewDrawing(drawingId)
      }, NEW_DRAWING_REFRESH_DELAY_MS)
    },
    [refreshForNewDrawing],
  )

  useEffect(() => {
    const storedDrawingId = sessionStorage.getItem(NEW_DRAWING_STORAGE_KEY)

    if (storedDrawingId) {
      sessionStorage.removeItem(NEW_DRAWING_STORAGE_KEY)
      queueNewDrawingRefresh(storedDrawingId)
    }

    const handleNewDrawing = (event: Event) => {
      const drawingId = (event as CustomEvent<string>).detail
      if (drawingId) queueNewDrawingRefresh(drawingId)
    }

    window.addEventListener(NEW_DRAWING_EVENT, handleNewDrawing)

    return () => {
      window.removeEventListener(NEW_DRAWING_EVENT, handleNewDrawing)
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current)
      if (highlightTimeoutRef.current) clearTimeout(highlightTimeoutRef.current)
    }
  }, [queueNewDrawingRefresh])

  const handleDrawingApproved = (drawingId: string) => {
    setIsDialogOpen(false)
    queueNewDrawingRefresh(drawingId)
  }

  const handleCreateDrawingClick = () => {
    posthog.capture('gallery_grid_create_drawing_clicked')
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-8">
      <p aria-live="polite" className="sr-only">
        {highlightedDrawingId ? 'Your drawing is now in the gallery.' : ''}
      </p>

      {loadError && (
        <div
          role="alert"
          className="rounded-sm border-2 border-red-600 bg-red-50 px-4 py-3 text-sm text-red-950 dark:bg-red-950/30 dark:text-red-100">
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="relative w-full aspect-[4/3] bg-background rounded-sm overflow-hidden">
          <DrawYourOwnCard
            onClick={handleCreateDrawingClick}
            className="p-0"
          />
        </div>

        {drawings.length === 0 &&
          isLoading &&
          Array.from({ length: DRAWINGS_PER_PAGE }).map((_, idx) => (
            <SkeletonCard key={`skeleton-initial-${idx}`} />
          ))}
        {drawings.map((drawing) => {
          const isNewDrawing = drawing.id === highlightedDrawingId

          return (
            <div
              key={drawing.id}
              className={`flex flex-col space-y-2 ${
                isNewDrawing ? 'animate-new-drawing-card' : ''
              }`}>
              <div
                className={`relative w-full aspect-[4/3] bg-background rounded-sm overflow-hidden shadow-md ${
                isNewDrawing ? 'animate-new-drawing-frame' : ''
              }`}>
                <Image
                  unoptimized
                  src={drawing.image_url}
                  alt={`Drawing by ${drawing.author_name || 'an anonymous visitor'}`}
                  fill
                  draggable={false}
                  className="object-contain pointer-events-none"
                />
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{drawing.author_name}</span>
                  <span
                    className="text-xs text-muted-foreground"
                    title={new Date(drawing.created_at).toLocaleString()}>
                    {formatTimeAgo(new Date(drawing.created_at))}
                  </span>
                </div>
                {drawing.message && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {drawing.message}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {hasMore && drawings.length > 0 && (
        <div ref={ref} className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {isLoading &&
            drawings.length > 0 &&
            Array.from({ length: 6 }).map((_, idx) => (
              <SkeletonCard key={`skeleton-more-${idx}`} showMessage={false} />
            ))}
          {!isLoading && <div className="h-6" />}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <Drawing
            width={512}
            height={384}
            onApproved={handleDrawingApproved}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
