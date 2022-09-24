import React, { FC } from "react";
import { motion } from "framer-motion";
import { Project } from "./Project";

import {
  TileContainer,
  SubTitleContainer,
  CardContentContainer,
  Overlay,
  ContentContainer,
  CardContent,
  CardImageContainer,
  TileCloseButton,
} from "./TileStyles";

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
  const isSmallDisplay = window.innerWidth < 768;

  return (
    <>
      {!isSmallDisplay && (
        <Overlay
          onClick={() => clearProjectSelection()}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          transition={{ duration: 0.2, delay: 0.15 }}
          style={{ pointerEvents: "auto" }}
        />
      )}
      <CardContentContainer className="expanded">
        <CardContent className="expanded" layoutId={`card-container-${id}`}>
          <CardImageContainer
            className="expanded"
            layoutId={`card-image-container-${id}`}
          >
            <img
              className="card-image"
              src={images[0]}
              alt=""
              draggable={false}
            />
          </CardImageContainer>
          <TileContainer layoutId={`title-container-${id}`}>
            <h2>{title}</h2>
            <SubTitleContainer>{subtitle}</SubTitleContainer>
            <ContentContainer animate>{description}</ContentContainer>
          </TileContainer>

          {isSmallDisplay && (
            <TileCloseButton onClick={() => clearProjectSelection()}>
              X helloooo
            </TileCloseButton>
          )}
        </CardContent>
      </CardContentContainer>
    </>
  );
};

export default ProjectExpandedTile;
