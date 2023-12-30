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

const StyledMain = styled.main`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 16px 16px 16px;
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
`

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DynamicThemeProvider>
      <StyledMain>
        <Navbar />
        <Header />

        <App />

        <Now />

        <Credits />
      </StyledMain>
    </DynamicThemeProvider>
  </React.StrictMode>
)
