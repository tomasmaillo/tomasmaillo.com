import { FC } from "react";
import styled from "styled-components";
// TODO: Type are similar to values
import { Project } from "../Project";
import ProjectTile from "./ProjectTile";

const ProjectListWrapper = styled.div`
  padding-top: 32px;
  max-width: 768px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
  padding: 64px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProjectTileWrapper = styled.div`
  cursor: pointer;
`;

interface ProjectListProps {
  projects: Project[];
  setSelectedTile: (project: Project) => void;
}
const ProjectList: FC<ProjectListProps> = ({ projects, setSelectedTile }) => {
  return (
    <ProjectListWrapper>
      {projects.map((project) => (
        <ProjectTileWrapper onClick={() => setSelectedTile(project)}>
          <ProjectTile key={project.id} {...project} />
        </ProjectTileWrapper>
      ))}
    </ProjectListWrapper>
  );
};

export default ProjectList;
