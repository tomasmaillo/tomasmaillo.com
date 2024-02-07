import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './CVView/CVView.tsx'
import './index.css'
import Credits from './Credits.tsx'
import Header from './Header/Header.tsx'
import Navbar from './CVView/Navbar/Navbar.tsx'
import DynamicThemeProvider from './DynamicThemeProvider.tsx'
import Now from './Now.tsx'
import styled from 'styled-components'
import Card3D from './Card3D.tsx'
import EverythingIveEverBuilt from './EverythingIveEverBuilt.tsx'

const StyledMain = styled.main`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 16px 16px 16px;
  max-width: ${(props) => props.theme.maxWidth};
  margin: 0 auto;
`

const StyledContactButton = styled.a`
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

    transform: scale(0.7);
    opacity: 0;
    transition: 0.3s ease;
  }

  &:hover::after {
    transform: scale(1);
    /* TODO: Fix buggy animation */
    /* opacity: 1; */
  }
  h1 {
    text-shadow: 0 0 1px #dedede;
    transition: 0.3s ease;
  }

  &:hover h1 {
    text-shadow: 0 0 10px #dedede;
  }
`

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DynamicThemeProvider>
      <StyledMain>
        <Navbar />
        <Header />

        <App />

        <EverythingIveEverBuilt />

        <Card3D width="100%" height="200px">
          <StyledContactButton
            target="_blank"
            rel="noopener noreferrer"
            href="https://twitter.com/tomascodes">
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
              }}>
              Reach me
            </h1>
          </StyledContactButton>
        </Card3D>

        <Now />

        <Credits />
      </StyledMain>
    </DynamicThemeProvider>
  </React.StrictMode>
)
