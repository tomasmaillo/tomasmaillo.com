import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { Loader } from "@react-three/drei";

import "./index.css";
import { AvatarCanvas } from "./AvatarCanvas";
import Grain from "./Grain";
import { Navbar } from "./Navbar";
import { Projects } from "./Projects";
import Gap from "./common/Gap";
import Diagonal from "./Diagonal";
import { useScreenSize } from "./helpers";

const App = () => {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  const [isSmallScreen] = useScreenSize();

  const [showNavbar, setShowNavbar] = useState(false);
  const [showHtml, setShowHtml] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowNavbar(true), 3700);
    setTimeout(() => setShowHtml(true), 4000);
  }, []);

  return (
    <>
      {showNavbar && <Navbar />}
      <Grain />
      <AvatarCanvas />
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
