'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

const IndexModel = dynamic(() => import('./IndexModel'), {
  ssr: false,
  loading: () => <ModelPlaceholder label="Loading 3D model..." />,
})

function ModelPlaceholder({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
      {label}
    </div>
  )
}

export default function LazyIndexModel() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const { ref, inView } = useInView({
    rootMargin: '300px 0px',
    triggerOnce: false,
  })
  const [hasEnteredView, setHasEnteredView] = useState(false)

  useEffect(() => {
    if (inView) setHasEnteredView(true)
  }, [inView])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)

    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  return (
    <figure className="my-8">
      <div
        ref={ref}
        className="h-[24rem] overflow-hidden bg-[radial-gradient(circle_at_50%_45%,hsl(var(--accent)/0.14),transparent_99%)] md:rounded-2xl shadow-[inset_0_9px_38px_0_hsl(var(--card)),inset_0_-12px_46px_0_white] bg-card"
        aria-label="Interactive 3D model of the Index 01 ring">
        {hasEnteredView ? (
          <IndexModel
            isVisible={inView}
            prefersReducedMotion={prefersReducedMotion}
          />
        ) : (
          <ModelPlaceholder label="Interactive 3D model" />
        )}
      </div>
      <figcaption className="mt-2 text-center text-xs text-muted-foreground">
        Drag to explore.
      </figcaption>
    </figure>
  )
}
