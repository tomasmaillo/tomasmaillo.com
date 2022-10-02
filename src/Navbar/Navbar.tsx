import { AnimatePresence, motion } from "framer-motion";
import { FC, SetStateAction, useEffect, useState } from "react";
import { useScreenSize } from "../helpers";
import { links, Link } from "./navbarData";
import {
  StyledLinkPreview,
  StyledNavbar,
  StyledNavbarItem,
  StyledNavbarLink,
} from "./styled";

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
interface NavbarItemProps {
  link: Link;
}
const NavbarItem: FC<NavbarItemProps> = ({ link }) => {
  const [isSmallScreen] = useScreenSize();
  const [showPreview, setShowPreview] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);

  const { text, url, preview } = link;

  return (
    <StyledNavbarItem variants={item}>
      <StyledNavbarLink
        href={url}
        target="_blank"
        onHoverStart={() => setShowPreview(true)}
        onHoverEnd={() => setShowPreview(false)}
      >
        {isSmallScreen ? text.small : text.default}
      </StyledNavbarLink>
      <AnimatePresence>
        {showPreview && preview && !isSmallScreen && (
          <StyledLinkPreview
            style={{ opacity: mediaLoaded ? 1 : 0 }}
            initial={{ opacity: 0, top: 60 }}
            animate={{ opacity: 1, top: 50 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
          >
            {preview.isVideo ? (
              <video autoPlay loop muted onLoad={() => setMediaLoaded(true)}>
                <source src={preview.url} type="video/mp4" />
              </video>
            ) : (
              <img onLoad={() => setMediaLoaded(true)} src={preview.url} />
            )}
          </StyledLinkPreview>
        )}
      </AnimatePresence>
    </StyledNavbarItem>
  );
};

interface NavbarProps {
  showLogo: boolean;
}
const Navbar: FC<NavbarProps> = ({ showLogo }) => {
  const [scroll, setScroll] = useState(0);

  const [isSmallScreen] = useScreenSize();

  useEffect(() => {
    const onScroll = (e: any) => {
      setScroll(e.target.documentElement.scrollTop);
    };
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <StyledNavbar variants={container} initial="hidden" animate="show">
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

      {links.map((link, i) => (
        <NavbarItem key={i} link={link} />
      ))}
    </StyledNavbar>
  );
};
export default Navbar;
