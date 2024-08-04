import React from 'react'
import EmailLink from './EmailLink'

const Links = () => {
  return (
    <div className="flex space-x-4 text-sm opacity-70 hover:opacity-100 m-auto justify-center">
      <a className="hover:opacity-90" href="https://x.com/tomascodes">
        Twitter
      </a>
      <a className="hover:opacity-90" href="https://github.com/tomasmaillo">
        GitHub
      </a>
      <a
        className="hover:opacity-90 active:scale-95"
        href="https://www.linkedin.com/in/tomas-maillo/">
        LinkedIn
      </a>
      <EmailLink />
    </div>
  )
}

export default Links
