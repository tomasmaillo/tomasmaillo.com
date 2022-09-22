import React from "react";
import ReactDOM from "react-dom/client";
import { Loader } from "@react-three/drei";

import "./index.css";
import Title from "./Title";
import Grain from "./Grain";
import Navbar from "./Navbar";
import Avatar from "./Avatar";
import { Projects } from "./Projects";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Grain />
    <Navbar />

    <Title text="Tomas" />
    <Avatar />

    <Projects />

    <Loader />
  </React.StrictMode>
);
