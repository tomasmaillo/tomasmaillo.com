'use client'

import { useEffect } from 'react'

export default function ReducedMotionMedia() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let observer: MutationObserver | undefined

    const pauseAutoplayVideos = () => {
      document
        .querySelectorAll<HTMLVideoElement>('video[autoplay]')
        .forEach((video) => video.pause())
    }

    const applyPreference = () => {
      observer?.disconnect()
      observer = undefined

      if (!reducedMotion.matches) return

      pauseAutoplayVideos()
      observer = new MutationObserver(pauseAutoplayVideos)
      observer.observe(document.body, { childList: true, subtree: true })
    }

    applyPreference()
    reducedMotion.addEventListener('change', applyPreference)

    return () => {
      observer?.disconnect()
      reducedMotion.removeEventListener('change', applyPreference)
    }
  }, [])

  return null
}
