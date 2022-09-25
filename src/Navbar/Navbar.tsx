import { useScreenSize } from "../helpers";
import { links } from "./navbarData";
import { StyledNavbar, StyledNavbarItem } from "./styled";

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

const Navbar = () => {
  const isSmallScreen = useScreenSize();
  return (
    <StyledNavbar variants={container} initial="hidden" animate="show">
      {links.map(({ text, url }) => (
        <StyledNavbarItem variants={item} href={url} target="_blank">
          {isSmallScreen ? text.default : text.small}
        </StyledNavbarItem>
      ))}
    </StyledNavbar>
  );
};
export default Navbar;
