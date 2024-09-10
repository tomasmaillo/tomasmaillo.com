import React from 'react'
import EmailLink from './EmailLink'

const Links = () => {
  return (
    <div className="flex space-x-4 text-sm text-muted m-auto justify-center">
      <a className="hover:underline" href="https://x.com/tomascodes">
        Twitter
      </a>
      <a className="hover:underline" href="https://github.com/tomasmaillo">
        GitHub
      </a>
      <a
        className="hover:underline"
        href="https://www.linkedin.com/in/tomas-maillo/">
        LinkedIn
      </a>
      <EmailLink />
    </div>
  )
}

export default Links
