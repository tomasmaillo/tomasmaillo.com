'use client'

import { useEffect, useState } from 'react'
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
}

export default function Gallery() {
  const [drawings, setDrawings] = useState<Drawing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    async function fetchDrawings() {
      try {
        const data = await getApprovedDrawings(10)
        setDrawings(data)
      } catch (err) {
        setError('Failed to load drawings')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDrawings()
  }, [])

  const handleDrawingSubmitted = () => {
    setIsDialogOpen(false)
    // Refresh the gallery after a short delay to allow for moderation
    setTimeout(() => {
      window.location.reload()
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
            <Button variant="link">Log your visit</Button>
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

      {drawings.length === 0 ? (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-muted">
            No drawings yet. Be the first to create one!
          </p>
        </div>
      ) : (
        <div className="relative h-full w-full overflow-hindden">
          {drawings.map((drawing, index) => (
            <div
              key={drawing.id}
              className="absolute cursor-grab active:cursor-grabbing transition-colors shadow-md active:shadow-lg"
              style={{
                left: `${Math.random() * 60}%`,
                top: `${Math.random() * 60}%`,
                transform: `rotate(${(Math.random() * 10 - 5).toFixed(2)}deg)`,
                zIndex: index,
                touchAction: 'none',
                width: 'auto',
                height: 'auto',
                maxWidth: '200px',
                maxHeight: '200px',
              }}
              onMouseDown={(e) => {
                const target = e.currentTarget as HTMLDivElement
                const container = target.parentElement
                if (!container) return

                const containerRect = container.getBoundingClientRect()
                const startX = e.clientX
                const startY = e.clientY
                const startLeft = target.offsetLeft
                const startTop = target.offsetTop

                // Set dragging styles
                target.style.zIndex = '1000'
                target.style.cursor = 'grabbing'
                target.style.transition = 'none'
                target.style.transform = 'scale(1.05)'

                const handleMouseMove = (e: MouseEvent) => {
                  const deltaX = e.clientX - startX
                  const deltaY = e.clientY - startY

                  let newLeft = startLeft + deltaX
                  let newTop = startTop + deltaY

                  // Apply boundaries
                  const maxX = containerRect.width - target.offsetWidth
                  const maxY = containerRect.height - target.offsetHeight

                  newLeft = Math.max(0, Math.min(newLeft, maxX))
                  newTop = Math.max(0, Math.min(newTop, maxY))

                  target.style.left = `${newLeft}px`
                  target.style.top = `${newTop}px`
                }

                const handleMouseUp = () => {
                  target.style.cursor = 'grab'
                  target.style.zIndex = '1000'
                  target.style.transition = 'transform 0.2s ease-out'
                  target.style.transform = 'scale(1)'

                  // Clean up
                  document.removeEventListener('mousemove', handleMouseMove)
                  document.removeEventListener('mouseup', handleMouseUp)
                }

                document.addEventListener('mousemove', handleMouseMove)
                document.addEventListener('mouseup', handleMouseUp)
              }}
              onTouchStart={(e) => {
                const target = e.currentTarget as HTMLDivElement
                const container = target.parentElement
                if (!container) return

                const containerRect = container.getBoundingClientRect()
                const touch = e.touches[0]
                const startX = touch.clientX
                const startY = touch.clientY
                const startLeft = target.offsetLeft
                const startTop = target.offsetTop

                // Set dragging styles
                target.style.zIndex = '1000'
                target.style.transition = 'none'
                target.style.transform = 'scale(1.05)'

                const handleTouchMove = (e: TouchEvent) => {
                  e.preventDefault() // Prevent scrolling while dragging
                  const touch = e.touches[0]
                  const deltaX = touch.clientX - startX
                  const deltaY = touch.clientY - startY

                  let newLeft = startLeft + deltaX
                  let newTop = startTop + deltaY

                  // Apply boundaries
                  const maxX = containerRect.width - target.offsetWidth
                  const maxY = containerRect.height - target.offsetHeight

                  newLeft = Math.max(0, Math.min(newLeft, maxX))
                  newTop = Math.max(0, Math.min(newTop, maxY))

                  target.style.left = `${newLeft}px`
                  target.style.top = `${newTop}px`
                }

                const handleTouchEnd = () => {
                  target.style.zIndex = '1000'
                  target.style.transition = 'transform 0.2s ease-out'
                  target.style.transform = 'scale(1)'

                  // Clean up
                  document.removeEventListener('touchmove', handleTouchMove)
                  document.removeEventListener('touchend', handleTouchEnd)
                }

                document.addEventListener('touchmove', handleTouchMove, {
                  passive: false,
                })
                document.addEventListener('touchend', handleTouchEnd)
              }}>
              <div className="relative w-full h-full">
                <Image
                  src={drawing.image_url}
                  alt="User drawing"
                  fill
                  className="object-contain rounded-sm"
                  draggable={false}
                  onLoad={(e) => {
                    // Adjust container size based on image dimensions
                    const img = e.target as HTMLImageElement
                    const container = img.parentElement
                      ?.parentElement as HTMLDivElement
                    if (container) {
                      const aspectRatio = img.naturalWidth / img.naturalHeight
                      const maxSize = 200 // Maximum size in pixels

                      if (aspectRatio > 1) {
                        // Landscape image
                        container.style.width = `${maxSize}px`
                        container.style.height = `${maxSize / aspectRatio}px`
                      } else {
                        // Portrait or square image
                        container.style.height = `${maxSize}px`
                        container.style.width = `${maxSize * aspectRatio}px`
                      }
                    }
                  }}
                />
                {/* Author signature overlay */}
                <div className="absolute bottom-1 right-1 text-xs text-gray-600 bg-white/70 px-1 rounded">
                  By {drawing.author_name}
                </div>
                {/* Message overlay (if exists) */}
                {drawing.message && (
                  <div className="absolute top-1 left-1 right-1 text-xs text-gray-600 bg-white/70 p-1 rounded max-h-16 overflow-y-auto">
                    {drawing.message}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
