import { FC, useState } from "react";
import styled from "styled-components";
import { SMALL_SCREEN_WIDTH_PX, useScreenSize } from "../../helpers";
// TODO: Type are similar to values
import { Project } from "../Project";
import ProjectTile from "./ProjectTile";

const ProjectListWrapper = styled.div`
  margin: 32px;
  padding: 32px;

  > p {
    margin-bottom: 32px;
  }

  @media (max-width: ${SMALL_SCREEN_WIDTH_PX}) {
    margin: 0;
  }
`;

const ProjectListColumns = styled.div<{
  projectsNum: number;
  isSmallScreen: boolean;
}>`
  display: flex;
  flex-direction: row;
  justify-content: start;
  user-select: none;
  // prettier-ignore
  height: calc( ${({ projectsNum, isSmallScreen }) =>
    isSmallScreen ? projectsNum * 1.8 : projectsNum * 1.05} * 8rem);

  @media (max-width: ${SMALL_SCREEN_WIDTH_PX}) {
    flex-direction: column;
    margin: 0;
  }
`;
const ProjectListColumn = styled.div`
  max-width: 381px;
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: max-content;
  align-items: flex-start;
  grid-gap: 2rem;
  margin-right: 32px;

  @media (max-width: ${SMALL_SCREEN_WIDTH_PX}) {
    margin: auto;
    margin-bottom: 32px;
  }
`;

// const container = {
//   hidden: { opacity: 0 },
//   show: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.05,
//     },
//   },
// };

// const item = {
//   hidden: { opacity: 0 },
//   show: { opacity: 1 },
// };

interface ProjectListProps {
  projects: Project[];
}
const ProjectList: FC<ProjectListProps> = ({ projects }) => {
  const [selectedTile, setSelectedTile] = useState<Project>(projects[0]);
  const columnNum = 2;
  const [isSmallScreen] = useScreenSize();

  return (
    <ProjectListWrapper>
      <p>Some of my latest achievements: </p>
      <ProjectListColumns
        projectsNum={projects.length}
        isSmallScreen={isSmallScreen}
      >
        {[...Array(2)].map((_, columnIndex) => (
          <ProjectListColumn>
            {projects.map((project, projectIndex) => {
              if (projectIndex % columnNum !== columnIndex) return;
              return (
                <div
                  style={{
                    cursor: selectedTile != project ? "pointer" : "auto",
                  }}
                  onClick={() =>
                    selectedTile != project && setSelectedTile(project)
                  }
                >
                  <ProjectTile
                    key={project.id}
                    selected={selectedTile == project}
                    {...project}
                  />
                </div>
              );
            })}
          </ProjectListColumn>
        ))}
      </ProjectListColumns>
    </ProjectListWrapper>
  );
};

export default ProjectList;
