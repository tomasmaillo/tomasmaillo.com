import { type ReactNode } from 'react'
import Image from 'next/image'

export type AnnotationKind = 'personal' | 'world'
export type AnnotationCategory =
  | 'living'
  | 'education'
  | 'career'
  | 'projects'
  | 'hackathons'
  | 'world'

type AnnotationDetails = {
  label: ReactNode
  category: AnnotationCategory
  pivotal: boolean
  kind?: AnnotationKind
  media?:
    | { type: 'image'; src: string; alt: string; width: number; height: number }
    | { type: 'video'; src: string; width: number; height: number }
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
    category: 'education',
    pivotal: true,
    at: '2021-09-01',
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
    category: 'career',
    pivotal: true,
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
    category: 'career',
    pivotal: true,
    from: '2024-06-01',
    to: '2024-09-01',
  },
  {
    label: 'Dissertation deadline',
    category: 'education',
    pivotal: true,
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
        University of Edinburgh
      </span>
    ),
    category: 'education',
    pivotal: true,
    at: '2025-05-01',
    media: {
      type: 'image',
      src: '/edin.png',
      alt: 'Zephyr Fan',
      width: 120,
      height: 120,
    },
  },
  {
    label: 'Moved to London',
    category: 'living',
    pivotal: true,
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
    category: 'career',
    pivotal: true,
    at: '2025-09-02',
  },
  {
    label: (
      <>
        Published a paper on my dissertation.{' '}
        <a href="/marked" target="_blank" rel="noopener noreferrer">
          Read more
        </a>
      </>
    ),
    category: 'projects',
    pivotal: true,
    at: '2025-09-10',
  },
  {
    label: 'Built BTCGlobe, a real-time 3D globe for Bitcoin transactions',
    category: 'projects',
    pivotal: true,
    at: '2021-03-01',
  },
  {
    label: 'Co-founded Project Share',
    category: 'projects',
    pivotal: true,
    at: '2022-09-08',
  },
  {
    label: 'Built the Library Occupancy Tracker',
    category: 'projects',
    pivotal: true,
    at: '2023-01-01',
  },
  {
    label: 'Built Vibe-Check at Hack The Burgh',
    category: 'hackathons',
    pivotal: true,
    from: '2023-03-11',
    to: '2023-03-12',
  },
  {
    label: 'Demoed Vibe-Check during the Informatics Entrepreneurship Festival',
    category: 'hackathons',
    pivotal: true,
    at: '2023-09-01',
  },
  {
    label:
      'Worked as a lab demonstrator and marker for UoE Software Engineering',
    category: 'career',
    pivotal: true,
    from: '2023-09-01',
    to: '2024-05-31',
  },
  {
    label: 'Taught programming at Code Cadets',
    category: 'career',
    pivotal: true,
    from: '2024-01-01',
    to: '2024-12-31',
  },
  {
    label:
      'Built Zephyr Fan, an AI-powered smart fan with CV + gesture control',
    category: 'projects',
    pivotal: true,
    from: '2024-01-01',
    to: '2024-05-31',
    media: {
      type: 'image',
      src: '/mlp-1.jpg',
      alt: 'Zephyr Fan',
      width: 120,
      height: 120,
    },
  },
  {
    label: 'Organised Hack The Burgh XI',
    category: 'hackathons',
    pivotal: true,
    from: '2025-03-01',
    to: '2025-03-02',
  },
  {
    label: 'ChatGPT launched',
    category: 'world',
    pivotal: true,
    at: '2022-11-30',
    kind: 'world',
  },
]
