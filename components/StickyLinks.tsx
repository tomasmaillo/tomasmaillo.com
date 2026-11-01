'use client'

import { useEffect, useRef, useState } from 'react'
import Links from './Links'

export default function StickyLinks() {
  const marker = useRef<HTMLDivElement>(null)
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const update = () => setIsSticky((marker.current?.getBoundingClientRect().top ?? 8) < -8)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <>
      <div ref={marker} aria-hidden="true" className="-mb-16 h-0" />
      <div className="sticky top-2 z-50 mt-4 -mb-20 h-0 self-end">
        <div className={`absolute right-0 top-0 rounded-lg transition-[outline-color] outline outline-1 outline-transparent ${isSticky ? 'bg-card !outline-foreground/5' : ''}`}>
          <Links />
        </div>
      </div>
    </>
  )
}
