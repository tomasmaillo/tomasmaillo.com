import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

const VisitorCounterWrapper = styled.div`
  position: absolute;
  bottom: 16px;
  right: 20px;
  font-size: 0.8rem;
  user-select: none;
  color: ${(props) => props.theme.colors.secondary};
`

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState<number | null>(null)

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch('https://web.tomasmaillo.com/visit')
        const data = await response.json()
        setVisitorCount(data.visitCount)
      } catch (error) {
        console.error('Failed to fetch visitor count', error)
      }
    }

    fetchVisitorCount()
  }, [])

  return (
    <VisitorCounterWrapper>
      {visitorCount && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
          }}>
          {visitorCount.toLocaleString()}
          <span style={{ verticalAlign: 'super', fontSize: '0.6rem' }}>
            th
          </span>{' '}
          visitor
        </motion.span>
      )}
    </VisitorCounterWrapper>
  )
}

export default VisitorCounter
