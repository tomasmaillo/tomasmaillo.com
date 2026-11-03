import StickyLinks from '@/components/StickyLinks'
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
import TimelineIcon from '@/public/pixel-arts/timeline.svg'
import RaytracerIcon from '@/public/pixel-arts/raytracer.svg'
import DitheredAurora from '@/components/DitheredAurora'
import HomeSections from '@/components/HomeSections'

export default function Home() {
  return (
    <div className="flex flex-col gap-16">
      <StickyLinks />
      <div className="relative isolate -mx-4 px-4">
        <DitheredAurora />

        <div className="relative z-10 flex flex-col gap-2">
          <h1 className="mt-4 mb-2 pr-40 font-editorialNew text-3xl">
            Tomas Maillo
          </h1>

          <p className="text-muted text-sm">
            Software engineer making thoughtful and useful products.
            <br />
            A collection of projects, writing and lessons picked up along the
            way.
          </p>

        </div>
      </div>

      <HomeSections
        experience={<Projects />}
        blog={
      <div className="mb-8">
        <div className="flex flex-col gap-3">
          <LinkTo
            Icon={TimelineIcon}
            displayText="Timeline"
            link="/timeline"
            supportText="A visual history of projects, progress and notable moments"
          />

          <LinkTo
            Icon={FanIcon}
            displayText="AI Fan App"
            link="/zephyr-fan-app"
            supportText="An autonomous smart fan that tracks people and can be controlled with hand gestures. The system uses computer vision to rotate towards users and interpret gestures for speed and mode control, with a real-time app interface to monitor and override behaviour."
          />

          <LinkTo
            Icon={ToolsIcon}
            displayText="What I use"
            link="/what-i-use"
            supportText="A list of tools I use and recommend"
          />

          <LinkTo
            Icon={ClockIcon}
            displayText="Now"
            link="/now"
            supportText="What I'm focused on at the moment"
          />

          <LinkTo
            Icon={PageIcon}
            displayText="About this website"
            link="/about-this-website"
            supportText="Yes, the very website you are looking at right now! My portfolio website. I have re-made it about ~7 times now since 2017. It works out to once a year (ish)."
          />

          <LinkTo
            Icon={RaytracerIcon}
            displayText="Making a raytracer"
            link="/raytracer"
            supportText="At uni, I chose to take a course in computer-generated graphics. A big part of it was making a raytracer from scratch in C++. It was a very welcome assignment after so many less practical ones. Here is the final result:"
          />

          <LinkTo
            Icon={VibeCheckIcon}
            displayText="vibe-check"
            link="/vibe-check"
            supportText="Making lectures more interactive with live reactions and feedback"
          />

          <LinkTo
            Icon={BucketIcon}
            displayText="Bucket List"
            link="/bucket-list"
            supportText="A list of things I want to do before I kick the bucket"
          />

          <LinkTo
            Icon={CurlIcon}
            displayText="Paper: Towards Safer Curl"
            link="/curl"
            supportText="Research into using deep learning to make strength training safer"
          />

          <LinkTo
            Icon={BooksIcon}
            displayText="Books"
            link="/books"
            supportText="A list of books I've read and recommend"
          />

          <LinkTo
            Icon={MarkedIcon}
            displayText="Paper: Enhancing peer feedback in MarkEd"
            link="/marked"
            supportText="After a semester spent marking second-year students' essays, I proposed a dissertation project aimed at improving assessment practices in education."
          />

          <LinkTo
            Icon={MugIcon}
            displayText="Internships 102"
            link="/internships-102"
            supportText="I'm probably not the most qualified person to write about this, as I'm only just starting my career. Still, for some reason, I've been asked multiple times to share my experiences with applying for internships, interviewing, and landing jobs. I've given a few talks on this topic and spoken with countless people about it, so I thought I'd finally write my thoughts down."
          />
        </div>
      </div>
        }
      />
    </div>
  )
}
