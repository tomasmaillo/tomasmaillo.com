import { motion } from 'framer-motion'
import styled from 'styled-components'
import VisitorCounter from './VisitorCounter'

const HeaderWrapper = styled.div`
  height: 100%;
  flex-direction: column;
  border-radius: 10px;
  gap: 14px;
  background-color: ${(props) => props.theme.colors.card};
  border: 1px solid ${(props) => props.theme.colors.border};
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;
`
type AnimatedTextProps = {
  text: string
  delay?: number
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, delay = 0 }) => {
  const words = text.split(' ')

  const animationScale = 1.8

  return (
    <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
      {words.map((word, i) => (
        <span>
          {word.split('').map((char, j) => {
            const animDelay = Math.random() * 0.5 + delay + j * 0.04 + i * 0.12
            const blur = Math.random() * 5 * animationScale
            const skew = (Math.random() * 20 - 10) * animationScale
            const y = (Math.random() * 20 - 10) * animationScale
            const x = (Math.random() * 10 - 5) * animationScale

            return (
              <motion.span
                key={`${i}-${j}`}
                style={{ display: 'inline-block' }}
                initial={{
                  opacity: 0,
                  y,
                  x,
                  filter: `blur(${blur}px)`,
                  skew: `${skew}deg`,
                  rotate: `${skew}deg`,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  x: 0,
                  filter: 'blur(0px)',
                  skew: '0deg',
                  rotate: '0deg',
                }}
                transition={{
                  delay: animDelay,
                  type: 'spring',
                  stiffness: 100,
                  mass: 0.5,
                }}>
                {char}
              </motion.span>
            )
          })}
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </div>
  )
}

const Header = () => {
  return (
    <div
      style={{
        width: '100%',
        height: 'min(78svh, 900px)',
        position: 'relative',
      }}>
      <HeaderWrapper>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            textAlign: 'left',
            fontSize: '16px',
            gap: '8px',
            margin: 'auto',
          }}>
          <span
            style={{
              color: '#A4A4A4',
            }}>
            <AnimatedText text="Design Engineer" delay={0} />
          </span>

          <AnimatedText
            text="Crafting tools and experiences for the web."
            delay={1.7}
          />
          <AnimatedText
            text="Student @ The University of Edinburgh, CS and AI."
            delay={3}
          />
          <AnimatedText text="Previously at Spotify." delay={5} />
        </div>

        <VisitorCounter />
      </HeaderWrapper>
    </div>
  )
}

export default Header
