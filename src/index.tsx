import React from "react";
import ReactDOM from "react-dom/client";
import { Loader } from "@react-three/drei";

import "./index.css";
import { AvatarCanvas } from "./AvatarCanvas";
import Grain from "./Grain";
import { Navbar } from "./Navbar";

const App = () => {
  const [showLogo, setShowLogo] = React.useState(false);
  return (
    <>
      <Navbar showLogo={showLogo} />
      <AvatarCanvas setShowLogo={setShowLogo} />
      <Grain />
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
