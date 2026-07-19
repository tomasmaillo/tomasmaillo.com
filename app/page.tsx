import Experience from '@/components/Experience/Experience'
import FadeIn from '@/components/FadeIn'
import Links from '@/components/Links'
import LinkTo from '@/components/LinkTo'
import { Projects } from '@/components/Projects/Projects'
import FanIcon from '@/public/pixel-arts/fan.svg'
import ToolsIcon from '@/public/pixel-arts/tools.svg'
import PageIcon from '@/public/pixel-arts/page.svg'
import ClockIcon from '@/public/pixel-arts/clock.svg'
import VibeCheckIcon from '@/public/pixel-arts/vibe-check.svg'
import BucketIcon from '@/public/pixel-arts/bucket.svg'
import CurlIcon from '@/public/pixel-arts/curl.svg'
import BooksIcon from '@/public/pixel-arts/books.svg'
import MarkedIcon from '@/public/pixel-arts/marked.svg'
import MugIcon from '@/public/pixel-arts/mug.svg'
import FlashcardsIcon from '@/public/pixel-arts/flashcards.svg'
import ModerationIcon from '@/public/pixel-arts/moderation.svg'

export default function Home() {
  return (
    <main className="flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <FadeIn delay={50}>
          <h1 className="text-3xl mt-4 mb-2 font-editorialNew">Tomas Maillo</h1>
        </FadeIn>

        <FadeIn delay={200}>
          <p className="text-muted text-sm">
            Software engineer at Stripe, making thoughtful and useful products.
            A collection of projects, writing and lessons picked up along the
            way.
          </p>
        </FadeIn>

        <FadeIn delay={300}>
          <div className="my-8">
            <Links />
          </div>
        </FadeIn>
      </div>

      <FadeIn delay={600}>
        <Experience />
      </FadeIn>

      <FadeIn delay={900}>
        <Projects />
      </FadeIn>

      <div className="grid grid-cols-1 mt-8 gap-x-8 gap-y-4">
        <h1 className="text-2xl font-editorialNew">Posts</h1>
        <LinkTo
          Icon={ModerationIcon}
          displayText="Moderating 157 drawings with AI"
          link="/moderating-the-gallery"
          sideText="8 min read"
          supportText="6,396 calls to find the cheapest model I could trust"
        />

        <LinkTo
          Icon={FlashcardsIcon}
          displayText="Making flashcards before I forget"
          link="/mochi-flashcards"
          sideText="4 min read"
          supportText="Connecting an iPhone Shortcut, OpenAI and Mochi"
        />

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
          Icon={ClockIcon}
          displayText="Now"
          link="/now"
          sideText="1 min read"
          supportText="What I'm focused on at the moment"
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
          supportText="A list of things I want to do before I kick the bucket"
        />

        <LinkTo
          Icon={CurlIcon}
          displayText="Paper: Towards Safer Curl"
          link="/curl"
          sideText="1 min read"
          supportText="Research into using deep learning to make strength training safer"
        />

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

        <LinkTo
          Icon={MugIcon}
          displayText="Internships 102"
          link="/internships-102"
          sideText="5 min read"
          supportText="...or rather, things I wish I knew before I started applying"
        />
      </div>
    </main>
  )
}
