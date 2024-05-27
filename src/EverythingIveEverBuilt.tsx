import styled from 'styled-components'

// Assuming these theme colors are defined in your theme object
interface Theme {
  colors: {
    card: string
    border: string
    primary: string
  }
}

interface StyledContainerProps {
  theme: Theme
}

const StyledContainer = styled.div<StyledContainerProps>`
  border: 1px solid ${(props) => props.theme.colors.border};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: max(20%, 300px);
  min-width: 0;
  flex-shrink: 0;
  position: relative;
  border-radius: 10px;
  background-color: #ffffff;
  padding: 16px;

  background-color: #99e7ff;
  background-image: radial-gradient(
      at 18% 8%,
      hsla(${Math.floor(Math.random() * 360)}, 69%, 68%, 0.5) 0px,
      transparent 50%
    ),
    radial-gradient(
      at 96% 23%,
      hsla(${Math.floor(Math.random() * 360)}, 85%, 63%, 0.5) 0px,
      transparent 50%
    ),
    radial-gradient(
      at 19% 61%,
      hsla(${Math.floor(Math.random() * 360)}, 69%, 60%, 0.5) 0px,
      transparent 50%
    ),
    radial-gradient(
      at 15% 55%,
      hsla(${Math.floor(Math.random() * 360)}, 88%, 73%, 0.5) 0px,
      transparent 50%
    ),
    radial-gradient(
      at 5% 97%,
      hsla(${Math.floor(Math.random() * 360)}, 93%, 71%, 0.5) 0px,
      transparent 50%
    ),
    radial-gradient(
      at 66% 56%,
      hsla(${Math.floor(Math.random() * 360)}, 66%, 74%, 0.5) 0px,
      transparent 50%
    ),
    radial-gradient(
      at 79% 65%,
      hsla(${Math.floor(Math.random() * 360)}, 84%, 76%, 0.5) 0px,
      transparent 50%
    );
  background-color: ${(props) => props.theme.colors.card};

  & * {
    margin: 0;
  }
`

const EverythingIveEverBuilt: React.FC = () => {
  return (
    <StyledContainer>
      <h3>Looking for even more?!</h3>
      <code>
        Check my{' '}
        <a
          href="https://tomasmaillo.notion.site/Everything-I-ve-ever-made-3d0e512ce6f24e6498604f2a772b4c8d?pvs=4"
          target="_blank"
          style={{ textDecoration: 'underline' }}
          rel="noopener noreferrer">
          archive
        </a>{' '}
        on everything I've ever built.
      </code>
    </StyledContainer>
  )
}

export default EverythingIveEverBuilt
