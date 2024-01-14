// This component is used to style the TopicDescription component.
// It is both used on the left and on the right side of the screen. (when focused)
// It is unified here to set the same width on all sides.

import { motion } from 'framer-motion'
import styled from 'styled-components'

// Define the interface for the component props
interface StyledTopicDescriptionProps {
  isHidden: boolean
}

var transition = {
  type: 'spring',
  stiffness: 50,
  damping: 12,
  duration: 0.1,
}

const StyledTopicDescription = styled(motion.div).attrs({
  transition: transition,
})<StyledTopicDescriptionProps>`
  font-size: 14px;
  padding: 4px 8px;
  margin: 0px 4px;
  width: calc(min(100vw, ${(props) => props.theme.maxWidth}) * 0.32);
  box-sizing: border-box;

  border: 1px solid #ffffff00;
  border-radius: 7px;

  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  display: flex;
  flex-direction: column;
  gap: 2px;

  color: ${(props) => props.theme.colors.primary};
  text-align: left;
  cursor: pointer;

  transition: border 0.3s;

  visibility: ${(props) => (props.isHidden ? 'hidden' : 'visible')};

  mix-blend-mode: difference;

  &:hover {
    &::before {
      opacity: 1;
      transform: scale(1);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    border-radius: 7px;

    border: 1px solid ${(props) => props.theme.colors.borderInverse}33;
    opacity: 0;

    transform: scale(0.975);

    transition: 0.2s;
  }
`

export default StyledTopicDescription
