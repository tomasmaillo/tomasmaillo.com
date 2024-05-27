import { useState } from 'react'

const LeftTableOfContents = ({ children }: { children: React.ReactNode }) => {
  const [hover, setHover] = useState(false)

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
          paddingLeft: hover ? '24px' : '0px',
          width: hover ? '250px' : '20px',
          overflowX: 'hidden',
          backgroundColor: hover ? '#EB5D30' : 'transparent',
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
            bottom: '0px',
            padding: '8px',
            margin: 0,
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

export default LeftTableOfContents
