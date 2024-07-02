import IContactYou from '@/components/IContactYou'
import Links from '@/components/Links'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col  md:p-24 pt-32">
      <h1 className="text-3xl my-4 font-editorialNew">
        Tomas Maillo<span className="text-[#EB5D30]">.</span>
      </h1>

      <p className="opacity-70 text-sm mb-6">
        I&apos;m a design engineer and this is my little corner of the internet.
        I share and list what I&apos;ve built and learned. Currently a Computer
        Science and Artificial Intelligence student at the University of
        Edinburgh. Previously at Spotify.
      </p>

      <Links />

      {/* <IContactYou /> */}
    </main>
  )
}
