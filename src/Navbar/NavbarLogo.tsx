import { AnimatePresence, motion } from "framer-motion";
import React, { FC } from "react";

import { useScreenSize } from "../helpers";

const NavbarLogo: FC<{ showLogo: boolean }> = ({ showLogo }) => {
  const [isSmallScreen] = useScreenSize();

  return (
    <div style={{ position: "relative", paddingRight: 40 }}>
      <AnimatePresence>
        {(showLogo || isSmallScreen) && (
          <motion.div
            style={{
              opacity: showLogo ? 1 : 0,
              position: "absolute",
              top: -15,
            }}
            initial={{ opacity: 0, left: -90 }}
            animate={{ opacity: 1, left: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <img
              src="/android-chrome-144x144.png"
              style={{ width: 30, height: 30 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NavbarLogo;
