import App from './CVView/CVView.tsx'
import './index.css'
import Credits from './Credits.tsx'
import Header from './Header/Header.tsx'
import Navbar from './CVView/Navbar/Navbar.tsx'
import DynamicThemeProvider from './DynamicThemeProvider.tsx'
import styled from 'styled-components'
import Card3D from './Card3D.tsx'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

const StyledMain = styled.main`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 16px 16px 16px;
  max-width: ${(props) => props.theme.maxWidth};
  margin: 0 auto;
`

const StyledContactButton = styled.a<{ isHovered: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 100px;
  border: none;
  background-color: #272727;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #eb5d30;
    border-radius: 100px;
    pointer-events: none;
    user-select: none;

    transform: ${(props) => (props.isHovered ? 'scale(1)' : 'scale(0.8)')};
    opacity: ${(props) => (props.isHovered ? 1 : 0)};
    transition: 0.3s ease;
  }

  h1 {
    text-shadow: 0 0 ${(props) => (props.isHovered ? '10px' : '0')} #dedede;

    transition: 0.3s ease;
  }
`

const ContactButton = () => {
  const [hover, setHover] = React.useState(false)
  return (
    <Card3D
      width="100%"
      height="200px"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      <StyledContactButton
        target="_blank"
        rel="noopener noreferrer"
        href="mailto:tomas@tomasmaillo.com"
        isHovered={hover}>
        <h1
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            margin: 0,
            zIndex: 5,
            pointerEvents: 'none',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}>
          Reach me
        </h1>
      </StyledContactButton>
    </Card3D>
  )
}

const LeftTableOfContents = ({ children }: { children: React.ReactNode }) => {
  const [hover, setHover] = React.useState(false)

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          position: 'fixed',
          alignItems: 'left',
          textAlign: 'left',
          paddingLeft: '6px',
          width: hover ? '250px' : '20px',
          overflowX: 'hidden',
          backgroundColor: hover ? '#EB5D30' : '#f6f6f6',
          transition: ' 0.2s ease',
          color: hover ? '#f6f6f6' : '#272727',

          zIndex: 10,
          height: '100vh',
          justifyContent: 'center',
        }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}>
        {[
          'Introduction',
          'Experience',
          'Education',
          'Skills',
          'Projects',
          'Contact',
        ].map((section, _) => (
          <a
            href={`#${section.toLowerCase()}`}
            style={{
              textDecoration: 'none',
              clear: 'both',
              display: 'inline-block',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}>
            <span
              style={{
                display: 'inline-block',
                transform: hover ? 'scale(0.9)' : 'scale(0.3)',
                color: hover ? '#f6f6f6' : '#272727',
                opacity: hover ? 1 : 0.5,
                transition: 'transform 0.2s ease',
              }}>
              ⬤
            </span>
            <span
              style={{
                opacity: hover ? 1 : 0,
                transition: 'opacity 0.3s ease',
                marginLeft: '8px',
              }}>
              {section}
            </span>
          </a>
        ))}
        <p
          style={{
            opacity: hover ? 1 : 0,
            transition: 'opacity 0.3s ease',
            marginTop: '16px',
            width: '250px',
            position: 'absolute',
            bottom: '8px',
            fontSize: '12px',
          }}>
          Made with ❤️ by Tomás Maillo
        </p>
      </div>
      <div style={{}}>
        <div
          style={{
            backgroundColor: '#f5f5f5',
            transform: hover ? 'translateX(250px)' : 'translateX(0px)',
            transition: 'transform 0.2s ease',
          }}>
          {children}
        </div>
      </div>
    </div>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DynamicThemeProvider>
      <LeftTableOfContents>
        <StyledMain>
          {/* <Navbar /> */}
          <Header />

          <App />
          {/* </StyledMain>
      <Now />
      <StyledMain> */}
          <ContactButton />

          <Credits />
        </StyledMain>
      </LeftTableOfContents>
    </DynamicThemeProvider>
  </React.StrictMode>
)
