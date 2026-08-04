'use client'

import { useEffect, useRef } from 'react'

const PLAYBACK_RATE = 2

export default function ShortcutVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current

    if (!video) return

    video.defaultPlaybackRate = PLAYBACK_RATE
    video.playbackRate = PLAYBACK_RATE
  }, [])

  return (
    <div className="my-8 w-full rounded-lg bg-card px-8 pt-8">
      <video
        ref={videoRef}
        src="/mochi-flashcards-shortcut.webm"
        aria-label="Using the iPhone Shortcut to create a flashcard"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="mx-auto block w-full max-w-[18rem]"
      />
    </div>
  )
}
