import { Clock, Github, Linkedin, Twitter } from 'lucide-react'
import ExternalLink from './ExternalLink'
import Link from 'next/link'

const iconLink = "flex h-10 w-8 items-center justify-center rounded-md text-muted transition-colors hover:text-black [[data-theme='dark']_&]:hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"

const Links = () => (
  <nav aria-label="Social links" className="flex items-center px-1">
    <Link className={iconLink} href="/now" aria-label="Now">
      <Clock size={17} aria-hidden="true" />
    </Link>
    <ExternalLink className={iconLink} href="https://x.com/tomascodes" rel="me" aria-label="X (Twitter)">
      <Twitter size={17} aria-hidden="true" />
    </ExternalLink>
    <ExternalLink className={iconLink} href="https://github.com/tomasmaillo" rel="me" aria-label="GitHub">
      <Github size={17} aria-hidden="true" />
    </ExternalLink>
    <ExternalLink className={iconLink} href="https://www.linkedin.com/in/tomas-maillo/" rel="me" aria-label="LinkedIn">
      <Linkedin size={17} aria-hidden="true" />
    </ExternalLink>
  </nav>
)

export default Links
