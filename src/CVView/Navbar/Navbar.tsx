import { useState, useEffect } from 'react'
import Links from '../../Links'
import LocationAndTime from './LocationAndTime'
import styled from 'styled-components'

const StyledNavbar = styled.div`
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.cardInverse};
  border: 1px solid ${(props) => props.theme.colors.border};
  backdrop-filter: blur(3px);
  color: ${(props) => props.theme.colors.primaryInverse};
  transition: 0.3s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Navbar = () => {
  const [isScrollAtTop, setIsScrollAtTop] = useState(true)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrollAtTop(window.scrollY === 0)
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 10000,
        paddingTop: '16px',
      }}>
      <StyledNavbar
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          padding: `${isScrollAtTop || isHovered ? '8px' : '2px'}`,
        }}>
        <Links
          links={[
            {
              url: 'https://github.com/tomasmaillo',
              text: 'GitHub',
            },
            {
              url: 'https://twitter.com/tomascodes',
              text: 'Twitter',
            },
            {
              url: 'https://www.linkedin.com/in/tomas-maillo/',
              text: 'LinkedIn',
            },
          ]}
        />

        <span
          style={{
            opacity: isScrollAtTop || isHovered ? 0.75 : 0.25,
            transition: 'opacity 0.3s',
          }}>
          <LocationAndTime />
        </span>
      </StyledNavbar>
    </div>
  )
}

export default Navbar
