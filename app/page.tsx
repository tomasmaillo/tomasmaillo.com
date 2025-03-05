import Experience from '@/components/Experience/Experience'
import FadeIn from '@/components/FadeIn'
import Links from '@/components/Links'
import LinkTo from '@/components/LinkTo'
import { Projects } from '@/components/Projects/Projects'
import Link from 'next/link'
import FanIcon from '@/public/pixel-arts/fan.svg'
import ToolsIcon from '@/public/pixel-arts/tools.svg'
import PageIcon from '@/public/pixel-arts/page.svg'
import VibeCheckIcon from '@/public/pixel-arts/vibe-check.svg'
import MugIcon from '@/public/pixel-arts/mug.svg'

export default function Home() {
  return (
    <main>
      <FadeIn delay={50}>
        <h1 className="text-3xl my-4 font-editorialNew">
          Tomas Maillo<span className="text-accent">.</span>
        </h1>
      </FadeIn>

      <FadeIn delay={200}>
        <p className="text-muted text-sm mb-3">
          This is my little corner of the internet where I list what I&apos;ve
          built and learned. Currently a Computer Science and Artificial
          Intelligence student at the University of Edinburgh. Previously at
          Spotify and Baillie Gifford.
        </p>
        <p className="text-muted text-sm mb-6">
          This is the{' '}
          <Link
            href="/about-this-website"
            className="text-accent hover:underline">
            {' '}
            7th iteration
          </Link>{' '}
          of my portfolio website. Built and designed by yours truly.
        </p>
      </FadeIn>

      <FadeIn delay={300}>
        <Links />
      </FadeIn>

      <FadeIn delay={600}>
        <Projects />
      </FadeIn>

      <h1 className="text-2xl mt-24 mb-4 font-editorialNew">Experience</h1>
      <Experience />

      <h1 className="text-2xl mt-16 mb-4 font-editorialNew">Posts</h1>

      <div className="grid grid-cols-2 gap-x-8 gap-y-4">
        <LinkTo
          Icon={FanIcon}
          displayText="AI Fan App"
          link="/zephyr-fan-app"
          sideText="3 min read"
        />

        <LinkTo
          Icon={ToolsIcon}
          displayText="What I use"
          link="/what-i-use"
          sideText="2 min read"
        />

        <LinkTo
          Icon={PageIcon}
          displayText="About this website"
          link="/about-this-website"
          sideText="3 min read"
        />

        <LinkTo
          Icon={VibeCheckIcon}
          displayText="vibe-check"
          link="/vibe-check"
          sideText="5 min read"
        />

        <LinkTo
          Icon={MugIcon}
          displayText="Internships 101"
          link="/internships-101"
          sideText="5 min read"
        />
      </div>
    </main>
  )
}
