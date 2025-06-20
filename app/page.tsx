import Experience from '@/components/Experience/Experience'
import FadeIn from '@/components/FadeIn'
import Links from '@/components/Links'
import LinkTo from '@/components/LinkTo'
import Projects from '@/components/Projects/Projects'
import Link from 'next/link'
import FanIcon from '@/public/pixel-arts/fan.svg'
import ToolsIcon from '@/public/pixel-arts/tools.svg'
import PageIcon from '@/public/pixel-arts/page.svg'
import VibeCheckIcon from '@/public/pixel-arts/vibe-check.svg'
import BucketIcon from '@/public/pixel-arts/bucket.svg'
// import CurlIcon from '@/public/pixel-arts/curl.svg'
import BooksIcon from '@/public/pixel-arts/books.svg'
import MarkedIcon from '@/public/pixel-arts/marked.svg'

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

      <div className="grid grid-cols-1   gap-x-8 gap-y-4">
        <LinkTo
          Icon={FanIcon}
          displayText="AI Fan App"
          link="/zephyr-fan-app"
          sideText="3 min read"
          supportText="Project writeup of a fan using AI vision"
        />

        <LinkTo
          Icon={ToolsIcon}
          displayText="What I use"
          link="/what-i-use"
          sideText="2 min read"
          supportText="A list of tools I use and recommend"
        />

        <LinkTo
          Icon={PageIcon}
          displayText="About this website"
          link="/about-this-website"
          sideText="3 min read"
          supportText="Behind the scenes look at this website and the ones before it"
        />

        <LinkTo
          Icon={VibeCheckIcon}
          displayText="vibe-check"
          link="/vibe-check"
          sideText="5 min read"
          supportText="A project writeup of a tool I built to help lecturers"
        />

        <LinkTo
          Icon={BucketIcon}
          displayText="Bucket List"
          link="/bucket-list"
          sideText="1 min read"
          supportText="A list of things I want to do before I -"
        />

        {/* <LinkTo
          Icon={CurlIcon}
          displayText="Paper: Towards Safer Curl"
          link="/curl"
          sideText="1 min read"
          supportText="A tool I built to help lecturers"
        /> */}

        <LinkTo
          Icon={BooksIcon}
          displayText="Books"
          link="/books"
          sideText="1 min read"
          supportText="A list of books I've read and recommend"
        />

        <LinkTo
          Icon={MarkedIcon}
          displayText="Paper: Enhancing peer feedback in MarkEd"
          link="/marked"
          sideText="∞ min read"
          supportText="Story behind my dissertation and how it became a paper"
        />
      </div>
    </main>
  )
}
