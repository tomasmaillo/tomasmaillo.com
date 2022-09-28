import { motion } from "framer-motion";
import { FC } from "react";
import styled from "styled-components";
import { SMALL_SCREEN_WIDTH_PX } from "../../helpers";
// TODO: Type are similar to values
import { Project } from "../Project";
import ProjectTile from "./ProjectTile";

const ProjectListWrapper = styled(motion.div)`
  max-width: ${SMALL_SCREEN_WIDTH_PX};
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 2rem;
  padding: 32px;

  @media (max-width: ${SMALL_SCREEN_WIDTH_PX}) {
    grid-template-columns: 1fr;
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
  setSelectedTile: (project: Project) => void;
}
const ProjectList: FC<ProjectListProps> = ({ projects, setSelectedTile }) => {
  return (
    <ProjectListWrapper variants={container} initial="hidden" animate="show">
      {projects.map((project) => (
        <ProjectTileWrapper
          variants={item}
          onClick={() => setSelectedTile(project)}
        >
          <ProjectTile key={project.id} {...project} />
        </ProjectTileWrapper>
      ))}
    </ProjectListWrapper>
  );
};

export default ProjectList;
