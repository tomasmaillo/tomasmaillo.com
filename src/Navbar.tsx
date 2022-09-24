import styled from "styled-components";

const StyledNavbar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: #fffaeb;
  position: absolute;
  width: 100%;
  z-index: 1;

  box-sizing: content-box;
  border-width: 0px 0px 2px 0px;

  border-style: solid;
  border-image: linear-gradient(to right, #435cec, #a053df);
  border-image-slice: 1;
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

type Link = {
  text: string;
  url: string;
};

const links: Link[] = [
  { text: "GitHub", url: "https://github.com/Tomasroma64" },
  { text: "Instagram", url: "https://instagram.com/tomasmaillo" },
  { text: "Twitch", url: "https://twitch.tv/tomasmaillo" },
  { text: "TikTok", url: "https://www.tiktok.com/@tomascodes" },
];

const Navbar = () => {
  return (
    <StyledNavbar>
      {links.map(({ text, url }) => (
        <StyledNavbarItem href={url} target="_blank">
          {text}
        </StyledNavbarItem>
      ))}
    </StyledNavbar>
  );
};
export default Navbar;
