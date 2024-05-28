import { useEffect } from 'react'
import { AboutProvider, useAbout } from './AboutContext'
import LocationAndTime from './CVView/Navbar/LocationAndTime'

const WIDTH = 'min(500px, 100vw)'

const About = ({ children }: { children: React.ReactNode }) => {
  return (
    <AboutProvider>
      <AboutContent>{children}</AboutContent>
    </AboutProvider>
  )
}

const AboutContent = ({ children }: { children: React.ReactNode }) => {
  const { shown, closeAbout } = useAbout()

  useEffect(() => {
    const metaTag = document.querySelector('meta[name="theme-color"]')

    if (metaTag) {
      metaTag.setAttribute('content', shown ? '#EB5D30' : '#F5F5F5')
    }
  }, [shown])

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          position: 'fixed',
          alignItems: 'left',
          textAlign: 'left',
          width: shown ? WIDTH : '0px',
          overflowX: 'hidden',
          backgroundColor: shown ? '#EB5D30' : 'transparent',
          transition: '0.3s ease',
          color: shown ? '#f6f6f6' : '#272727',
          zIndex: 10,
          height: '100vh',
        }}>
        <div
          style={{
            opacity: shown ? 1 : 0,
            transition: 'opacity 0.3s ease',
            width: WIDTH,
            bottom: '0px',
            fontSize: '16px',
          }}>
          <div
            style={{
              margin: '12px',
            }}>
            {/* <div onClick={closeAbout}>
              <svg
                style={{ cursor: 'pointer' }}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path
                  fill={shown ? '#f6f6f6' : '#272727'}
                  d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
                />
              </svg>
            </div> */}
            <img
              src="/tomas.png"
              alt="Tomas Maillo"
              style={{ width: '100%', borderRadius: '10px' }}
            />
            <LocationAndTime />
            <h3>About</h3>
            <p>
              Hiya, I'm Tomas (he/him).{' '}
              <a
                href="https://maps.google.com/?q=Oviedo"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline' }}>
                Oviedo
              </a>
              -born,{' '}
              {Math.floor(
                (new Date().getTime() - new Date('2003-05-07').getTime()) /
                  (1000 * 60 * 60 * 24 * 365.25)
              )}{' '}
              year old, currently based in{' '}
              <a
                href="https://maps.google.com/?q=Edinburgh"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'underline' }}>
                Edinburgh
              </a>{' '}
              for my studies.
            </p>
            <p>
              <i>
                I find writing About sections extremely daunting, but I'll try
                to summarise my existence in a few paragraphs.
              </i>
            </p>

            writing takes time!!! WIP
          </div>
        </div>
      </div>
      <div>
        <div
          style={{
            backgroundColor: '#f5f5f5',
            transform: shown ? `translateX(${WIDTH})` : 'translateX(0px)',
            transition: 'transform 0.3s ease, opacity 0.3s ease',
            opacity: shown ? 0.5 : 1,
          }}
          onClick={() => {
            if (shown) closeAbout()
          }}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default About
