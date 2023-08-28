import { Project } from './Project'

export const imageSrc = './projectImages'

export const projects: Project[] = [
  {
    id: 'vibe-check',
    title: 'vibe-check',
    subtitle: 'March 2023 - Present',
    description: (
      <>
        Co-founded{' '}
        <a href="https://vibe-check.app/" target="_blank">
          vibe-check.app
        </a>{' '}
        with one other developer. Real-time feedback in lectures at
        universities! <br />
        <br /> Under construction!
      </>
    ),
    media: '/vibe-check.mp4',
  },
  {
    id: 'spotify',
    title: 'Spotify',
    subtitle: 'Summer of 2022: June - September',
    description: (
      <>
        Worked on a team of 3 to deliver an internal web hub to unify teams and
        direct missions <br /> <br /> Overall a stupidly amazing experience!
        Looking forward for the next one :D
      </>
    ),
    media: '/spotify.mp4',
  },
  {
    id: 'tomasmaillo',
    title: 'tomasmaillo.com',
    subtitle: 'Sept 2022',
    description: (
      <>
        The same page you are looking at right now! Built with React and ThreeJS
        (R3F). Check the{' '}
        <a
          href="https://web.archive.org/web/20220000000000*/tomasmaillo.com"
          target="_blank">
          WayBackMachine
        </a>{' '}
        to see my skill progress <br /> <br />
        Inception moment{' '}
        <a href="https://tomasmaillo.com/" target="_blank">
          https://tomasmaillo.com/
        </a>
      </>
    ),
    media: '/tomasmaillo.mp4',
  },
  {
    id: 'btcglobe',
    title: 'BTC Globe',
    subtitle: 'Early 2021',
    description: (
      <>
        What if you could see BitCoin transactions on a globe? Realtime(ish)?
        That's what I attempted
        <br />
        <br />{' '}
        <a href="https://btcglobe.tomasmaillo.com/" target="_blank">
          https://btcglobe.tomasmaillo.com/
        </a>
      </>
    ),
    media: '/btcglobe.mp4',
  },

  {
    id: 'blankets',
    title: 'Blankets',
    subtitle: "I can't remember when this happened :D",
    description: (
      <>
        This TikToker was posting about these blankets that she would knit with
        different colors depending on the peak temperature of that day. <br />{' '}
        <br /> I made that, but 3D{' '}
        <a
          href="https://mystifying-lumiere-22fd64.netlify.app/"
          target="_blank">
          https://mystifying-lumiere-22fd64.netlify.app/
        </a>{' '}
      </>
    ),
    media: '/blankets.mp4',
  },
  {
    id: 'students',
    title: 'Students Archive',
    subtitle: '2020-2021',
    description: (
      <>
        Made an archive for my school's magazine! (Until they decided not to
        cover domain name costs :D) <br /> <br />{' '}
        <a href="https://mag.tomasmaillo.com/" target="_blank">
          https://mag.tomasmaillo.com/
        </a>
      </>
    ),
    media: '/students.mp4',
  },
]
