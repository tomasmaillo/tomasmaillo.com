import styled from 'styled-components'

const HighlightWrapper = styled.div`
  font-size: inherit;
  color: inherit;
  text-underline-offset: 2px;
  text-decoration: underline;
  white-space: nowrap;
  display: inline-block;
  position: relative;
  margin-left: 0.125rem;
  cursor: pointer;

  &::before {
    content: '';
    width: calc(100% + 0.625rem);
    height: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50% - 2px)) scale(0.95);
    border-radius: 4px;
    background: gray;
    opacity: 0;
    transition: transform 150ms 0s ease, opacity 150ms 10ms ease;
    z-index: -1;
  }

  &:hover {
    transition: transform 150ms 100ms ease, opacity 150ms 0s ease;
    text-decoration: none;

    &::before {
      opacity: 1;
      transform: translate(-50%, calc(-50% - 2px)) scale(1);
    }
  }
`

const Highlight = () => {
  return <HighlightWrapper>hiii</HighlightWrapper>
}

export default Highlight
