import { Item } from './CVView/item.interface'
import { PeopleLink, STAN_FLINT } from './peopleLinks'

export const PROJECTS: Item[] = [
  {
    id: 1,
    title: <img src="./vibe-checklogo.svg" width={256} />,
    background: './vibe-checkbackground.svg',
    description: (
      <>
        Co-built <b>vibe-check</b>: a browser extension to improve lectures at
        university by giving real-time feedback from the audience to lecturers.
      </>
    ),
    topic: 'Experience',
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

    background: './librarybackground.svg',
    description: (
      <>
        Created <b>Library</b>: a web application to display library occupancy.
        Used by 300 users during its peack
      </>
    ),
    topic: 'Experience',
  },
  {
    id: 3,
    title: <img src="./projectsharelogo.svg" height={96} />,
    background: './projectshare.svg',
    description: (
      <>
        Co-founded <b>Project Share</b>, an official society at the University
        of Edinburgh to help students find present their own projects to other
        technical people
      </>
    ),
    topic: 'Experience',
  },
  {
    id: 4,
    title: <>Title 4</>,
    background: './spotifybackground.svg',
    description: (
      <>
        Co-built vibe-check: an online feedback system to improve lectures at
        university. Buit with Svelte and Node.js to allow the audience to give
        real-time feedback to the lecturer and display statistics.'
      </>
    ),
    topic: 'Work',
  },

  {
    id: 5,
    title: <>Hundreds of others</>,
    background: './spotifybackground.svg',
    description: (
      <>
        Co-built vibe-check: an online feedback system to improve lectures at
        university. Buit with Svelte and Node.js to allow the audience to give
        real-time feedback to the lecturer and display statistics.'
      </>
    ),
    topic: 'Test',
  },
  {
    id: 6,
    title: <>Hundreds of others</>,
    background: './spotifybackground.svg',

    description: (
      <>
        Co-built vibe-check: an online feedback system to improve lectures at
        university. Buit with Svelte and Node.js to allow the audience to give
        real-time feedback to the lecturer and display statistics.'
      </>
    ),
    topic: 'Experience',
  },
  {
    id: 7,
    title: <>Hundreds of others</>,
    background: './spotifybackground.svg',

    description: (
      <>
        Co-built vibe-check: an online feedback system to improve lectures at
        university. Buit with Svelte and Node.js to allow the audience to give
        real-time feedback to the lecturer and display statistics.'
      </>
    ),
    topic: 'Experience',
  },
]
