'use client'

import { useEffect, useState, useCallback } from 'react'
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
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [refreshNonce, setRefreshNonce] = useState(0)
  const { ref, inView } = useInView()

  const loadDrawings = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const newDrawings = await getApprovedDrawings(
        DRAWINGS_PER_PAGE,
        (page - 1) * DRAWINGS_PER_PAGE,
      )

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
    } finally {
      setIsLoading(false)
    }
  }, [page, isLoading])

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      setPage((prev) => prev + 1)
    }
  }, [inView, hasMore, isLoading])

  useEffect(() => {
    loadDrawings()
  }, [page, refreshNonce, loadDrawings])

  const handleDrawingSubmitted = () => {
    setIsDialogOpen(false)
    // Reset to first page so the new drawing can appear.
    setDrawings([])
    setHasMore(true)
    setPage(1)
    setRefreshNonce((n) => n + 1)
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="relative w-full aspect-[4/3] bg-background rounded-sm overflow-hidden">
          <DrawYourOwnCard
            onClick={() => setIsDialogOpen(true)}
            className="p-0"
          />
        </div>

        {drawings.length === 0 &&
          isLoading &&
          Array.from({ length: DRAWINGS_PER_PAGE }).map((_, idx) => (
            <SkeletonCard key={`skeleton-initial-${idx}`} />
          ))}
        {drawings.map((drawing) => (
          <div key={drawing.id} className="flex flex-col space-y-2">
            <div className="relative w-full aspect-[4/3] bg-background rounded-sm overflow-hidden shadow-md">
              <Image
                unoptimized
                src={drawing.image_url}
                alt="User drawing"
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
        ))}
      </div>

      {hasMore && (
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
          <Drawing width={512} height={384} onClose={handleDrawingSubmitted} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
