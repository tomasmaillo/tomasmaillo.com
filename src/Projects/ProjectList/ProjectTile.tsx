import { FC } from "react";
import { Project } from "../Project";
import { CardContent, CardImageContainer, ContentWrapper } from "../styles";
import { imageSrc } from "../projectsData";

const ProjectTile: FC<Project> = ({ id, images }) => (
  <CardContent layoutId={`card-container-${id}`}>
    <CardImageContainer layoutId={`card-image-container-${id}`}>
      <img
        className="card-image"
        src={imageSrc + images[0]}
        alt=""
        draggable={false}
      />
    </CardImageContainer>
  </CardContent>
);

export default ProjectTile;
