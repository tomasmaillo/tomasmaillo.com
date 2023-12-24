import React from 'react'
import TopicDescription from './TopicDescription'
import TopicSplitter from './TopicSplitter'
import { Item } from '../item.interface'
import styled from 'styled-components'

const StyledTopicDescriptionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`

const TopicDescriptionList: React.FC<TopicDescriptionListProps> = ({
  items,
  selectedItems,
  scrollToItem,
}) => {
  let currentTopic = ''

  const renderItem = (item: Item, index: number) => {
    if (!item.description) return null

    const isNewTopic = item.topic !== currentTopic
    if (isNewTopic) {
      currentTopic = item.topic
    }

    return (
      <React.Fragment key={index}>
        {isNewTopic && <TopicSplitter text={currentTopic} />}
        <TopicDescription
          item={item}
          selectedItems={selectedItems}
          scrollToItem={scrollToItem}
        />
      </React.Fragment>
    )
  }

  return (
    <StyledTopicDescriptionWrapper>
      {items.map(renderItem)}
    </StyledTopicDescriptionWrapper>
  )
}

interface TopicDescriptionListProps {
  items: Item[]
  selectedItems: number[]
  scrollToItem: (id: number) => void
}

export default TopicDescriptionList
