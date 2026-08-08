import { type ReactNode } from 'react'
import Image from 'next/image'
import Avatar, { Person } from '@/components/ui/avatar'

export type AnnotationKind = 'personal' | 'world'

type AnnotationDetails = {
  label: ReactNode
  kind?: AnnotationKind
  media?: { src: string; alt: string; width: number; height: number }
}

export type RangeAnnotation = AnnotationDetails & {
  from: string // YYYY-MM-DD
  to: string // YYYY-MM-DD
}

export type PointAnnotation = AnnotationDetails & {
  at: string // YYYY-MM-DD
}

export type TimelineAnnotation = RangeAnnotation | PointAnnotation

export function isPointAnnotation(a: TimelineAnnotation): a is PointAnnotation {
  return 'at' in a
}

export const ALL_ANNOTATIONS: TimelineAnnotation[] = [
  {
    label: (
      <a href="/about-this-website">
        Released version 2017 of my portfolio website
      </a>
    ),
    at: '2017-01-01',
  },
  {
    label: (
      <a
        href="https://github.com/tomasmaillo/newsletter"
        target="_blank"
        rel="noopener noreferrer">
        Made a newsletter (now defunct)
      </a>
    ),
    at: '2020-07-27',
  },
  {
    label: (
      <a
        href="https://github.com/tomasmaillo/UCASsearch"
        target="_blank"
        rel="noopener noreferrer">
        Scraped the UCAS list of universities to choose where to apply
      </a>
    ),
    at: '2020-08-24',
  },
  {
    label: 'Made my first React Native app to track SpaceX rocket launches',
    at: '2020-12-19',
  },
  {
    label: (
      <a
        href="https://github.com/norbeyandresg/hades/commit/6588bf25d87c82d4fd1527ab8e8cd125e88760c4"
        target="_blank"
        rel="noopener noreferrer">
        Made my first PR contribution to an open-source repository
      </a>
    ),
    at: '2021-04-10',
  },
  {
    label: 'Created a website for my school magazine',
    at: '2021-06-30',
  },
  {
    label: 'Finished secondary school with A*A*A*A grades',
    at: '2021-07-01',
  },
  {
    label: 'Moved to Edinburgh',
    at: '2021-08-23',
  },
  {
    label: (
      <span>
        Started uni at the{' '}
        <Image
          src="/experience/university-of-edinburgh.svg"
          alt="University of Edinburgh"
          width={12}
          height={12}
          className="inline-block -align-[2px]"
        />{' '}
        University of Edinburgh
      </span>
    ),
    at: '2021-09-01',
  },
  {
    label:
      'Worked with an independent journalist to launch a website for the COP26 conference in Glasgow',
    from: '2021-10-31',
    to: '2021-11-12',
  },
  {
    label: (
      <a
        href="https://github.com/tomasmaillo/temperature-blankets"
        target="_blank"
        rel="noopener noreferrer">
        Made a 3D visualisation of temperature increase
      </a>
    ),
    at: '2022-01-03',
  },
  {
    label: (
      <span>
        Internship at{' '}
        <Image
          src="/experience/spotify.svg"
          alt="Spotify"
          width={12}
          height={12}
          className="inline-block -align-[2px]"
        />{' '}
        Spotify
      </span>
    ),
    from: '2022-06-01',
    to: '2022-09-01',
  },
  {
    label: (
      <span>
        Internship at{' '}
        <Image
          src="/experience/baillie-gifford.svg"
          alt="Baillie Gifford"
          width={12}
          height={12}
          className="inline-block -align-[2px]"
        />{' '}
        Baillie Gifford
      </span>
    ),
    from: '2024-06-08',
    to: '2024-09-01',
  },
  {
    label: (
      <a href="/marked">
        Completed MarkEd, my LLM-supported peer-feedback dissertation
      </a>
    ),
    at: '2025-02-03',
  },
  {
    label: (
      <span>
        Graduated from the{' '}
        <Image
          src="/experience/university-of-edinburgh.svg"
          alt="University of Edinburgh"
          width={12}
          height={12}
          className="inline-block -align-[2px]"
        />{' '}
        University of Edinburgh with first-class honours
      </span>
    ),
    at: '2025-05-01',
    media: {
      src: '/edin.png',
      alt: 'Graduation at the University of Edinburgh',
      width: 120,
      height: 120,
    },
  },
  {
    label: 'Moved to London',
    from: '2025-06-25',
    to: '2025-06-30',
  },
  {
    label: (
      <span>
        Started working at{' '}
        <Image
          src="/experience/stripe.svg"
          alt="Stripe"
          width={12}
          height={12}
          className="inline-block align-middle"
        />{' '}
        Stripe as a Software Engineer
      </span>
    ),
    at: '2025-09-02',
  },
  {
    label: <a href="/marked">Published a paper on my dissertation</a>,
    at: '2025-09-10',
  },
  {
    label: 'Travelled to China',
    from: '2025-11-24',
    to: '2025-11-30',
  },
  {
    label: 'Built BTCGlobe, a real-time 3D globe for Bitcoin transactions',
    at: '2021-03-01',
  },
  {
    label: 'Co-founded Project Share',
    at: '2022-09-08',
  },
  {
    label: (
      <a href="/about-this-website">
        Released version 2022 of my portfolio website
      </a>
    ),
    at: '2022-09-01',
  },
  {
    label: 'Built the Library Occupancy Tracker',
    at: '2023-01-01',
  },
  {
    label: (
      <span>
        Hackathon:{' '}
        <a
          href="https://devpost.com/software/promotions-of-men-and-women-in-the-modern-workplace"
          target="_blank"
          rel="noopener noreferrer">
          built Gender Bias in Promotions
        </a>{' '}
        (Ada Hack 2022)
      </span>
    ),
    at: '2022-10-15',
  },
  {
    label: (
      <span>
        Hackathon:{' '}
        <a
          href="https://devpost.com/software/vibe-check-tox0wn"
          target="_blank"
          rel="noopener noreferrer">
          built Vibe Check
        </a>{' '}
        (Hack The Burgh 2023)
      </span>
    ),
    from: '2023-03-04',
    to: '2023-03-05',
  },
  {
    label: (
      <a
        href="https://comp-soc.com/team/"
        target="_blank"
        rel="noopener noreferrer">
        Started my first CompSoc term as 3rd Year Representative
      </a>
    ),
    at: '2023-04-04',
  },
  {
    label: (
      <a
        href="https://comp-soc.com/team/"
        target="_blank"
        rel="noopener noreferrer">
        Started my second CompSoc term as 4th Year Representative
      </a>
    ),
    at: '2024-04-03',
  },
  {
    label: 'Started working as marker for the Software Engineering course at UoE',
    at: '2023-09-01',
  },
  {
    label: (
      <span>
        Hackathon:{' '}
        <a
          href="https://devpost.com/software/ark-ademic"
          target="_blank"
          rel="noopener noreferrer">
          built ARK-ademic
        </a>{' '}
        (IC Hack 24)
      </span>
    ),
    at: '2024-02-04',
  },
  {
    label: (
      <span>
        Hackathon:{' '}
        <a
          href="https://devpost.com/software/notevec"
          target="_blank"
          rel="noopener noreferrer">
          built NoteVec
        </a>{' '}
        (Hack The Burgh 2024)
      </span>
    ),
    from: '2024-03-02',
    to: '2024-03-03',
  },
  {
    label: 'Started teaching programming to kids part-time at Code Cadets',
    at: '2024-01-01',
  },
  {
    label:
      'Built Zephyr Fan, an AI-powered smart fan with CV + gesture control',
    at: '2024-05-31',
    media: {
      src: '/mlp-1.jpg',
      alt: 'Zephyr Fan',
      width: 120,
      height: 120,
    },
  },
  {
    label: (
      <a href="/about-this-website">
        Released version 2024 of my portfolio website
      </a>
    ),
    at: '2024-09-08',
  },
  {
    label: (
      <span>
        Released the{' '}
        <a
          href="https://comp-soc.com"
          target="_blank"
          rel="noopener noreferrer">
          new CompSoc website
        </a>{' '}
        with{' '}
        <Avatar
          person={Person.CaterinaMammola}
          className="inline-flex items-center px-1 py-px align-middle leading-none [&_img]:size-3 [&_img]:align-middle [&_span]:ml-1 [&_span]:text-[10px] [&_span]:leading-none sm:[&_span]:text-[11px]"
        />
      </span>
    ),
    at: '2024-09-29',
  },
  {
    label: (
      <span>
        Researched whether{' '}
        <a href="/curl">
          computer vision can help make strength training safer
        </a>
      </span>
    ),
    at: '2025-01-01',
  },
  {
    label: 'Organised Hack The Burgh 2025: Largest hackathon in Scotland',
    from: '2025-03-01',
    to: '2025-03-02',
  },
  {
    label: (
      <span>
        Hackathon:{' '}
        <a
          href="https://devpost.com/software/blockdraw"
          target="_blank"
          rel="noopener noreferrer">
          built BlockDraw
        </a>{' '}
        (IC Hack 25)
      </span>
    ),
    from: '2025-02-01',
    to: '2025-02-02',
  },
  {
    label: (
      <a
        href="https://www.research.ed.ac.uk/en/publications/enhancing-peer-feedback-quality-in-marked/"
        target="_blank"
        rel="noopener noreferrer">
        Presented my MarkEd research at the University Learning &amp; Teaching
        Conference
      </a>
    ),
    at: '2025-06-17',
  },
  {
    label: (
      <span>
        Hackathon:{' '}
        <a
          href="https://devpost.com/software/sosbridge"
          target="_blank"
          rel="noopener noreferrer">
          built SOSBridge
        </a>{' '}
        (ElevenLabs × London Founder House Hack)
      </span>
    ),
    from: '2025-06-28',
    to: '2025-06-29',
  },
  {
    label: (
      <span>
        Stripe Sessions 2026:{' '}
        <a
          href="https://x.com/stripe/status/2049621560743608481"
          target="_blank"
          rel="noopener noreferrer">
          Saw my work on Stripe Treasury reach the stage
        </a>
      </span>
    ),
    from: '2026-04-27',
    to: '2026-05-01',
  },
  {
    label: 'ChatGPT launched',
    at: '2022-11-30',
    kind: 'world',
  },
]
