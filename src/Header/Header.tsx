import { motion } from 'framer-motion'
import styled from 'styled-components'
import VisitorCounter from './VisitorCounter'

const HeaderWrapper = styled.div`
  height: 100%;
  flex-direction: column;
  border-radius: 10px;
  gap: 14px;
  background-color: ${(props) => props.theme.colors.card};
  border: 1px solid ${(props) => props.theme.colors.border};
  color: ${(props) => props.theme.colors.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.05);
`

const Header = () => {
  return (
    <div
      style={{
        width: '100%',
        height: 'min(78svh, 900px)',
        position: 'relative',
      }}>
      <HeaderWrapper>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '0 20px',
            textAlign: 'left',
            fontSize: '20px',
            gap: '8px',
            maxWidth: '700px',
          }}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.75,
            }}
            style={{
              color: '#A4A4A4',
              fontSize: '16px',
            }}>
            Software Engineer
          </motion.span>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 1,
              duration: 0.75,
            }}
            style={{
              fontSize: '18px',
            }}>
            Crafting tools and experiences for the web. Driven by meaningful
            projects spanning many technologies.
          </motion.span>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 2,
              duration: 0.75,
            }}
            style={{
              opacity: 0.8,
              fontSize: '18px',
            }}>
            Student @ The University of Edinburgh, CS and AI.{' '}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 2.5,
                duration: 0.75,
              }}>
              Previously at Spotify.
            </motion.span>
          </motion.span>
        </div>

        <VisitorCounter />
      </HeaderWrapper>
    </div>
  )
}

export default Header
