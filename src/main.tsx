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

const StyledMain = styled.main`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 0 16px 16px 16px;
  max-width: ${(props) => props.theme.maxWidth};
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

        <Card3D width="100%" height="200px">
          <button
            style={{
              width: '100%',
              height: '100%',
              margin: '0 auto',
              borderRadius: '100px',
              border: 'none',
              backgroundColor: '#272727',
              color: '#fff',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}>
            Contact me
          </button>
        </Card3D>

        <Credits />
      </StyledMain>
    </DynamicThemeProvider>
  </React.StrictMode>
)
