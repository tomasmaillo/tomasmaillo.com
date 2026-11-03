'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

type HomeSection = 'experience' | 'blog'

const HomeSectionContext = createContext<{
  section: HomeSection
  setSection: (section: HomeSection) => void
} | null>(null)

export function HomeSectionProvider({ children }: { children: ReactNode }) {
  const [section, setSection] = useState<HomeSection>('experience')

  return (
    <HomeSectionContext.Provider value={{ section, setSection }}>
      {children}
    </HomeSectionContext.Provider>
  )
}

export function useHomeSection() {
  const context = useContext(HomeSectionContext)
  if (!context) {
    throw new Error('useHomeSection must be used within HomeSectionProvider')
  }
  return context
}
