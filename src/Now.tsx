import styled from 'styled-components'
import Signature from './Signature'

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
  text-wrap: balance;

  &:hover {
    color: ${(props) => props.theme.colors.primary};
  }
`

const UpdateNowButton = () => {
  const HandleClick = () => {
    console.log('Clicked')
  }

  return (
    <StyledUpdateNowButton>
      Is this out of date? Send a push notification to my phone to pressure me
      into updating this page
    </StyledUpdateNowButton>
  )
}

const Now = () => {
  return (
    <Wrapper>
      <h3>/Now</h3>
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
