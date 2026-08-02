'use client'

import { useState, useLayoutEffect } from 'react'

interface FadeInProps {
  delay?: number
  children: React.ReactNode
}

const FadeIn = ({ delay = 0, children }: FadeInProps) => {
  const [showAnimation, setShowAnimation] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)

  useLayoutEffect(() => {
    const navEntry = performance?.getEntriesByType('navigation')?.[0] as any
    setIsNavigating(navEntry?.type !== 'navigate')

    const timer = setTimeout(() => {
      setShowAnimation(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [delay])

  if (isNavigating) {
    return <div>{children}</div>
  }

  return (
    <>
      <noscript>
        <style>{`[data-fade-in] { opacity: 1 !important; filter: none !important; transform: none !important; }`}</style>
      </noscript>
      <div
        data-fade-in
        className={`transition-all duration-500 motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:blur-none motion-reduce:translate-y-0 ${
          showAnimation
            ? 'opacity-100 blur-none translate-y-0'
            : 'opacity-0 blur-[5px] translate-y-2'
        }`}>
        {children}
      </div>
    </>
  )
}

export default FadeIn
