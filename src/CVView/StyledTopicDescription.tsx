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
  padding: 8px 8px;
  margin: 0px 4px;
  width: calc(min(100vw, ${(props) => props.theme.maxWidth})*0.32);
  box-sizing: border-box;

  background: rgba(251, 251, 251, 0.37);
  border: 1px solid #ffffff00;
  border-radius: 7px;

  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);

  text-align: left;
  cursor: pointer;

  transition: border 0.3s;

  visibility: ${(props) => (props.isHidden ? 'hidden' : 'visible')};

  &:hover {
    border: 1px solid #e3e3e3;
  }
`

export default StyledTopicDescription
