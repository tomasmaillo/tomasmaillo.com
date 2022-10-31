import React, { FC, useState } from "react";
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
  media,
  description,
  selected,
}) => {
  const [hasLoaded, setHasLoaded] = useState(false);

  return (
    <CardContent className={selected ? "expanded" : ""}>
      <CardImageContainer>
        <h3 style={{ opacity: hasLoaded ? "0" : "100" }}>
          {`<video>${imageSrc + media}</video>`}
        </h3>
        <video
          autoPlay={true}
          muted
          loop
          controls={false}
          playsInline
          style={{ opacity: hasLoaded ? "100" : "0" }}
          onLoadedData={() => setHasLoaded(true)}
        >
          <source src={imageSrc + media} type="video/mp4" />
        </video>
      </CardImageContainer>
      <ContentWrapper>
        <TitleContainer>{title}</TitleContainer>
        <SubTitleContainer>{subtitle}</SubTitleContainer>
        <ContentContainer>{description}</ContentContainer>
      </ContentWrapper>
    </CardContent>
  );
};

export default ProjectTile;
