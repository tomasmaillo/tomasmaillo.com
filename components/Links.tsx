import React from 'react'
import EmailLink from './EmailLink'
import ExternalLink from './ExternalLink'

const Links = () => {
  return (
    <div className="flex space-x-8 text-sm text-muted m-auto justify-center">
      <ExternalLink className="hover:underline" href="https://x.com/tomascodes">
        Twitter ↗
      </ExternalLink>
      <ExternalLink
        className="hover:underline"
        href="https://github.com/tomasmaillo">
        GitHub ↗
      </ExternalLink>
      <ExternalLink
        className="hover:underline"
        href="https://www.linkedin.com/in/tomas-maillo/">
        LinkedIn ↗
      </ExternalLink>
      <EmailLink />
    </div>
  )
}

export default Links
