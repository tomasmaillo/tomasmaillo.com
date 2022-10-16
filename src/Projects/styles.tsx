import styled from "styled-components";
import { motion } from "framer-motion";
import { SMALL_SCREEN_WIDTH_PX } from "../helpers";

export const Overlay = styled(motion.div)`
  z-index: 1;
  position: fixed;
  background: rgba(0, 0, 0, 0.5);
  will-change: opacity;
  top: 0;
  bottom: 0;
  width: 100vw;
  height: 500vh;
`;
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

  /* really thin screen iamge support */

  > h1 {
    transition: 0.5s;
    color: black;
    font-size: 1.5rem;
    margin-left: 1rem;
    position: fixed;
    z-index: 2;
  }

  > img {
    transition: 0.5s;
    width: inherit;
    position: relative;
    object-fit: contain;
  }

  &.expanded {
    height: 20rem;
  }
`;

export const ContentWrapper = styled(motion.div)`
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

export const ContentContainer = styled(motion.div)`
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
