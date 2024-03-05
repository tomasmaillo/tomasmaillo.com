import { Item } from './CVView/item.interface'
import { PeopleLink, STAN_FLINT } from './peopleLinks'

export const PROJECTS: Item[] = [
  {
    title: <img src="./vibe-checklogo.svg" width={256} />,
    backgroundImg: './vibe-check-background.png',
    description: {
      title: 'vibe-check',
      role: 'Co-founder',
      date: 'Feb 2020',
      text: (
        <>
          Co-built a browser extension to improve lectures at university by
          giving real-time feedback from the audience to lecturers.
        </>
      ),
    },

    topic: 'Projects',
    details: [
      {
        title: 'Team',
        value: (
          <>
            <PeopleLink person={STAN_FLINT} />,{' '}
            <PeopleLink person={STAN_FLINT} />
          </>
        ),
      },
      {
        title: 'Tech',
        value: <>Svelte, Node.js, MongoDB</>,
      },
      {
        title: 'Summary',
        value: (
          <>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a
            diam lectus. Sed sit amet ipsum mauris. Maecenas congueLorem ipsum
            dolor sit amet, consectetur adipiscing elit. Donec a diam lectus.
            Sed sit amet ipsum mauris.
          </>
        ),
      },
    ],
    url: 'https://vibe-check.app/',
  },
  // {
  //   title: <img src="./librarylogo.svg" width={256} />,

  //   backgroundImg: './librarybackground.svg',
  //   description: {
  //     title: 'Library',
  //     role: 'Co-founder',
  //     date: 'Sept 2020 - Feb 2020',
  //     text: (
  //       <>
  //         Co-built a browser extension to improve lectures at university by
  //         giving real-time feedback from the audience to lecturers.
  //       </>
  //     ),
  //   },

  //   topic: 'Projects',
  // },
  {
    title: <img src="./projectsharelogo.svg" height={96} />,
    backgroundImg: './project-share-background.png',
    description: {
      title: 'Project Share',
      role: 'Co-founder',
      date: 'Sept 2022 - Present',
      text: (
        <>Co-founded a student society to share and collaborate on projects</>
      ),
    },
    topic: 'Projects',
    url: 'https://projectshare.comp-soc.com/',
  },
  {
    title: <>Spotify</>,
    // backgroundImg: './spotifybackground.svg',
    description: {
      title: 'Spotify',
      role: 'Web Engineer Intern',
      date: 'Jun 2022 - Sept 2022',
      text: (
        <>
          One-stop-shop website for everything and everyone Finance-related at
          Spotify ({'>'}1k people). Built with React, GraphQL and Contentful.
        </>
      ),
    },
    topic: 'Work',
  },

  {
    title: <>UoE</>,
    // backgroundElement: (
    //   <div>
    //     <Card3D width="100px" height="200px">
    //       <div
    //         style={{
    //           outline: '5px solid #ac3963',
    //           background: '#982e55',
    //         }}>
    //         <img
    //           src="https://unavatar.io/github/tomasmaillo"
    //           style={{
    //             height: '200px',
    //             width: '200px',
    //             borderRadius: '50%',
    //             objectFit: 'cover',
    //           }}
    //         />
    //         <h2 style={{ margin: 0 }}>Tomas Maillo</h2>
    //         <p style={{ margin: 0 }}>Web Egineer Intern</p>
    //       </div>
    //     </Card3D>
    //   </div>
    // ),
    description: {
      title: 'CS + AI',
      role: 'Uni of Edinburgh',
      date: 'Sept 2021 - Jun 2025',
      text: (
        <>
          Predicted to graduate with a first class degree. Taken courses in AI
          reasoning, machine learning, and software engineering.
        </>
      ),
    },
    topic: 'Education',
  },

  // {
  //   title: <>Hundreds of others</>,
  //   background: './spotifybackground.svg',
  //   description: (
  //     <>
  //       Co-built vibe-check: an online feedback system to improve lectures at
  //       university. Buit with Svelte and Node.js to allow the audience to give
  //       real-time feedback to the lecturer and display statistics.'
  //     </>
  //   ),
  //   topic: 'Test',
  // },
  // {
  //   title: <>Hundreds of others</>,
  //   background: './spotifybackground.svg',

  //   description: (
  //     <>
  //       Co-built vibe-check: an online feedback system to improve lectures at
  //       university. Buit with Svelte and Node.js to allow the audience to give
  //       real-time feedback to the lecturer and display statistics.'
  //     </>
  //   ),
  //   topic: 'Experience',
  // },
  // {
  //   title: <>Hundreds of others</>,
  //   background: './spotifybackground.svg',

  //   description: (
  //     <>
  //       Co-built vibe-check: an online feedback system to improve lectures at
  //       university. Buit with Svelte and Node.js to allow the audience to give
  //       real-time feedback to the lecturer and display statistics.'
  //     </>
  //   ),
  //   topic: 'Experience',
  // },
].map((item, i) => ({ ...item, id: i }))
// add id number
