import React from "react";
import ReactDOM from "react-dom/client";
import { Loader } from "@react-three/drei";

import "./index.css";
import { AvatarCanvas } from "./AvatarCanvas";
import Grain from "./Grain";
import { Projects } from "./Projects";
import Navbar from "./Navbar/Navbar";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* <Title text="Tomas" /> */}

    {/* <AvatarCanvas /> */}

    <Navbar />
    <Grain />
    <Projects />

    <Loader />
  </React.StrictMode>
);
