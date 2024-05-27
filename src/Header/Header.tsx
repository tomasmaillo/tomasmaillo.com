import { motion } from 'framer-motion'
import styled from 'styled-components'
import VisitorCounter from './VisitorCounter'
import { ArrowUpRight, Check, Copy } from 'iconoir-react'
import { useState } from 'react'

const HeaderWrapper = styled.div`
  height: 100%;
  flex-direction: column;
  border-radius: 10px;
  max-width: 600px;
  margin: auto;
  gap: 14px;
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;
`

const StyledLink = styled.a`
  color: ${(props) => props.theme.colors.primary};
  text-decoration: none;
  border: 1px solid #a4a4a4;
  padding: 2px 8px;
  border-radius: 100px;
  width: fit-content;
  display: inline-block;
  position: relative;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 4px;
  user-select: none;
  align-items: center;
  justify-content: center;

  &:active {
    transform: scale(0.98);
  }
`

type AnimatedTextProps = {
  text: string
  delay?: number
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ text, delay = 0 }) => {
  const words = text.split(' ')

  const animationScale = 2

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

const EmailLink = () => {
  const [hasCopied, setHasCopied] = useState(false)

  const handleCopy = () => {
    const emailParts = ['tomas', 'tomasmaillo.com']
    const emailString = `${emailParts[0]}@${emailParts[1]}`
    navigator.clipboard.writeText(emailString)

    setHasCopied(true)

    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }

  return (
    <StyledLink
      target="_blank"
      onClick={() => handleCopy()}
      style={{ cursor: 'pointer' }}>
      Msg me
      {hasCopied ? (
        <Check height={16} width={16} />
      ) : (
        <Copy height={16} width={16} />
      )}
    </StyledLink>
  )
}

const Links = () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        marginTop: '10px',
      }}>
      <StyledLink href="/TomasMailloCV.pdf" target="_blank">
        CV
      </StyledLink>
      <EmailLink />
      <StyledLink
        href="https://github.com/tomasmaillo"
        target="_blank"
        rel="noopener noreferrer">
        GitHub
        <ArrowUpRight height={16} width={16} />
      </StyledLink>
      <StyledLink
        href="https://www.linkedin.com/in/tomas-maillo/"
        target="_blank"
        rel="noopener noreferrer">
        LinkedIn
        <ArrowUpRight height={16} width={16} />
      </StyledLink>
    </div>
  )
}

const Header = () => {
  return (
    <div
      style={{
        width: '100%',
        height: 'min(58svh, 500px)',
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
            gap: '4px',
            margin: 'auto',
          }}>
          <h1
            style={{
              fontFamily: 'PPEditorialNew',
              margin: 0,
            }}>
            Crafting for the Web<span style={{ color: '#EB5D30' }}>.</span>
          </h1>
          <span
            style={{
              color: '#A4A4A4',
              fontSize: '0.8rem',
            }}>
            <VisitorCounter />
          </span>
          <div
            style={{
              margin: '16px 0px',
            }}>
            I'm a design engineer and this is my little corner of the internet.
            I share and list what I've built and learned. Currently a Computer
            Science and Artificial Intelligence student at the University of
            Edinburgh. Previously at Spotify.
          </div>
          <Links />
        </div>
      </HeaderWrapper>
    </div>
  )
}

export default Header
