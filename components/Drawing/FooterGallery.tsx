'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'

const Gallery = dynamic(() => import('./Gallery'), { ssr: false })

const FooterGallery = () => {
  const revealRef = useRef<HTMLDivElement>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [hasBeenRevealed, setHasBeenRevealed] = useState(false)

  useEffect(() => {
    const reveal = revealRef.current

    if (!reveal) return

    const observer = new IntersectionObserver(([entry]) => {
      setIsRevealed(entry.isIntersecting)

      if (entry.isIntersecting) {
        setHasBeenRevealed(true)
      }
    })

    observer.observe(reveal)

    return () => observer.disconnect()
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
