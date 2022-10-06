import { motion } from "framer-motion";
import { FC } from "react";
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

interface NavbarProps {}
const Navbar: FC<NavbarProps> = () => (
  <StyledNavbar variants={container} initial="hidden" animate="show">
    <NavbarLogo />

    {links.map((link, i) => (
      <motion.div variants={item}>
        <NavbarItem key={i} link={link} />
      </motion.div>
    ))}
  </StyledNavbar>
);
export default Navbar;
