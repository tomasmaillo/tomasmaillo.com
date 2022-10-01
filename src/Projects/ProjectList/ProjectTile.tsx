import { FC, useState } from "react";
import { Project } from "../Project";
import { CardContent, CardImageContainer, ContentWrapper } from "../styles";
import { imageSrc } from "../projectsData";

const ProjectTile: FC<Project> = ({ id, title, images }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <CardContent layoutId={`card-container-${id}`}>
      <CardImageContainer layoutId={`card-image-container-${id}`}>
        <h1 style={{ opacity: !imageLoaded ? 1 : 0 }}>{title}</h1>
        <img
          style={{ opacity: imageLoaded ? 1 : 0 }}
          className="card-image"
          src={imageSrc + images[0]}
          alt=""
          draggable={false}
          onLoad={() => setImageLoaded(true)}
        />
      </CardImageContainer>
    </CardContent>
  );
};

export default ProjectTile;
