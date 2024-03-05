import styled from 'styled-components'
import Signature from './Signature'
import { useState } from 'react'
import { motion } from 'framer-motion'

const Wrapper = styled.div`
  padding: 20px 32px 32px 32px;
  max-width: 550px;
  background-color: ${(props) => props.theme.colors.card};
  margin: 64px auto;
  border-radius: 10px;

  border: 1px solid ${(props) => props.theme.colors.border};
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12);
  text-align: left;
  transform: rotate(0.4deg);
  font-size: 16px;
  color: ${(props) => props.theme.colors.primary};

  @media (max-width: 768px) {
    padding: 16px 24px 24px 24px;
    transform: rotate(0deg);
    margin: auto;
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

const Now = () => {
  return (
    <Wrapper>
      <h3>
        Dear <i>you</i>,
      </h3>
      <p
        style={{
          color: '#666',
          fontSize: '16px',
        }}>
        This page is a list of the things I'm currently doing, following the
        format laid out by the <a href="https://nownownow.com/">/now</a>{' '}
        movement. Dual purpose of showing what I am working on and keeping me
        accountable.
      </p>
      <SectionTitle>Re-Crafting the Canvas</SectionTitle>
      Every year I recreate my portfolio from scratch. With each year I grow as
      a person and engineer and I want my portfolio to reflect that. This year
      I'm focusing on a more serious and sleek experience. (Always keeping them
      at{' '}
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
          6th Feb 2024
        </span>
        <UpdateNowButton />
      </div>
    </Wrapper>
  )
}

export default Now
