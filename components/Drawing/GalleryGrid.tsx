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
import Drawing from './Drawing'
import { LoaderPinwheel } from 'lucide-react'

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

export default function GalleryGrid() {
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { ref, inView } = useInView()

  const loadDrawings = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const newDrawings = await getApprovedDrawings(
        DRAWINGS_PER_PAGE,
        (page - 1) * DRAWINGS_PER_PAGE
      )

      if (newDrawings.length === 0 || newDrawings.length < DRAWINGS_PER_PAGE) {
        setHasMore(false)
      }

      // Filter out any duplicates by ID
      setDrawings((prev) => {
        const existingIds = new Set(prev.map((d) => d.id))
        const uniqueNewDrawings = newDrawings.filter(
          (d) => !existingIds.has(d.id)
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
  }, [page])

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {drawings.map((drawing) => (
          <div key={drawing.id} className="flex flex-col space-y-2">
            <div className="relative w-full aspect-[4/3] bg-background rounded-sm overflow-hidden shadow-md">
              <Image
                unoptimized
                src={drawing.image_url}
                alt="User drawing"
                fill
                className="object-contain"
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
        <div ref={ref} className="h-20 flex items-center justify-center">
          <div className="animate-pulse text-muted">
            <LoaderPinwheel className="w-4 h-4 mr-2 animate-spin" />
          </div>
        </div>
      )}
    </div>
  )
}
