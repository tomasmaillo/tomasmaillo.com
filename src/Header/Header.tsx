import { motion } from 'framer-motion'
import styled from 'styled-components'
import VisitorCounter from './VisitorCounter'
import { ArrowUpRight, Check, Copy } from 'iconoir-react'
import { useState } from 'react'
import { useAbout } from '../AboutContext'

const HeaderWrapper = styled.div`
  padding: 64px 0px;
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

// Define the interface for a confetti piece
interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotate: number
}

const EmailLink: React.FC = () => {
  const [hasCopied, setHasCopied] = useState(false)
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])

  const handleCopy = () => {
    const emailParts = ['tomas', 'tomasmaillo.com']
    const emailString = `${emailParts[0]}@${emailParts[1]}`
    navigator.clipboard.writeText(emailString)

    setHasCopied(true)

    // Generate confetti pieces with their properties
    setConfetti((prevConfetti) => [
      ...prevConfetti,
      {
        id: prevConfetti.length,
        x: Math.random() * 50 - 25,
        y: Math.random() * -30 - 50,
        rotate: Math.random() * 10 - 5,
      },
    ])

    setTimeout(() => {
      setHasCopied(false)
    }, 2000)
  }

  return (
    <StyledLink
      target="_blank"
      onClick={() => handleCopy()}
      style={{
        cursor:
          confetti.length > CONFETTI_MESSAGES.length
            ? 'not-allowed'
            : 'pointer',
        position: 'relative',
        opacity: confetti.length > CONFETTI_MESSAGES.length ? 0.5 : 1,
        pointerEvents:
          confetti.length > CONFETTI_MESSAGES.length ? 'none' : 'auto',
      }}
      disabled={confetti.length > CONFETTI_MESSAGES.length}>
      {confetti.map((piece) => (
        <Confetti key={piece.id} {...piece} />
      ))}
      Message me
      {/* {hasCopied ? (
        <Check height={16} width={16} />
      ) : (
        <Copy height={16} width={16} />
      )} */}
    </StyledLink>
  )
}

// Define the props for the Confetti component
interface ConfettiProps {
  x: number
  y: number
  rotate: number
  id: number
}

const CONFETTI_MESSAGES = [
  'email copied',
  'email copied',
  'email in clipboard',
  'copied!',
  'good to go!',
  'okay!',
  'that’s enough!',
  'trust, it’s there',
  'omg',
  'really?',
  'it’s in your clipboard!!!',
  'stop clicking!',
  'seriously, it’s copied!',
  'do you not believe me?',
  'I swear it’s there!',
  'you’re wasting clicks!',
  'why are you still clicking?',
  'are you okay?',
  'enough already!',
  'it’s not going anywhere!',
  'seriously, stop it!',
  'what do you want from me?',
  'please stop!',
  'Im tired',
  'Please I have kids',
  'I have a family',
  'Little Timmy needs me',
  'I have a life',
  "if you've gotten this far..",
  'it means you really want to chat!',
  'send me an email :)',
  'email me!',
  "I'm waiting",
  'Its in your clipboard',
  'What are you waiting for?',
  '💖',
  'ENOUGH FUN!',
  "I'll lock this so you email me!",
]

const Confetti: React.FC<ConfettiProps> = ({ x, y, rotate, id }) => {
  return (
    <motion.p
      initial={{ opacity: 1, scale: 1 }}
      animate={{
        opacity: [0, 1, 0.9, 0],
        scale: [0.7, 1.2, 1.1],
        y: [-30, y],
        x: [-25, x - 25],
        rotate,
      }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        top: '50%',
        userSelect: 'none',
        pointerEvents: 'none',
        transform: 'translate(-50%, -50%)',
        whiteSpace: 'nowrap',
        width: '0px',
        fontSize: '12px',
      }}>
      {CONFETTI_MESSAGES[id % CONFETTI_MESSAGES.length]}
    </motion.p>
  )
}

const Links = () => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        marginTop: '10px',
        flexWrap: 'wrap',
      }}>
      <StyledLink href="/TomasMailloCV.pdf" target="_blank">
        CV
      </StyledLink>
      <EmailLink />
      <StyledLink
        href="https://x.com/tomascodes"
        target="_blank"
        rel="noopener noreferrer">
        Twitter
        <ArrowUpRight height={16} width={16} />
      </StyledLink>
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
  const { openAbout } = useAbout()
  return (
    <div
      style={{
        width: '100%',
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
              margin: '12px 0px',
            }}>
            I'm a design engineer and this is my little corner of the internet.
            I share and list what I've built and learned. Currently a Computer
            Science and Artificial Intelligence student at the University of
            Edinburgh. Previously at Spotify.
            <span style={{ height: '20px', display: 'block' }}></span>
            Scroll to see my projects, or read more{' '}
            <span
              style={{
                cursor: 'pointer',
                textDecoration: 'underline',
                color: '#EB5D30',
                userSelect: 'none',
              }}
              onClick={openAbout}>
              about me
            </span>
          </div>
          <span style={{ height: '16px', display: 'block' }}></span>

          <Links />
        </div>
      </HeaderWrapper>
    </div>
  )
}

export default Header
