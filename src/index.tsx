import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import { AvatarCanvas } from "./AvatarCanvas";
import Grain from "./Grain";
import { Navbar } from "./Navbar";

const App = () => {
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  navigator.serviceWorker.register("/serviceWorker.js");

  // Using React context to pass showLogo down is not possible as
  // R3F and React are using two different render-roots :(
  // https://github.com/pmndrs/react-three-fiber/issues/262
  const [showLogo, setShowLogo] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowNavbar(true), 3700);
  }, []);

  return (
    <>
      {showNavbar && <Navbar showLogo={showLogo} />}
      <Grain />
      <AvatarCanvas setShowLogo={setShowLogo} />
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
