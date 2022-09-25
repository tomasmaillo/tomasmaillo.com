import React, { FC, useState } from "react";
import styled from "styled-components";
import { Project } from "./Project";
import ProjectExpandedTile from "./ProjectExpandedTile";
import { ProjectList } from "./ProjectList";
import { projects } from "./projectsData";

const Projects: FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project>();
  const clearSelectedProject = () => setSelectedProject(undefined);
  document.addEventListener(
    "keydown",
    (e) => (e.key === "Escape" ? clearSelectedProject() : null),
    false
  );

  const imageHasLoaded = true;
  // TODO: image jumps

  return (
    <>
      {selectedProject?.id && imageHasLoaded && (
        <ProjectExpandedTile
          {...selectedProject}
          clearProjectSelection={clearSelectedProject}
        />
      )}
      <ProjectList projects={projects} setSelectedTile={setSelectedProject} />
    </>
  );
};

export default Projects;
