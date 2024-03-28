import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import styled from 'styled-components'

const LoadAnimation = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  transition: {
    duration: 0.5,
  },
}

const StyledWrapper = styled.p`
  font-size: 0.8rem;
  padding: 0px 20px;
  margin: 0;
  color: ${(props) => props.theme.colors.primaryInverse};
  font-variant-numeric: tabular-nums;
`

const StyledLocationLink = styled.a`
  color: ${(props) => props.theme.colors.primaryInverse};
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

const LocationAndTime = () => {
  const [dateTime, setDateTime] = useState<String | null>(null)
  const [location, setLocation] = useState<{
    city: String
    region: String
  } | null>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime(new Date().toLocaleTimeString())
    }, 1000)
    setDateTime(new Date().toLocaleTimeString())
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchRegion = async () => {
      try {
        const response = await fetch('https://web.tomasmaillo.com/location')
        const data = await response.json()
        if (!data.city || !data.region) return
        setLocation({ city: data.city, region: data.region })
      } catch (error) {
        console.error('Failed to fetch region', error)
      }
    }

    fetchRegion()
  }, [])

  return (
    <StyledWrapper>
      {location && (
        <motion.span {...LoadAnimation}>
          <StyledLocationLink
            target="_blank"
            href={`https://www.google.com/maps/search/${location?.city}+${location?.region}`}>
            {location?.city}, {location?.region}
          </StyledLocationLink>
          <span style={{ userSelect: 'none' }}>{' • '}</span>
        </motion.span>
      )}

      {dateTime && <motion.span {...LoadAnimation}>{dateTime}</motion.span>}
    </StyledWrapper>
  )
}

export default LocationAndTime
