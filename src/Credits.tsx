import React from 'react'
import {
  PeopleLink,
  STAN_FLINT,
  CRIS_MAILLO,
  RUSSELL_COOK,
  PAULINA_GERCHUK,
} from './peopleLinks'
import styled from 'styled-components'

const StyledCreditsContainer = styled.div`
  bottom: 0;
  left: 0;
  z-index: 10000;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.card};
  border: 1px solid ${(props) => props.theme.colors.border};
  color: ${(props) => props.theme.colors.primary};
  padding: 15px;
  backdrop-filter: blur(3px);
`

const StyledCreditsContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 0.5rem;
  text-align: left;
  font-size: 16px;
`

const people = [STAN_FLINT, CRIS_MAILLO, RUSSELL_COOK, PAULINA_GERCHUK]

const Credits = () => {
  const renderPeopleLinks = () => {
    return people.map((person, index) => (
      <React.Fragment key={index}>
        <PeopleLink person={person} />
        {index < people.length - 1 && ', '}
      </React.Fragment>
    ))
  }

  return (
    <StyledCreditsContainer>
      <StyledCreditsContent>
        <span>Credit to the people that made this possible:</span>
        <span>{renderPeopleLinks()}</span>
      </StyledCreditsContent>
    </StyledCreditsContainer>
  )
}

export default Credits
