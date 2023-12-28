import styled from 'styled-components'
import Signature from './Signature'

const Wrapper = styled.div`
  padding: 20px 32px 32px 32px;
  width: 550px;
  background-color: ${(props) => props.theme.colors.card};
  margin: 64px auto;
  border-radius: 2px;

  border: 1px solid ${(props) => props.theme.colors.border};
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.12);
  text-align: left;
  transform: rotate(0.4deg);
  font-size: 16px;
  color: ${(props) => props.theme.colors.primary};
`

const SectionTitle = styled.p`
  font-weight: 600;
  margin: 0;
  margin-top: 24px;
`

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
      <SectionTitle>Crafting the Canvas</SectionTitle>
      Yearly Portfolio Rebirth: Each year brings a new wave of creativity as I
      reconstruct my portfolio website from the ground up. It's a fusion of
      code, design, and personal evolution.
      <SectionTitle>Intellectual Adventures</SectionTitle>
      Brain Gymnastics with CS & AI: In the throes of my third year at the
      University of Edinburgh, I'm diving deep into challenging courses. It’s a
      mix of embracing the tough stuff and cherishing the growth that comes with
      it.
      <SectionTitle>Beyond Code</SectionTitle>
      Tech, Ties, and Identity: On a quest to connect with fellow tech
      enthusiasts who dance in the realms of software, design, and LGBTQ+
      experiences. Each encounter, a step out of my comfort zone, enriches my
      journey.
      <SectionTitle>Slopes & Dreams</SectionTitle>
      Skiing: My Non-Negotiable Bliss: Skiing isn't just a hobby; it's my soul's
      retreat. Ensuring my tech career funds this snowy escapade yearly is the
      dream I chase.
      <SectionTitle>Life tweaks</SectionTitle>I started gyming during early
      2023. Discovering the unexpected joy of gym life, paired with an
      innovative twist: syncing study flashcards with my workout breaks. Fitness
      for the body and brain alike!
      <SectionTitle>Life tweaks</SectionTitle>
      Want to finish university. Discovering the unexpected joy of gym life,
      paired with an innovative twist: syncing study flashcards with my workout
      breaks. Fitness for the body and brain alike!
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
          26th Dec 2023
        </span>
      </div>
    </Wrapper>
  )
}

export default Now
