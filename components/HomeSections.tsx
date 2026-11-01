'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

export default function HomeSections({
  experience,
  blog,
}: {
  experience: ReactNode
  blog: ReactNode
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const scrollFrame = useRef(0)
  const [isSticky, setIsSticky] = useState(false)

  useEffect(() => {
    const update = () => setIsSticky((sectionRef.current?.getBoundingClientRect().top ?? 8) < 8)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => () => cancelAnimationFrame(scrollFrame.current), [])

  const scrollToStart = (onComplete: () => void) => {
    cancelAnimationFrame(scrollFrame.current)
    const top = sectionRef.current?.getBoundingClientRect().top
    if (top === undefined || top >= 0) {
      onComplete()
      return
    }
    const start = window.scrollY
    const target = start + top
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      window.scrollTo(0, target)
      onComplete()
      return
    }

    const started = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - started) / 400, 1)
      window.scrollTo(0, start + (target - start) * (1 - (1 - progress) ** 3))
      if (progress < 1) scrollFrame.current = requestAnimationFrame(animate)
      else onComplete()
    }
    scrollFrame.current = requestAnimationFrame(animate)
  }
  const [section, setSection] = useState<'experience' | 'blog'>('experience')
  const [hasSwitched, setHasSwitched] = useState(false)

  return (
    <div ref={sectionRef}>
      <div aria-label="Choose a section" className={`sticky top-2 z-40 mb-8 grid w-fit grid-cols-[auto_auto] sm:grid-cols-2 rounded-lg bg-card p-1 transition-[outline-color] outline outline-1 outline-transparent ${isSticky ? '!outline-foreground/5' : ''}`}>
        {(['experience', 'blog'] as const).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={section === item}
            onClick={() => {
              if (item === section) {
                cancelAnimationFrame(scrollFrame.current)
                return
              }
              scrollToStart(() => {
                setHasSwitched(true)
                setSection(item)
              })
            }}
            className={`rounded-md px-3 py-1.5 text-sm capitalize sm:px-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              section === item ? 'bg-background text-foreground shadow-sm' : 'text-muted hover:text-foreground'
            }`}>
            {item}
          </button>
        ))}
      </div>
      <div key={section} className={hasSwitched ? 'motion-safe:animate-section-reveal' : undefined}>
        {section === 'experience' ? experience : blog}
      </div>
    </div>
  )
}
