'use client'

import { type ReactNode, useCallback, useLayoutEffect, useRef, useState } from 'react'

type NowMediaScrollerProps = {
  children: ReactNode
}

export default function NowMediaScroller({ children }: NowMediaScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const updateEdges = useCallback(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    const remaining = scroller.scrollWidth - scroller.clientWidth - scroller.scrollLeft
    setCanScrollLeft(scroller.scrollLeft > 1)
    setCanScrollRight(remaining > 1)
  }, [])

  useLayoutEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller) return

    updateEdges()
    const observer = new ResizeObserver(updateEdges)
    observer.observe(scroller)

    return () => observer.disconnect()
  }, [updateEdges])

  return (
    <div className="relative w-full">
      <div
        ref={scrollerRef}
        onScroll={updateEdges}
        className="flex w-full gap-3 overflow-x-auto pb-2">
        {children}
      </div>
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--now-paper)] to-transparent transition-opacity duration-300 ease-out ${canScrollLeft ? 'opacity-50' : 'opacity-0'}`}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--now-paper)] to-transparent transition-opacity duration-300 ease-out ${canScrollRight ? 'opacity-50' : 'opacity-0'}`}
      />
    </div>
  )
}
