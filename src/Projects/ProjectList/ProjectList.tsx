import { motion } from "framer-motion";
import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { SMALL_SCREEN_WIDTH_PX, useScreenSize } from "../../helpers";
// TODO: Type are similar to values
import { Project } from "../Project";
import ProjectTile from "./ProjectTile";

const ProjectListColumns = styled.div`
  display: flex;
  flex-direction: row;
  margin: 32px;
  padding: 32px;
  justify-content: start;

  @media (max-width: ${SMALL_SCREEN_WIDTH_PX}) {
    flex-direction: column;
    margin: 0;
  }
`;
const ProjectListColumn = styled(motion.div)`
  max-width: 381px;
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: max-content;
  align-items: flex-start;
  grid-gap: 2rem;
  margin-right: 32px;

  @media (max-width: ${SMALL_SCREEN_WIDTH_PX}) {
    margin: 0;
    margin-bottom: 32px;
  }
`;

const ProjectTileWrapper = styled(motion.div)`
  cursor: pointer;
`;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

interface ProjectListProps {
  projects: Project[];
}
const ProjectList: FC<ProjectListProps> = ({ projects }) => {
  const [selectedTile, setSelectedTile] = useState<Project | undefined>();
  const [isSmallScreen] = useScreenSize();
  const [columnNum, setColumnNum] = useState(2);

  document.addEventListener(
    "keydown",
    (e) => (e.key === "Escape" ? setSelectedTile(undefined) : null),
    false
  );

  return (
    <ProjectListColumns>
      {[...Array(columnNum)].map((_, columnIndex) => (
        <ProjectListColumn variants={container} initial="hidden" animate="show">
          {projects.map((project, projectIndex) => {
            if (projectIndex % columnNum !== columnIndex) return;
            return (
              <ProjectTileWrapper
                variants={item}
                onClick={() =>
                  selectedTile == project
                    ? setSelectedTile(undefined)
                    : setSelectedTile(project)
                }
              >
                <ProjectTile
                  key={project.id}
                  selected={selectedTile == project}
                  {...project}
                />
              </ProjectTileWrapper>
            );
          })}
        </ProjectListColumn>
      ))}
    </ProjectListColumns>
  );
};

export default ProjectList;
