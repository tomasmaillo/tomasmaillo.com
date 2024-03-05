import styled from 'styled-components'
import { motion } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

// {
//   title: <>IC-Hack 23</>,

//   description: {
//     title: 'IC-Hack 23',
//     role: 'Hacker',
//     date: 'Mar 2023',
//     text: (
//       <>
//         Runner-up to Marshall Wace prize. Built AI transcription platform to
//         generate real-time educational quizes{' '}
//       </>
//     ),
//   },
//   topic: 'Hackathon',
// },

// {
//   title: <>Hack the Burgh</>,

//   description: {
//     title: 'Hack the Burgh 23',
//     role: 'Hacker',
//     date: 'Feb 2023',
//     text: <>Winner of GitHub category. </>,
//   },
//   topic: 'Hackathon',
// },

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

const SideQuest = () => {
  return (
    <StyledSideQuest>
      <h2 style={{ margin: 0 }}>Hack Side Quest</h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec Lorem
        ipsum dolor sit amet, consectetur adipiscing elit. Donec Lorem ipsum
        dolor sit amet, consectetur adipiscing elit. Donec
      </p>
    </StyledSideQuest>
  )
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
        <SideQuest />
        <SideQuest />
        <SideQuest />
        <SideQuest />
        <SideQuest />
        <SideQuest />
        <SideQuest />
        <SideQuest />
      </motion.div>
    </StyledHorizontalGrid>
  )
}

export default SideQuestsList
