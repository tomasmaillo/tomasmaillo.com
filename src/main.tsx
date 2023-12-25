import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './CVView/CVView.tsx'
import './index.css'
import Credits from './Credits.tsx'
import Header from './Header/Header.tsx'
import Navbar from './CVView/Navbar/Navbar.tsx'
import DynamicThemeProvider from './DynamicThemeProvider.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DynamicThemeProvider>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          padding: '0 16px 16px 16px',
        }}>
        <Navbar />

        <Header />

        <App />

        <Credits />
      </div>
    </DynamicThemeProvider>
  </React.StrictMode>
)
