import Experience from '@/components/Experience/Experience'
import Links from '@/components/Links'
import Projects from '@/components/Projects/Projects'

export default function Home() {
  return (
    <main>
      <h1 className="text-3xl my-4 font-editorialNew">
        Tomas Maillo<span className="text-[#EB5D30]">.</span>
      </h1>

      <p className="opacity-70 text-sm mb-6">
        This is my little corner of the internet where I list what I&apos;ve
        built and learned. Currently a Computer Science and Artificial
        Intelligence student at the University of Edinburgh. Previously at
        Spotify.
      </p>

      <Links />

      <Projects />

      <h1 className="text-2xl mt-24 mb-4 font-editorialNew">Experience</h1>

      <Experience />

      {/* <h1 className="text-2xl mt-12 mb-4 font-editorialNew">Posts</h1>

      <LinkTo
        displayText="Making a blog? Me?"
        link="/making-a-blog"
        supportText="23 Jul"
      /> */}

      <p className="text-xs opacity-50 mt-32 text-center">
        This page is under active development. <br />
        Check back soon for more content {':)'}
      </p>
    </main>
  )
}
