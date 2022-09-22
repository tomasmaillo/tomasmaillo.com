import styled from "styled-components";
import { motion } from "framer-motion";
import { FC, useState } from "react";
import { Project } from "../Project";
import { CardContent, CardImageContainer, TileContainer } from "../TileStyles";

// const ProjectTileWrapper = styled(motion.div)`
//   position: relative;
//   border: 1px solid black;
//   border-radius: 16px;
//   padding: 8px;
//   background-color: #eeeeee99;
// `;

const ProjectTile: FC<Project> = ({ id, title, images }) => {
  return (
    <CardContent layoutId={`card-container-${id}`}>
      <CardImageContainer layoutId={`card-image-container-${id}`}>
        <img className="card-image" src={images[0]} alt="" draggable={false} />
      </CardImageContainer>
      <TileContainer layoutId={`title-container-${id}`}>
        <h2>{title}</h2>
      </TileContainer>
    </CardContent>
  );
};

export default ProjectTile;
