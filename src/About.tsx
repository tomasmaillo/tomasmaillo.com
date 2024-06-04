import { useEffect } from 'react'
import { AboutProvider, useAbout } from './AboutContext'
import LocationAndTime from './CVView/Navbar/LocationAndTime'

const WIDTH = 'min(600px, 100vw)'

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
          // width: shown ? WIDTH : '0px',
          overflowX: 'hidden',
          // backgroundColor: shown ? '#EB5D30' : 'transparent',
          backgroundColor: '#EB5D30',
          transition: '0.3s ease',
          // color: shown ? '#f6f6f6' : '#272727',
          color: '#f6f6f6',
          transform: shown ? `translateX(0)` : `translateX(-600px)`,
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
              margin: '16px',
            }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}>
              <h3
                style={{
                  margin: 0,
                }}>
                About
              </h3>

              <span
                onClick={closeAbout}
                style={{
                  cursor: 'pointer',
                }}>
                ✕
              </span>
            </div>
            <img
              src="/tomas.png"
              alt="Tomas Maillo"
              style={{ width: '100%', borderRadius: '10px' }}
            />
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
              for my studies and I hate writing about myself.
            </p>

            <p>
              I can't juggle three balls at once or crack an egg with one hand,
              but I can...
            </p>

            <LocationAndTime />
          </div>
        </div>
      </div>
      <div>
        <div
          style={{
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
