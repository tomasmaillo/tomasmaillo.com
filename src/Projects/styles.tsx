import styled from "styled-components";
import { motion } from "framer-motion";
import { SMALL_SCREEN_WIDTH_PX } from "../helpers";

export const CardContentContainer = styled(motion.div)`
  width: 100%;
  height: 90%;

  &.expanded {
    z-index: 2;
    position: fixed;
    max-width: ${SMALL_SCREEN_WIDTH_PX};
    overflow: hidden;

    @media (min-width: ${SMALL_SCREEN_WIDTH_PX}) {
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }

    @media (max-width: ${SMALL_SCREEN_WIDTH_PX}) {
      bottom: 0;
    }
  }
`;

export const CardContent = styled.div`
  z-index: 5;
  position: block;
  width: auto;

  border-radius: 20px;
  border-collapse: separate;
  background: #ffffff;
  overflow: hidden;
  height: 10rem;
  transition: 0.3s;

  // Fixes random safari bug with border-radius over canvas
  transform: translateZ(0);

  &.expanded {
    height: 23rem;
    transform: scale(1.1);
    box-shadow: #c6c6c6 2px 0px 10px;
  }
`;

export const CardImageContainer = styled.div`
  width: 100%;
  overflow: hidden;
  object-fit: contain;
  max-height: 10rem;

  > h3 {
    position: fixed;
    font-size: 0.8rem;
    transition: 0.5s;
    color: black;
    top: 7vh;
    left: 50%;
    transform: translateX(-50%);
    position: fixed;
    z-index: 5;
  }

  > video {
    transition: 0.5s;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 10;
  }

  &.expanded {
    height: 20rem;
  }
`;

export const ContentWrapper = styled.div`
  color: black;
  position: relative;
  z-index: 2;
  padding-left: 1rem;
  user-select: text;
`;

export const TitleContainer = styled.h2`
  margin-bottom: 2px;
`;

export const SubTitleContainer = styled.div`
  font-style: italic;
  margin-bottom: 12px;
`;

export const ContentContainer = styled.div`
  color: black;
  position: relative;
  z-index: 2;
`;

export const TileCloseButton = styled.div`
  position: absolute;
  width: 30px;
  height: 30px;
  background-color: white;
  cursor: pointer;
  border-radius: 50%;
  top: 10px;
  right: 10px;

  &:after {
    display: inline-block;
    content: "\00d7"; /* This will render the 'X' */
  }
`;
