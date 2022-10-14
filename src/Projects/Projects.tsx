import React, { FC, useState } from "react";
import { ProjectList } from "./ProjectList";
import { projects } from "./projectsData";

const Projects: FC = () => <ProjectList projects={projects} />;

export default Projects;
