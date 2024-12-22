'use client'

import { useEffect, useState } from 'react'
import Snowfall from 'react-snowfall'

const Fall = () => {
  const [isLightTheme, setIsLightTheme] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const currentMonth = new Date().getMonth()
  const isWinterMonth = currentMonth === 11 || currentMonth === 0 // December or January

  useEffect(() => {
    setPrefersReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
    
    const updateTheme = () => {
      setIsLightTheme(
        document.documentElement.getAttribute('data-theme') === 'light'
      )
    }

    updateTheme()

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-theme') {
          updateTheme()
        }
      })
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  if (prefersReducedMotion || !isWinterMonth) {
    return null
  }

  return (
    <Snowfall
      color={isLightTheme ? '#DEE4FD' : '#fff'}
      snowflakeCount={100}
      speed={[0.5, 1.5]}
      wind={[-0.5, 0.5]}
    />
  )
}

export default Fall
