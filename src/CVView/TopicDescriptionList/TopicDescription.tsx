import styled from 'styled-components'
import StyledTopicDescription from '../StyledTopicDescription'

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

const TopicDescription = ({ item, selectedItems, scrollToItem }: any) => {
  return (
    <StyledTopicDescriptionWrapper>
      <StyledPoint />
      <StyledTopicDescription
        key={item.id}
        layoutId={`item-${item.id}`}
        isHidden={!selectedItems.includes(item.id)}
        onClick={() => scrollToItem(item.id)}>
        {item.description}
      </StyledTopicDescription>
    </StyledTopicDescriptionWrapper>
  )
}

export default TopicDescription
