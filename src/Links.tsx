import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styled from 'styled-components'
import HideOnMobile from './Utility/HideOnMobile'

type Link = {
  url: string
  text: string
  avatar?: string
}

type LinksProps = {
  links: Link[]
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
`

const LinksWrapper = styled.div`
  display: flex;
  height: min-content;
  gap: 16px;
  position: relative;
`

const ProfileWrapper = styled.div`
  display: flex;
  gap: 10px;
  padding: 7px;
  cursor: arrow;
  user-select: none;
`

const ProfileAvatar = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  margin-right: 2px;
  border: 1px solid #5a5a5a;
`

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  font-size: 14px;
`

const StyledLink = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: ${(props) => props.theme.colors.primaryInverse};
  padding: 0px 5px;
  font-size: 14px;

  user-select: none;

  &:hover {
    color: ${(props) => props.theme.colors.primaryInverse}dd;
  }
`

const Avatar = styled.img`
  margin-right: 5px;
  height: 24px;
  width: 24px;
`

const Background = styled(motion.div)`
  position: absolute;
  background-color: #cfcfcf43;
  border-radius: 7px;
  transition: all 0.3s ease;
  z-index: -1;
`

const Links: React.FC<LinksProps> = ({ links }) => {
  const [hoveredLink, setHoveredLink] = useState<null | HTMLElement>(null)

  return (
    <Container>
      <LinksWrapper>
        <AnimatePresence>
          {hoveredLink && (
            <Background
              initial={{
                width: hoveredLink.offsetWidth,
                height: hoveredLink.offsetHeight,
                x: hoveredLink.offsetLeft,
                y: hoveredLink.offsetTop + 2,
                scale: 0.9,
                opacity: 0,
              }}
              animate={{
                width: hoveredLink.offsetWidth,
                height: hoveredLink.offsetHeight,
                x: hoveredLink.offsetLeft,
                y: hoveredLink.offsetTop,
                opacity: 1,
                scale: 1,
                transition: { duration: 0.01 },
              }}
              exit={{
                width: hoveredLink.offsetWidth - 5,
                height: hoveredLink.offsetHeight - 10,
                x: hoveredLink.offsetLeft + 2.5,
                y: hoveredLink.offsetTop - 1,
                opacity: 0,
              }}
            />
          )}
        </AnimatePresence>

        <ProfileWrapper
          onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) =>
            setHoveredLink(e.currentTarget)
          }
          onMouseLeave={() => setHoveredLink(null)}
          onMouseDown={() =>
            window.scrollTo({
              top: 0,
              behavior: 'smooth',
            })
          }>
          <ProfileAvatar src="https://unavatar.io/github/tomasmaillo" />
          <HideOnMobile>
            <ProfileInfo>
              <b>TomasMaillo.com</b>
              <p style={{ margin: 0 }}>Full-stack Eng</p>
            </ProfileInfo>
          </HideOnMobile>
        </ProfileWrapper>

        {links.map((link, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}>
            <StyledLink
              href={link.url}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) =>
                setHoveredLink(e.currentTarget)
              }
              onMouseLeave={() => setHoveredLink(null)}>
              {link.avatar && <Avatar src={link.avatar} />}
              {link.text}
            </StyledLink>
          </div>
        ))}
      </LinksWrapper>
    </Container>
  )
}

export default Links
