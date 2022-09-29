import { motion } from "framer-motion";
import styled from "styled-components";

export const StyledNavbar = styled(motion.div)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #fffaeb;
  position: absolute;
  width: 100%;
  z-index: 1;

  box-sizing: content-box;
  border-width: 0px 0px 2px 0px;

  border-style: solid;
  border-image: linear-gradient(to right, #435cec, #a053df);
  border-image-slice: 1;
`;

export const StyledNavbarItem = styled(motion.div)`
  color: black;
  padding: 16px;
  text-decoration: none;
  margin: 0px 8px 0px 8px;
  transition: 0.5s;
  background: #fffaeb;
`;

export const StyledLinkPreview = styled(motion.div)`
  position: fixed;
  top: 50px;

  transform: translateX(-100px);
  overflow: hidden;

  > img {
    max-width: 30vw;
    height: 100%;
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
