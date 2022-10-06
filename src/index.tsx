import React from "react";
import ReactDOM from "react-dom/client";
import { Loader } from "@react-three/drei";

import "./index.css";
import { AvatarCanvas } from "./AvatarCanvas";
import Grain from "./Grain";
import { Navbar } from "./Navbar";
import { Projects } from "./Projects";
import Gap from "./common/Gap";
import Diagonal from "./Diagonal";

const App = () => {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
  return (
    <>
      <Navbar />
      <Grain />
      <Gap height="50vh" />
      <AvatarCanvas />
      <Projects />

      <Diagonal />
    </>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
