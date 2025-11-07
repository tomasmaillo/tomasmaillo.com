import Links from '@/components/Links'
import EmailLink from '@/components/EmailLink'
import Link from 'next/link'

const posts = [
  {
    date: 'Jul 15, 2025',
    title: 'Paper: Enhancing peer feedback in MarkEd',
    link: '/marked',
  },
  { date: 'Jun 24, 2025', title: 'Books', link: '/books' },
  { date: 'Aug 05, 2025', title: 'Paper: Towards Safer Curl', link: '/curl' },
  { date: 'May 07, 2025', title: 'Bucket List', link: '/bucket-list' },
  {
    date: 'Sept 10, 2024',
    title: 'About this website',
    link: '/about-this-website',
  },
  { date: 'Aug 18, 2024', title: 'vibe-check', link: '/vibe-check' },
  { date: 'Jun 15, 2024', title: 'What I use', link: '/what-i-use' },
  { date: 'Feb 08, 2024', title: 'AI Fan App', link: '/zephyr-fan-app' },
]

export default function Home() {
  return (
    <main className="flex flex-col gap-12">
      <div className="flex items-center w-full justify-between">
        <p className="text-sm leading-relaxed m-0">Tomas Maillo</p>
        <Links />
      </div>

      <p className="text-sm leading-relaxed">
        Based in London, I work at Stripe as a software engineer. Previously, I
        spent time at Spotify and Baillie Gifford, and recently graduated from
        the University of Edinburgh with a degree in Artificial Intelligence and
        Computer Science.
      </p>
      <p className="text-sm leading-relaxed">
        I&apos;m passionate about design and hardware. In the past, I&apos;ve
        been known for founding Project Share, organising Hack the Burgh X,
        publishing a paper on LLMs with peer feedback, winning hackathons and
        remaking my this website every year.
      </p>

      <div className="space-y-1">
        {posts.map((post) => (
          <Link
            href={post.link}
            key={post.link}
            className="flex items-start gap-6 hover:opacity-80 transition-opacity group rounded outline-none focus-visible:ring-2 focus-visible:ring-ring"
            tabIndex={0}
            style={{ textDecoration: 'none' }}>
            <span className="text-sm text-muted-foreground min-w-[120px] tabular-nums tracking-tight">
              {post.date}
            </span>
            <span className="text-sm underline flex-1 group-hover:underline">
              {post.title}
            </span>
          </Link>
        ))}
      </div>

      <EmailLink />
    </main>
  )
}
