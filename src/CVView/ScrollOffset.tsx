import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import styled from 'styled-components'

const StyledScrollOffset = styled(motion.div)`
  border-radius: 10px;
  overflow: hidden;
  padding: 2px;
  position: sticky;
  background-color: ${({ theme }) => theme.colors.card};
  border: 1px solid ${({ theme }) => theme.colors.border};
  top: 96px;
  height: calc(100vh - 96px);
`

const ScrollOffset: React.FC<ScrollOffsetProps> = ({
  fixedFooter,
  children,
}) => {
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

  const y = useTransform(smoothSelectedVerticalOffset, (value) => -value / 50)

  return (
    <StyledScrollOffset>
      <motion.div
        style={{
          y,
        }}>
        {children}
      </motion.div>
      {fixedFooter}
    </StyledScrollOffset>
  )
}

interface ScrollOffsetProps {
  fixedFooter: React.ReactNode
  children: React.ReactNode
}

export default ScrollOffset
