import styled from 'styled-components'
import StyledTopicDescription from '../StyledTopicDescription'

const StyledPoint = styled.span`
  color: ${(props) => props.theme.colors.secondary};
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <span>
            <b>{item.description.title}</b> {' ⋅ '}
            <span style={{ opacity: 0.75 }}>{item.description.role}</span>
          </span>
          <b>{item.description.date}</b>
        </div>

        <span>{item.description.text}</span>
      </StyledTopicDescription>
    </StyledTopicDescriptionWrapper>
  )
}

export default TopicDescription
