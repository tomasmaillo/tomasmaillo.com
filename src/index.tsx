import React from "react";
import ReactDOM from "react-dom/client";
import { Loader } from "@react-three/drei";

import "./index.css";
import Title from "./Title";
import Grain from "./Grain";
import Navbar from "./Navbar";
import Avatar from "./Avatar";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <Navbar />
    <Title text="Tomas" />
    <Grain />
    <Avatar />
    <Loader />
  </React.StrictMode>
);
