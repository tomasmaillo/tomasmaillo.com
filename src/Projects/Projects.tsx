import React, { FC, useState } from "react";
import styled from "styled-components";
import { Project } from "./Project";
import ProjectExpandedTile from "./ProjectExpandedTile";
import { ProjectList } from "./ProjectList";
import ProjectsData from "./ProjectsData";

const ProjectsWrapper = styled.div``;

const Projects: FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project>();
  const clearSelectedProject = () => setSelectedProject(undefined);

  const imageHasLoaded = true;
  // TODO: image jumps

  // TODO: clearSelectedProject on ESC press

  return (
    <ProjectsWrapper>
      Tingz I've done recently <br />
      {selectedProject?.id && imageHasLoaded && (
        <ProjectExpandedTile
          {...selectedProject}
          clearProjectSelection={clearSelectedProject}
        />
      )}
      <ProjectList
        projects={ProjectsData}
        setSelectedTile={setSelectedProject}
      />
    </ProjectsWrapper>
  );
};

export default Projects;
