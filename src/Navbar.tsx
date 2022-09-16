import styled from "styled-components";

const StyledNavbar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #fffaeb;
  border-bottom: 0.5px solid black;
  position: absolute;
  width: 100%;
  z-index: 100;
`;

const StyledNavbarItem = styled.a`
  color: black;
  padding: 16px;
  text-decoration: none;
  margin: 0px 8px 0px 8px;
  transition: 0.5s;
  background: #fffaeb;

  &:hover {
    background: hsla(185, 90%, 51%, 1);

    background: radial-gradient(
      circle,
      hsla(185, 90%, 51%, 1) 0%,
      hsla(45, 100%, 96%, 1) 53%
    );
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
