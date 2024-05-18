import styled, { useTheme } from 'styled-components'

const Underline = () => {
  const theme = useTheme()
  return (
    <svg
      width="325"
      height="1"
      viewBox="0 0 403 1"
      fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <line y1="0.5" x2="403" y2="0.5" stroke="url(#paint0_linear_1229_4)" />
      <defs>
        <linearGradient
          id="paint0_linear_1229_4"
          x1="410.5"
          y1="0.99886"
          x2="5.49998"
          y2="0.999985"
          gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#ffffff00" />
          <stop offset="1" stop-color={theme.colors.secondary} />
        </linearGradient>
      </defs>
    </svg>
  )
}

const StyledSplitterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.05rem;
  padding-left: 0.5rem;
`

const StyledSplitterText = styled.p`
  text-align: left;
  font-size: 12px;
  margin-bottom: 0px;
  color: ${(props) => props.theme.colors.secondary};
`

const TopicSplitter: React.FC<TopicSplitterProps> = ({ text }) => {
  return (
    <StyledSplitterWrapper>
      <StyledSplitterText>{text.toUpperCase()}</StyledSplitterText>
      <Underline />
    </StyledSplitterWrapper>
  )
}

interface TopicSplitterProps {
  text: string
}

export default TopicSplitter
