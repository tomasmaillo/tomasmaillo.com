import { ThemeProvider } from 'styled-components'
import { LIGHT_THEME, DARK_THEME } from './theme'
import { useState, useEffect } from 'react'

const DynamicThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState(LIGHT_THEME)

  useEffect(() => {
    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleColorSchemeChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches)
      setTheme(e.matches ? DARK_THEME : LIGHT_THEME)
    }

    darkQuery.addEventListener('change', handleColorSchemeChange)
    document.documentElement.classList.toggle('dark', darkQuery.matches)

    setTheme(darkQuery.matches ? DARK_THEME : LIGHT_THEME)

    return () => {
      darkQuery.removeEventListener('change', handleColorSchemeChange)
    }
  }, [])

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default DynamicThemeProvider
