import React, { FC } from "react";
import { motion } from "framer-motion";
import { Project } from "./Project";

import {
  ContentWrapper,
  SubTitleContainer,
  CardContentContainer,
  Overlay,
  ContentContainer,
  CardContent,
  CardImageContainer,
  TitleContainer,
} from "./styles";
import { useScreenSize } from "../helpers";
import { imageSrc } from "./projectsData";

interface ProjectExpandedTileProps extends Project {
  clearProjectSelection: () => void;
}

const ProjectExpandedTile: FC<ProjectExpandedTileProps> = ({
  id,
  title,
  subtitle,
  description,
  images,
  clearProjectSelection,
}) => {
  const [isSmallScreen] = useScreenSize();

  return (
    <>
      <Overlay
        onClick={() => clearProjectSelection()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
        transition={{ duration: 0.2, delay: 0.15 }}
        style={{ pointerEvents: "auto" }}
      />
      <CardContentContainer className="expanded">
        <CardContent className="expanded" layoutId={`card-container-${id}`}>
          <CardImageContainer
            className="expanded"
            layoutId={`card-image-container-${id}`}
          >
            <img
              className="card-image"
              src={imageSrc + images[0]}
              alt=""
              draggable={false}
            />
          </CardImageContainer>

          <ContentWrapper layoutId={`title-container-${id}`}>
            <TitleContainer>{title}</TitleContainer>
            <SubTitleContainer>{subtitle}</SubTitleContainer>
            <ContentContainer animate>{description}</ContentContainer>
          </ContentWrapper>

          {/* {isSmallScreen && (
            <TileCloseButton onClick={() => clearProjectSelection()} />
          )} */}
        </CardContent>
      </CardContentContainer>
    </>
  );
};

export default ProjectExpandedTile;
