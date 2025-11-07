import Link from 'next/link'

const NotFound = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background gap-4 p-8">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-sm text-muted-foreground mb-8 max-w-md">
          I rehaul this website every ~year. It is possible that the page you
          were looking for did not survive the latest update sorry!
        </p>
        <Link
          href="/"
          className="text-sm underline hover:opacity-80 transition-opacity">
          Go back home
        </Link>
      </div>
    </div>
  )
}

export default NotFound
