import styled from "styled-components";
import { motion } from "framer-motion";

export const Overlay = styled(motion.div)`
  z-index: 1;
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  will-change: opacity;
  top: 0;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
`;

export const CardContentContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: block;
  pointer-events: none;
  border-radius: 20px;

  &.expanded {
    z-index: 2;
    position: fixed;
    top: 0;
    bottom: 0;
    max-width: 700px;
    overflow: hidden;
    pointer-events: none;

    @media (min-width: 700px) {
      left: 50%;
      transform: translateX(-50%);
    }
  }
`;

export const CardContent = styled(motion.div)`
  z-index: 5;
  position: block;
  width: auto;
  border-radius: 20px;
  background: #ffffff;
  overflow: hidden;
  height: 10rem;

  box-shadow: 0px 0px 10px rgba(255, 255, 255, 0.9);

  &.expanded {
    height: 100vh;
  }
`;

export const CardImageContainer = styled(motion.div)`
  width: 100%;
  overflow: hidden;
  object-fit: contain;

  > img {
    width: inherit;
    position: relative;
    object-fit: contain;
  }

  &.expanded {
    height: 20rem;
  }
`;

export const TileContainer = styled(motion.div)`
  color: black;
  position: relative;
  z-index: 2;
`;

export const ContentContainer = styled(motion.div)`
  color: black;
  position: relative;
  z-index: 2;
`;

export const TileCloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
`;
