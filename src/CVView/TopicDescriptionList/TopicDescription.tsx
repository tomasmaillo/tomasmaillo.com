import { motion } from 'framer-motion'
import styled from 'styled-components'

const StyledPoint = styled.span`
  color: #999999;
  font-size: 24px;

  &::after {
    content: '•';
    margin-left: 0.5rem;
  }
`

const StyledTopicDescriptionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  width: inherit;
`

const StyledTopicDescription = styled(motion.div)`
  font-size: 14px;
  padding: 8px 8px;
  margin: 0px 4px;
  width: 30vw;
  box-sizing: border-box;

  background: rgba(251, 251, 251, 0.37);
  border: 1px solid #ffffff00;
  border-radius: 7px;

  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  text-align: left;
  cursor: pointer;

  transition: border 0.3s;

  &:hover {
    border: 1px solid #e3e3e3;
  }

  &.visible {
    visibility: visible;
  }

  &.hidden {
    visibility: hidden;
  }
`

var transition = {
  type: 'spring',
  stiffness: 50,
  damping: 12,
  duration: 0.1,
}

const TopicDescription = ({ item, selectedItems, scrollToItem }: any) => {
  return (
    <StyledTopicDescriptionWrapper>
      <StyledPoint />
      <StyledTopicDescription
        key={item.id}
        layoutId={`item-${item.id}`}
        className={selectedItems.includes(item.id) ? 'visible' : 'hidden'}
        transition={transition}
        onClick={() => scrollToItem(item.id)}>
        {item.description}
      </StyledTopicDescription>
    </StyledTopicDescriptionWrapper>
  )
}

export default TopicDescription
