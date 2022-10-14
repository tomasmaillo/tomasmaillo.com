import { Project } from "./Project";

export const imageSrc = "./projectImages";

export const projects: Project[] = [
  {
    id: "spotify",
    title: "Spotify",
    subtitle: "Summer of 2022: June - September",
    description: (
      <>
        Worked on a team of 3 to deliver an internal web hub to unify teams and
        direct missions <br /> <br /> Overall a stupidly amazing experience!
        Looking forwards for the next one :D
      </>
    ),
    images: ["/spotify.gif"],
  },
  {
    id: "btcglobe",
    title: "BTC Globe",
    subtitle: "Early 2021",
    description: (
      <>
        What if you could see BitCoin transactions on a globe? Realtime(ish)?
        Thats what I attempted
        <br />
        <br />{" "}
        <a href="https://btcglobe.tomasmaillo.com/" target="_blank">
          https://btcglobe.tomasmaillo.com/
        </a>
      </>
    ),
    images: ["/btcglobe.gif"],
  },
  {
    id: "boat",
    title: "Boat",
    subtitle: "Summer of 2022: June - September",
    description: (
      <>
        So I woke up one morning and thought: "What if my portfolio site was a
        mini game where you would sail and find try to find my projects?" <br />
        <br /> Did I finish it? Nope, but some mechanics are here!
        <a href="https://dev3d.netlify.app/" target="_blank">
          https://dev3d.netlify.app/
        </a>
      </>
    ),
    images: ["/boat.gif"],
  },
  {
    id: "blankets",
    title: "Blankets",
    subtitle: "I cant remeber when this happened :D",
    description: (
      <>
        This TikToker was posting about these blankets that she would knit with
        different colors depending on the peak temperature of that day. <br />{" "}
        <br /> I made that, but 3D{" "}
        <a
          href="https://mystifying-lumiere-22fd64.netlify.app/"
          target="_blank"
        >
          https://mystifying-lumiere-22fd64.netlify.app/
        </a>{" "}
      </>
    ),
    images: ["/blankets.gif"],
  },
  {
    id: "students",
    title: "Students Archive",
    subtitle: "2020-2021",
    description: (
      <>
        Made an archive for my school's magazine! (Until they decided not to
        cover domain name costs :D) <br /> <br />{" "}
        <a href="https://mag.tomasmaillo.com/" target="_blank">
          https://mag.tomasmaillo.com/
        </a>
      </>
    ),
    images: ["/students.gif"],
  },
];
