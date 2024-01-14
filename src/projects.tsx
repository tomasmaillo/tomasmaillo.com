import { Item } from './CVView/item.interface'
import Card3D from './Card3D'
import { PeopleLink, STAN_FLINT } from './peopleLinks'

export const PROJECTS: Item[] = [
  {
    id: 1,
    title: <img src="./vibe-checklogo.svg" width={256} />,
    backgroundImg: './vibe-checkbackground.svg',
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
  },
  {
    id: 2,
    title: <img src="./librarylogo.svg" width={256} />,

    backgroundImg: './librarybackground.svg',
    description: {
      title: 'Library',
      role: 'Co-founder',
      date: 'Sept 2020 - Feb 2020',
      text: (
        <>
          Co-built a browser extension to improve lectures at university by
          giving real-time feedback from the audience to lecturers.
        </>
      ),
    },

    topic: 'Projects',
  },
  {
    id: 3,
    title: <img src="./projectsharelogo.svg" height={96} />,
    backgroundImg: './projectshare.svg',
    description: {
      title: 'Project Share',
      role: 'Co-founder',
      date: 'Sept 2020 - Feb 2020',
      text: (
        <>Student society to share and collaborate on projects. Built with</>
      ),
    },
    topic: 'Projects',
  },
  {
    id: 4,
    title: <>Title 4</>,
    backgroundImg: './spotifybackground.svg',
    description: {
      title: 'Spotify',
      role: 'Web Engineer Intern',
      date: 'Sept 2020 - Feb 2020',
      text: (
        <>
          Built the new Spotify for Artists website. Built with React, Redux,
          GraphQL and Apollo.
        </>
      ),
    },
    topic: 'Work',
  },

  {
    id: 5,
    title: <>Title 4</>,
    backgroundElement: (
      <div>
        <Card3D width="100px" height="200px">
          <div
            style={{
              outline: '5px solid #ac3963',
              background: '#982e55',
            }}>
            <img
              src="https://unavatar.io/github/tomasmaillo"
              style={{
                height: '200px',
                width: '200px',
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <h2 style={{ margin: 0 }}>Tomas Maillo</h2>
            <p style={{ margin: 0 }}>Web Egineer Intern</p>
          </div>
        </Card3D>
      </div>
    ),
    description: {
      title: 'Spotify',
      role: 'Web Engineer Intern',
      date: 'Sept 2020 - Feb 2020',
      text: (
        <>
          Built the new Spotify for Artists website. Built with React, Redux,
          GraphQL and Apollo.
        </>
      ),
    },
    topic: 'Education',
  },

  {
    id: 6,
    title: <>Hack</>,

    description: {
      title: 'Hack',
      role: 'Web Engineer Intern',
      date: 'Sept 2020 - Feb 2020',
      text: (
        <>
          Built the new Spotify for Artists website. Built with React, Redux,
          GraphQL and Apollo.
        </>
      ),
    },
    topic: 'Hackathon',
  },

  // {
  //   id: 5,
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
  //   id: 6,
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
  //   id: 7,
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
]
