import { createContext, useContext, useState } from 'react'

// Create a context
const AboutContext = createContext({
  shown: false,
  openAbout: () => {},
  closeAbout: () => {},
})

// Create a provider component
export const AboutProvider = ({ children }: { children: React.ReactNode }) => {
  const [shown, setShown] = useState(false)

  const openAbout = () => setShown(true)
  const closeAbout = () => setShown(false)

  return (
    <AboutContext.Provider value={{ shown, openAbout, closeAbout }}>
      {children}
    </AboutContext.Provider>
  )
}

// Custom hook to use the About context
export const useAbout = () => useContext(AboutContext)
