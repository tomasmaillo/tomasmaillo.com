import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import EverythingIveEverBuilt from '../EverythingIveEverBuilt'

const SIDE_QUESTS = [
  {
    title: 'IC-Hack 23',
    date: new Date('2023-01-01'),
    description: (
      <>
        Ullamco laboris exercitation <a href="google.com">esse esse</a>. Ipsum
        est sunt mollit veniam sit enim enim reprehenderit. Qui id consequat ad
        ea ut duis cupidatat dolor.
      </>
    ),
  },
  {
    title: 'ZephyrFan 1.0',

    date: new Date('2024-03-24'),

    description: (
      <>
        Built an AI-powered fan with a team of 7. ZephyrFan uses a camera with
        object-detection and gesture-recognition to adjust the fan speed and
        modes. Comes with a super stylish companion app!
      </>
    ),
  },
  {
    title: 'Hack the Burgh',

    date: new Date('2023-01-01'),

    description: 'Winner of GitHub category.',
  },
  {
    title: 'Hack the Burgh',

    date: new Date('2023-01-01'),

    description: 'Winner of GitHub category.',
  },
].sort((a, b) => b.date.getTime() - a.date.getTime())

const StyledSideQuest = styled.div`
  border: 1px solid ${(props) => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: max(20%, 300px);
  min-width: 0;
  flex-shrink: 0;
  position: relative;
  border-radius: 10px;
  background-color: #ffffff;
  padding: 16px;
`

const SideQuest = ({
  title,
  date,
  description,
}: {
  title: string
  date: Date
  description: React.ReactNode
}) => {
  if (title && date && description) {
    return (
      <StyledSideQuest>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <p style={{ margin: 0, fontSize: '14px', color: '#aaa' }}>
          {date.toLocaleDateString('en-GB', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <p style={{ textAlign: 'left', marginBottom: 0 }}>{description}</p>
      </StyledSideQuest>
    )
  }
}

const StyledHorizontalGrid = styled.div`
  overflow-x: hidden;
  width: 100%;
  border-radius: 10px;
`

const SideQuestsList = () => {
  const ref = useRef<HTMLDivElement>(null) // Initialize ref with null
  const [totalContentWidth, setTotalContentWidth] = useState(0)

  useEffect(() => {
    // Ensure ref.current is not null
    const element = ref.current
    if (element) {
      const updateWidth = () => {
        setTotalContentWidth(element.scrollWidth - element.clientWidth)
      }

      updateWidth()
      // Optional: Adjust width calculation when window resizes
      window.addEventListener('resize', updateWidth)

      // Cleanup listener to prevent memory leaks
      return () => window.removeEventListener('resize', updateWidth)
    }
  }, []) // Empty dependency array ensures this effect runs only once after initial render

  return (
    <StyledHorizontalGrid>
      <motion.div
        drag="x"
        dragConstraints={{ left: -totalContentWidth, right: 0 }}
        dragElastic={0.2}
        whileTap={{ cursor: 'grabbing' }}
        whileHover={{ cursor: 'grab' }}
        style={{ display: 'flex', gap: '16px' }}
        ref={ref}>
        {SIDE_QUESTS.map((sideQuest, index) => (
          <SideQuest
            key={index}
            title={sideQuest.title}
            date={sideQuest.date}
            description={sideQuest.description}
          />
        ))}
          <EverythingIveEverBuilt />
        <div>
        </div>
      </motion.div>
    </StyledHorizontalGrid>
  )
}

export default SideQuestsList
