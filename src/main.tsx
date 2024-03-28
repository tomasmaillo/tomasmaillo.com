import App from './CVView/CVView.tsx'
import './index.css'
import Credits from './Credits.tsx'
import Header from './Header/Header.tsx'
import Navbar from './CVView/Navbar/Navbar.tsx'
import DynamicThemeProvider from './DynamicThemeProvider.tsx'
import Now from './Now.tsx'
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DynamicThemeProvider>
      <StyledMain>
        <Navbar />
        <Header />

        <App />

        <Now />

        <ContactButton />

        <Credits />
      </StyledMain>
    </DynamicThemeProvider>
  </React.StrictMode>
)
