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
`

const Header = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '80vh',
        position: 'relative',
      }}>
      <HeaderWrapper>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            padding: '0 20px',
            textAlign: 'left',
            fontSize: '24px',
          }}>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.75,
            }}>
            <b>Tomas Maillo</b>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: 1.25,
                duration: 0.75,
              }}>
              , Software Engineer.
            </motion.span>
          </motion.span>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 2.5,
              duration: 0.75,
            }}>
            CS and AI student at The University of Edinburgh.
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 4.5,
              duration: 0.75,
            }}>
            Previously at Spotify
          </motion.span>
        </div>

        <VisitorCounter />
      </HeaderWrapper>
    </div>
  )
}

export default Header
