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
        Launched the first version of this website
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
        Launched my first newsletter
      </a>
    ),
    at: '2020-07-27',
  },
  {
    label: 'Started live-streaming programming on Twitch',
    at: '2020-08-20',
  },
  {
    label: (
      <a
        href="https://github.com/tomasmaillo/UCASsearch"
        target="_blank"
        rel="noopener noreferrer">
        Scraped all of UCAS and built a tool to help me find which university I
        wanted to apply to
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
        Contributed to an open-source project for the first time
      </a>
    ),
    at: '2021-04-10',
  },
  {
    label: 'Created a website for my school magazine',
    at: '2021-06-30',
  },
  {
    label: 'Finished secondary school with A*A*A*A',
    at: '2021-07-01',
  },
  {
    label: 'Moved to Edinburgh',
    at: '2021-08-23',
  },
  {
    label: (
      <span>
        Started studying computer science and AI at the{' '}
        <Image
          src="/experience/university-of-edinburgh.svg"
          alt="University of Edinburgh"
          width={12}
          height={12}
          className="inline-block"
          style={{ transform: 'translateY(-1px)' }}
        />{' '}
        University of Edinburgh
      </span>
    ),
    at: '2021-09-01',
  },
  {
    label: 'Built a website for an independent journalist covering COP26',
    from: '2021-10-31',
    to: '2021-11-12',
  },
  {
    label: (
      <a
        href="https://github.com/tomasmaillo/temperature-blankets"
        target="_blank"
        rel="noopener noreferrer">
        Made a 3D visualisation of how temperatures have increased over the
        years
      </a>
    ),
    at: '2022-01-03',
  },
  {
    label: (
      <span>
        Joined{' '}
        <Image
          src="/experience/spotify.svg"
          alt="Spotify"
          width={12}
          height={12}
          className="inline-block"
          style={{ transform: 'translateY(-1px)' }}
        />{' '}
        Spotify as a software engineering intern
      </span>
    ),
    from: '2022-06-01',
    to: '2022-09-01',
  },
  {
    label: (
      <span>
        Joined{' '}
        <Image
          src="/experience/baillie-gifford.svg"
          alt="Baillie Gifford"
          width={12}
          height={12}
          className="inline-block"
          style={{ transform: 'translateY(-1px)' }}
        />{' '}
        Baillie Gifford as a software engineering intern
      </span>
    ),
    from: '2024-06-08',
    to: '2024-09-01',
  },
  {
    label: (
      <a href="/marked">
        Completed MarkEd, my dissertation on LLM-assisted peer feedback
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
          className="inline-block"
          style={{ transform: 'translateY(-1px)' }}
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
          className="inline-block"
          style={{ transform: 'translateY(-1px)' }}
        />{' '}
        Stripe as a Software Engineer
      </span>
    ),
    at: '2025-09-02',
  },
  {
    label: (
      <a href="/marked">
        Published the MarkEd research in the ACM conference proceedings
      </a>
    ),
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
    label: (
      <span>
        Co-founded{' '}
        <Image
          src="/experience/project-share.png"
          alt="Project Share"
          width={12}
          height={12}
          className="inline-block"
          style={{ transform: 'translateY(-1px)' }}
        />{' '}
        Project Share, a society for student tech builders
      </span>
    ),
    at: '2022-09-08',
  },
  {
    label: (
      <a href="/about-this-website">
        Launched the 2022 version of this website
      </a>
    ),
    at: '2022-09-01',
  },
  {
    label: "Built a live occupancy tracker for Edinburgh's libraries",
    at: '2023-01-01',
  },
  {
    label: (
      <span>
        Hackathon: Built{' '}
        <a
          href="https://devpost.com/software/promotions-of-men-and-women-in-the-modern-workplace"
          target="_blank"
          rel="noopener noreferrer">
          Gender Bias in Promotions
        </a>{' '}
        at Ada Hack 2022
      </span>
    ),
    at: '2022-10-15',
  },
  {
    label: (
      <span>
        Hackathon: Built{' '}
        <a href="/vibe-check">Vibe Check</a>{' '}
        at Hack The Burgh 2023
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
        Joined CompSoc as third-year representative
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
        Returned to CompSoc as fourth-year representative
      </a>
    ),
    at: '2024-04-03',
  },
  {
    label: "Started marking Edinburgh's Software Engineering course",
    at: '2023-09-01',
  },
  {
    label: (
      <span>
        Hackathon: Built{' '}
        <a
          href="https://devpost.com/software/ark-ademic"
          target="_blank"
          rel="noopener noreferrer">
          ARK-ademic
        </a>{' '}
        at IC Hack 2024
      </span>
    ),
    at: '2024-02-04',
  },
  {
    label: (
      <span>
        Hackathon: Built{' '}
        <a
          href="https://devpost.com/software/notevec"
          target="_blank"
          rel="noopener noreferrer">
          NoteVec
        </a>{' '}
        at Hack The Burgh 2024
      </span>
    ),
    from: '2024-03-02',
    to: '2024-03-03',
  },
  {
    label: 'Started teaching programming part-time at Code Cadets',
    at: '2024-01-01',
  },
  {
    label: (
      <a href="/zephyr-fan-app">
        Built Zephyr Fan, a smart fan that follows you and responds to hand
        gestures
      </a>
    ),
    at: '2024-05-31',
  },
  {
    label: (
      <a href="/about-this-website">
        Launched the 2024 version of this website
      </a>
    ),
    at: '2024-09-08',
  },
  {
    label: (
      <span>
        Launched a{' '}
        <a
          href="https://comp-soc.com"
          target="_blank"
          rel="noopener noreferrer">
          new website for CompSoc
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
          computer vision could make strength training safer
        </a>
      </span>
    ),
    at: '2025-01-01',
  },
  {
    label: "Organised Hack The Burgh 2025, Scotland's largest hackathon",
    from: '2025-03-01',
    to: '2025-03-02',
  },
  {
    label: (
      <span>
        Hackathon: Built{' '}
        <a
          href="https://devpost.com/software/blockdraw"
          target="_blank"
          rel="noopener noreferrer">
          BlockDraw
        </a>{' '}
        at IC Hack 2025
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
        Hackathon: Built{' '}
        <a
          href="https://devpost.com/software/sosbridge"
          target="_blank"
          rel="noopener noreferrer">
          SOSBridge
        </a>{' '}
        at the ElevenLabs × London Founder House Hack
      </span>
    ),
    from: '2025-06-28',
    to: '2025-06-29',
  },
  {
    label: (
      <span>
        <a
          href="https://x.com/stripe/status/2049621560743608481"
          target="_blank"
          rel="noopener noreferrer">
          Saw my Stripe Treasury work presented onstage at Stripe Sessions
        </a>{' '}
        2026
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
