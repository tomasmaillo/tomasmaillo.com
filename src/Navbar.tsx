import styled from "styled-components";

const StyledNavbar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0.6rem;
  background-color: #fffaeb;
  border-bottom: 0.5px solid black;
  position: absolute;
  width: 100%;
  z-index: 100;
`;

const StyledNavbarItem = styled.a`
  color: black;
  margin: 0.5rem;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Navbar = () => {
  return (
    <StyledNavbar>
      <StyledNavbarItem href="https://github.com/Tomasroma64">
        GitHub
      </StyledNavbarItem>
      <StyledNavbarItem href="https://instagram.com/tomasmaillo">
        Instagram
      </StyledNavbarItem>
      <StyledNavbarItem href="https://www.twitch.tv/tomasmaillo">
        Twitch
      </StyledNavbarItem>
      <StyledNavbarItem href="https://www.tiktok.com/@tomascodes">
        TikTok
      </StyledNavbarItem>
    </StyledNavbar>
  );
};
export default Navbar;
