import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import styled from 'styled-components'

const StyledScrollOffset = styled(motion.div)`
  position: sticky;
  top: 0;
  box-sizing: content-box;
`

const ScrollOffset: React.FC<ScrollOffsetProps> = ({ children }) => {
  const { scrollY } = useScroll()

  const selectedVerticalOffset = useTransform(
    scrollY,
    [
      0,
      Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      ),
    ],
    [0, window.innerHeight * 10],
    {
      clamp: false,
    }
  )

  const smoothSelectedVerticalOffset = useSpring(selectedVerticalOffset, {
    damping: 50,
    stiffness: 400,
  })

  const y = useTransform(
    smoothSelectedVerticalOffset,
    (value) => -value / 50 + 25
  )

  return (
    <div
      style={{
        zIndex: 100,
        borderRadius: '10px',
        backgroundColor: '#ffffff',
        padding: '2px',
        backdropFilter: 'blur(3px)',
        border: '1px solid #ECECEC',
      }}>
      <StyledScrollOffset style={{ y }}>{children}</StyledScrollOffset>
    </div>
  )
}

interface ScrollOffsetProps {
  children: React.ReactNode
}

export default ScrollOffset
