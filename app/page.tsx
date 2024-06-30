export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1 className="text-xl mb-6 text-center">Tomas Maillo</h1>
      <a className="hover:opacity-50" href="/TomasMailloCV.pdf">
        CV
      </a>
      <a className="hover:opacity-50" href="https://x.com/tomascodes">
        Twitter
      </a>
      <a className="hover:opacity-50" href="https://github.com/tomasmaillo">
        GitHub
      </a>
      <a
        className="hover:opacity-50"
        href="https://www.linkedin.com/in/tomas-maillo/">
        LinkedIn
      </a>
      <a
        href="mailto:tomas@tomasmaillo.com"
        className="hover:opacity-50 cursor-pointer">
        Reach me
      </a>
    </main>
  )
}
