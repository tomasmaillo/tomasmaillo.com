'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const Gallery = dynamic(() => import('./Gallery'), { ssr: false })
const GALLERY_LOAD_AHEAD_PX = 384

const FooterGallery = () => {
  const revealRef = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [hasBeenRevealed, setHasBeenRevealed] = useState(false)

  useEffect(() => {
    const reveal = revealRef.current

    if (!reveal) return

    const visibilityObserver = new IntersectionObserver(([entry]) => {
      setIsRevealed(entry.isIntersecting)
    })
    let hasScrolled = window.scrollY > 0

    const loadGallery = () => setHasBeenRevealed(true)
    const isNearViewport = () => {
      const { top, bottom } = reveal.getBoundingClientRect()

      return (
        top <= window.innerHeight + GALLERY_LOAD_AHEAD_PX &&
        bottom >= -GALLERY_LOAD_AHEAD_PX
      )
    }
    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasScrolled) loadGallery()
      },
      { rootMargin: `${GALLERY_LOAD_AHEAD_PX}px 0px` },
    )
    const handleScroll = () => {
      hasScrolled = true

      if (isNearViewport()) loadGallery()
    }

    visibilityObserver.observe(reveal)
    loadObserver.observe(reveal)
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      visibilityObserver.disconnect()
      loadObserver.disconnect()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      <div
        aria-hidden="true"
        className="fixed bottom-0 left-0 z-0 h-[32rem] w-full bg-accent"
      />
      <footer
        aria-label="Visitor drawings"
        className="fixed bottom-0 left-0 z-0 h-96 w-full"
        hidden={!isRevealed}>
        {hasBeenRevealed && <Gallery />}
      </footer>
      <div ref={revealRef} aria-hidden="true" className="h-96" />
    </>
  )
}

export default FooterGallery
