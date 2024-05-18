import styled from 'styled-components'
import Signature from './Signature'
import { useState } from 'react'
import { motion } from 'framer-motion'

const Wrapper = styled.div<{ rotation?: number }>`
  padding: 20px 32px 32px 32px;
  max-width: 550px;
  background-color: ${(props) => props.theme.colors.card};
  margin: 64px auto;
  border-radius: 10px;

  border: 1px solid ${(props) => props.theme.colors.border};
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12);
  text-align: left;
  transform: rotate(${(props) => props.rotation || 0.4}deg);
  font-size: 16px;
  color: ${(props) => props.theme.colors.primary};

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  @media (max-width: 768px) {
    padding: 16px 24px 24px 24px;
    transform: rotate(0deg);
    margin: auto 16px;
    width: 100%;
  }
`

const SectionTitle = styled.p`
  font-weight: 600;
  margin: 0;
  margin-top: 24px;
`

const StyledUpdateNowButton = styled.button`
  cursor: pointer;
  border-radius: 25px;
  border: none;

  color: ${(props) => props.theme.colors.secondary};
  background-color: transparent;
  transition: 0.2s ease-in-out;
  margin-top: 16px;

  max-inline-size: 50ch;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`

const UpdateNowButton = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSendingMessage, setIsSendingMessage] = useState(false)
  const [userName, setUserName] = useState('')

  const handleUpdateNow = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsSendingMessage(true)
    e.preventDefault()

    try {
      const response = await fetch(
        'https://web.tomasmaillo.com/updateNowPage',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: userName }),
        }
      )

      if (!response.ok) throw new Error('Network response was not ok.')
    } catch (error) {
      console.error('Failed to fetch region', error)
    } finally {
      setIsSendingMessage(false)
      setIsFormOpen(false) // Close the form after the operation
      setUserName('') // Clear the input after form submission
    }
  }

  return (
    <StyledUpdateNowButton onClick={() => setIsFormOpen(true)}>
      Send: "Hey Tomas, this is so out of date! Update it"
      {isFormOpen && (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          onSubmit={handleUpdateNow}
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            justifyContent: 'center',

            marginTop: '8px',
            opacity: isSendingMessage ? 0.1 : 1,
            color: isSendingMessage ? '#cc1313' : '#333',
            userSelect: isSendingMessage ? 'none' : 'auto',
            pointerEvents: isSendingMessage ? 'none' : 'auto',
          }}>
          From:
          <input
            type="text"
            placeholder="your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{
              border: 'none',
              color: '#333',
              borderBottom: '1px solid #333',
            }}
          />
          <button
            type="submit"
            style={{
              padding: '4px 8px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#eb5d30',
              color: 'white',
            }}>
            Send
          </button>
        </motion.form>
      )}
    </StyledUpdateNowButton>
  )
}

const NOWS = [
  {
    date: new Date('2024-01-24'),
    content: (
      <>
        <h3>Refueling My Creativity</h3>
        <SectionTitle>Prepping for the Semester</SectionTitle>
        Reviewing courses and plotting my semester. Excited about the System
        Design Project and planning to integrate my interest in AI into this
        year's portfolio somehow.
        <SectionTitle>Drag and Ski</SectionTitle>
        Experimented with drag makeup techniques I've been wanting to try, and
        hit the slopes for the first ski trip of the season—refreshing the body
        and mind for the busy months ahead.
      </>
    ),
  },
  {
    date: new Date('2024-01-23'),
    content: (
      <>
        <h3>New Year, New Goals</h3>
        <SectionTitle>Exploring New Tech</SectionTitle>
        Started playing around with TensorFlow for potential use in my portfolio
        and upcoming projects. AI's potential in web development is vast, and
        I'm excited to dive deeper.
        <SectionTitle>Health is Wealth</SectionTitle>
        Committed to making the gym a regular part of my routine. Let's see how
        this goes alongside balancing coursework and coding projects.
      </>
    ),
  },
  {
    date: new Date('2024-02-06'),
    content: (
      <>
        <h3>
          Dear <i>you</i>,
        </h3>
        <SectionTitle>Re-Crafting the Canvas</SectionTitle>
        Every year I recreate my portfolio from scratch. With each year I grow
        as a person and engineer and I want my portfolio to reflect that. This
        year I'm focusing on a more serious and sleek experience. (Always
        keeping them at{' '}
        <code>
          {'<'}year{'>'}.tomasmaillo.com
        </code>
        )<SectionTitle>Brain Gymnastics</SectionTitle>
        Starting my second semester of my 3rd year at university. I'm taking a
        course called System Design Project where we're building an AI
        hand-gesture controlled fan. We'll see how that turns out 🤞
        <SectionTitle>Life tweaks</SectionTitle>Found the unexpected joy of gym
        life + going through flashcards during my workout breaks. Thats how to
        cheat the system.
      </>
    ),
  },
  {
    date: new Date('2024-01-24'),
    content: <h1>test</h1>,
  },
  {
    date: new Date('2024-01-23'),
    content: <h1>test</h1>,
  },
].sort((a, b) => b.date.getTime() - a.date.getTime())

const Now = ({ date, content }: { date: Date; content: JSX.Element }) => {
  return (
    <Wrapper>
      <div>{content}</div>
      <NowFooter date={date} />
    </Wrapper>
  )
}

const NowFooter = ({ date }: { date: Date }) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',

        justifyContent: 'flex-end',
        marginTop: '2rem',
      }}>
      <Signature />
      <span
        style={{
          fontSize: '12px',
        }}>
        {date.toDateString()}
      </span>
      <UpdateNowButton />
    </div>
  )
}
const CarouselContainer = styled.div`
  overflow: hidden;
  width: 100%;
`

const CarouselSlider = styled(motion.div)`
  display: flex;
`

const CarouselItem = styled.div`
  min-width: 50%;
  display: flex;
  transition: opacity 0.5s ease, filter 0.5s ease;
`

const NowCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Use a custom spring animation for the slide transition
  const spring = {
    type: 'spring',
    stiffness: 100, // Adjust stiffness for a tighter or looser spring
    damping: 15, // Adjust damping for more or less oscillation
    mass: 1, // Adjust mass for heavier or lighter feel
  }

  return (
    <MainContent>
      <CarouselContainer>
        <CarouselSlider
          animate={{ translateX: `calc(-${currentIndex * 50}% + 25%)` }}
          transition={spring}>
          {NOWS.map((now, index) => (
            <CarouselItem
              key={index}
              style={{
                opacity: index === currentIndex ? 1 : 0.5,
                filter: index === currentIndex ? 'none' : 'blur(2px)',
              }}
              onClick={() => setCurrentIndex(index)}>
              <Now date={now.date} content={now.content} />
            </CarouselItem>
          ))}
        </CarouselSlider>
      </CarouselContainer>
    </MainContent>
  )
}

const MainContent = styled.div`
  position: relative;

  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`

export default NowCarousel
