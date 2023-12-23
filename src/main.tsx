import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Links from './Links.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div style={{ margin: '2rem' }}>
      {/* <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 10000,
          margin: '2rem',
          borderRadius: '10px',
          backgroundColor: '#ffffffd7',
          border: '1px solid #ececec',
          padding: '15px',
          backdropFilter: 'blur(3px)',
        }}>
        <Links
          links={[
            {
              url: './TomasMailloCV.pdf',
              text: 'Ceevee',
            },

            {
              url: 'https://projectshare.comp-soc.com',
              text: 'About',
            },
          ]}
        />
      </div> */}

      <div
        style={{
          height: '85vh',
          bottom: 0,
          left: 0,
          zIndex: 150,
          borderRadius: '10px',
          padding: '15px',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
        }}>
        <p>
          I'm Tomas Maillo, a Software Engineer. I design and build something a
          word
        </p>
        <p>
          CS and AI student at The University of Edinburgh. Previously at
          Spotify
        </p>
      </div>

      <App />

      <div
        style={{
          height: '96vh',
          bottom: 0,
          left: 0,
          zIndex: 10000,
          borderRadius: '10px',
          backgroundColor: '#dffffad6',
          border: '1px solid #ececec',
          padding: '15px',
          backdropFilter: 'blur(3px)',
        }}></div>
    </div>
  </React.StrictMode>
)
