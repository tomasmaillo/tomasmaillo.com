import { type ReactNode } from 'react'
import Image from 'next/image'

export type AnnotationKind = 'personal' | 'world'

export type RangeAnnotation = {
  label: ReactNode
  from: string // YYYY-MM-DD
  to: string // YYYY-MM-DD
  kind?: AnnotationKind
  media?:
    | { type: 'image'; src: string; alt: string; width: number; height: number }
    | { type: 'video'; src: string; width: number; height: number }
}

export type PointAnnotation = {
  label: ReactNode
  at: string // YYYY-MM-DD
  kind?: AnnotationKind
  media?:
    | { type: 'image'; src: string; alt: string; width: number; height: number }
    | { type: 'video'; src: string; width: number; height: number }
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
    from: '2024-06-01',
    to: '2024-09-01',
  },
  {
    label: 'Racing to finish my dissertation',
    from: '2024-10-15',
    to: '2025-02-15',
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
    label: (
      <>
        Published a paper on my dissertation.{' '}
        <a href="/marked" target="_blank" rel="noopener noreferrer">
          Read more
        </a>
      </>
    ),
    at: '2025-09-10',
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
    label: 'Built the Library Occupancy Tracker',
    at: '2023-01-01',
  },
  {
    label: 'Built Vibe-Check at Hack The Burgh',
    from: '2023-03-11',
    to: '2023-03-12',
  },
  {
    label: 'Demoed Vibe-Check during the Informatics Entrepreneurship Festival',
    at: '2023-09-01',
  },
  {
    label:
      'Worked as a lab demonstrator and marker for UoE Software Engineering',
    from: '2023-09-01',
    to: '2024-05-31',
  },
  {
    label: 'Taught programming at Code Cadets',
    from: '2024-01-01',
    to: '2024-12-31',
  },
  {
    label:
      'Built Zephyr Fan, an AI-powered smart fan with CV + gesture control',
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
    from: '2025-03-01',
    to: '2025-03-02',
  },
  {
    label: 'ChatGPT launched',
    at: '2022-11-30',
    kind: 'world',
  },
]
