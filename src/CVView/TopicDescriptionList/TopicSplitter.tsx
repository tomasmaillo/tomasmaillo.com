import styled from 'styled-components'

const Underline = () => {
  return (
    <svg
      width="403"
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
          <stop stop-opacity="0" />
          <stop offset="1" stop-color="#999999" />
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
  font-size: 16px;
  margin-bottom: 0px;
  color: #999999;
`

const TopicSplitter: React.FC<TopicSplitterProps> = ({ text }) => {
  return (
    <StyledSplitterWrapper>
      <StyledSplitterText>{text}</StyledSplitterText>
      <Underline />
    </StyledSplitterWrapper>
  )
}

interface TopicSplitterProps {
  text: string
}

export default TopicSplitter
