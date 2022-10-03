import { AnimatePresence, motion } from "framer-motion";
import { FC, useEffect, useState } from "react";
import { useScreenSize } from "../helpers";
import { links } from "./navbarData";
import NavbarItem from "./NavbarItem";
import NavbarLogo from "./NavbarLogo";
import { StyledNavbar } from "./styled";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

interface NavbarProps {
  showLogo: boolean;
}
const Navbar: FC<NavbarProps> = ({ showLogo }) => {
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setShowNavbar(true);
    }, 3700);
  }, []);

  return (
    <>
      {showNavbar && (
        <StyledNavbar variants={container} initial="hidden" animate="show">
          <NavbarLogo showLogo={showLogo} />

          {links.map((link, i) => (
            <motion.div variants={item}>
              <NavbarItem key={i} link={link} />
            </motion.div>
          ))}
        </StyledNavbar>
      )}
    </>
  );
};
export default Navbar;
