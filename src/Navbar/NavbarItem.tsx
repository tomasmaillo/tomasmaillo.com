import { AnimatePresence } from "framer-motion";
import { FC, useState } from "react";
import { useScreenSize } from "../helpers";
import { Link } from "./navbarData";
import {
  StyledNavbarItem,
  StyledNavbarLink,
  StyledLinkPreview,
} from "./styled";

interface NavbarItemProps {
  link: Link;
}
const NavbarItem: FC<NavbarItemProps> = ({ link }) => {
  const [isSmallScreen] = useScreenSize();
  const [showPreview, setShowPreview] = useState(false);
  const [mediaLoaded, setMediaLoaded] = useState(false);

  const { text, url, preview } = link;

  return (
    <StyledNavbarItem>
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

export default NavbarItem;
