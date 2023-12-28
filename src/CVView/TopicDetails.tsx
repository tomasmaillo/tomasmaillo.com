import { Item } from './item.interface'
import styled from 'styled-components'

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  font-family: ${(props) => props.theme.fonts.body};
`

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1rem;
  text-align: justify;
  color: ${(props) => props.theme.colors.primary};
`

const Title = styled.span`
  font-size: 11px;
  color: ${(props) => props.theme.colors.secondary};
`

const Value = styled.span`
  font-size: 14px;
`

const TopicDetails = ({ item }: { item: Item }) => {
  return (
    <Container>
      {item.details?.map((detail, i) => (
        <DetailContainer key={i}>
          <Title>{detail.title.toUpperCase()}</Title>
          <Value>{detail.value}</Value>
        </DetailContainer>
      ))}
    </Container>
  )
}

export default TopicDetails
