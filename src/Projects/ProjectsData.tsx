import { Project } from "./Project";

const projects: Project[] = [
  {
    id: "spotify",
    title: "Spotify",
    description: (
      <>
        this is the description <br /> something else{" "}
        <a style={{ color: "red" }}> jaksdflk</a>
      </>
    ),
    images: ["./spotify.jpg"],
  },
  {
    id: "hdsfi",
    title: "ttl",
    description: "dfsdf",
    images: ["./pic.png"],
  },
  {
    id: "ellu",
    title: "ttl",
    description: "dfsdf",
    images: ["./pic.png"],
  },
];

export default projects;
