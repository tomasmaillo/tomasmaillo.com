import { motion } from "framer-motion";
import styled from "styled-components";
import { SMALL_SCREEN_WIDTH_PX } from "../helpers";

export const StyledNavbar = styled(motion.div)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 100%;
  z-index: 1;

  box-sizing: content-box;

  background: rgba(255, 255, 255, 0.01);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 0.1px solid rgba(255, 255, 255, 0.3);
  border-top: none;
`;

export const StyledNavbarItem = styled(motion.div)`
  color: black;
  padding: 16px;
  text-decoration: none;
  margin: 0px 4px 0px 4px;
  transition: 0.5s;

  @media (max-width: ${SMALL_SCREEN_WIDTH_PX}) {
    padding: 12px;
    margin: 0px 2px 0px 2px;
  }
  &:hover {
    margin: 0px 12px 0px 12px;
  }
`;

export const StyledLinkPreview = styled(motion.div)`
  position: fixed;
  top: 50px;
  transform: translateX(-100px);
  overflow: hidden;

  > img {
    max-width: 30vw;
    height: 100%;
    max-height: 40vh;
    object-fit: cover;
  }

  > video {
    width: 100%;
    max-width: 30vw;
    max-height: 40vh;
    object-fit: cover;
  }
`;

export const StyledNavbarLink = styled(motion.a)`
  color: black;
  text-decoration: none;
  margin: 0px 8px 0px 8px;
  transition: 0.5s;
  &:hover {
    text-decoration: underline;
  }
`;
