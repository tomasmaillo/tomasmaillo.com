import React from "react";
import ReactDOM from "react-dom/client";
import { Loader } from "@react-three/drei";

import "./index.css";
import { AvatarCanvas } from "./AvatarCanvas";
import Grain from "./Grain";
import { Navbar } from "./Navbar";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <AvatarCanvas />

    <Grain />
  </React.StrictMode>
);
