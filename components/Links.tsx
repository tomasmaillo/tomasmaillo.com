import React from 'react'
import ExternalLink from './ExternalLink'
import Link from 'next/link'

const Links = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-muted m-auto">
      <Link className="whitespace-nowrap hover:underline" href="/now">
        Now
      </Link>
      <ExternalLink
        className="whitespace-nowrap hover:underline"
        href="https://x.com/tomascodes"
        rel="me">
        Twitter ↗
      </ExternalLink>
      <ExternalLink
        className="whitespace-nowrap hover:underline"
        href="https://github.com/tomasmaillo"
        rel="me">
        GitHub ↗
      </ExternalLink>
      <ExternalLink
        className="whitespace-nowrap hover:underline"
        href="https://www.linkedin.com/in/tomas-maillo/"
        rel="me">
        LinkedIn ↗
      </ExternalLink>
    </div>
  )
}

export default Links
