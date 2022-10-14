import { FC, useState } from "react";
import { Project } from "../Project";
import {
  CardContent,
  CardImageContainer,
  ContentContainer,
  ContentWrapper,
  SubTitleContainer,
  TitleContainer,
} from "../styles";
import { imageSrc } from "../projectsData";

const ProjectTile: FC<Project & { selected: boolean }> = ({
  title,
  subtitle,
  images,
  description,
  selected,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <CardContent className={selected ? "expanded" : ""}>
      <CardImageContainer>
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
      <ContentWrapper>
        <TitleContainer>{title}</TitleContainer>
        <SubTitleContainer>{subtitle}</SubTitleContainer>
        <ContentContainer animate>{description}</ContentContainer>
      </ContentWrapper>
    </CardContent>
  );
};

export default ProjectTile;
