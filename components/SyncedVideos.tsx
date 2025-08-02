'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface SyncedVideosProps {
  mainVideoSrc: string
  syncedVideoSrc: string
  mainVideoClassName?: string
  syncedVideoClassName?: string
}

export default function SyncedVideos({
  mainVideoSrc,
  syncedVideoSrc,
  mainVideoClassName,
  syncedVideoClassName,
}: SyncedVideosProps) {
  const mainVideoRef = useRef<HTMLVideoElement>(null)
  const syncedVideoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const mainVideo = mainVideoRef.current
    const syncedVideo = syncedVideoRef.current

    if (!mainVideo || !syncedVideo) return

    const syncVideos = () => {
      if (Math.abs(mainVideo.currentTime - syncedVideo.currentTime) > 0.1) {
        syncedVideo.currentTime = mainVideo.currentTime
      }
    }

    // Sync on timeupdate (fires several times per second during playback)
    mainVideo.addEventListener('timeupdate', syncVideos)

    // Sync when main video plays
    mainVideo.addEventListener('play', () => {
      syncedVideo.play()
    })

    // Sync when main video pauses
    mainVideo.addEventListener('pause', () => {
      syncedVideo.pause()
    })

    // Sync when main video seeks
    mainVideo.addEventListener('seeking', () => {
      syncedVideo.currentTime = mainVideo.currentTime
    })

    return () => {
      mainVideo.removeEventListener('timeupdate', syncVideos)
    }
  }, [])

  return (
    <div className="flex flex-row">
      <video
        ref={mainVideoRef}
        src={mainVideoSrc}
        className={cn(
          'w-1/3 m-auto h-full object-cover rounded-sm',
          mainVideoClassName
        )}
        controls={false}
        autoPlay
        muted
        loop
        playsInline
      />
      <video
        ref={syncedVideoRef}
        src={syncedVideoSrc}
        className={cn('w-2/3 h-full object-cover', syncedVideoClassName)}
        controls={false}
        autoPlay
        muted
        loop
        playsInline
      />
    </div>
  )
}
