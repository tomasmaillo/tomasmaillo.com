import type { AnchorHTMLAttributes } from 'react'

const externalHrefPattern = /^(https?:)?\/\//i

export const isExternalHref = (href?: string) =>
  Boolean(href && externalHrefPattern.test(href))

export const getExternalLinkProps = (
  href?: string,
  rel?: string
): AnchorHTMLAttributes<HTMLAnchorElement> => {
  if (!isExternalHref(href)) {
    return {}
  }

  const relValues = new Set([
    'noopener',
    ...(rel
      ?.split(' ')
      .filter((value) => value !== 'noreferrer') ?? []),
  ])

  return {
    rel: Array.from(relValues).filter(Boolean).join(' '),
    referrerPolicy: 'strict-origin-when-cross-origin',
  }
}

const ExternalLink = ({
  href,
  rel,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <a {...props} href={href} {...getExternalLinkProps(href, rel)}>
      {children}
    </a>
  )
}

export default ExternalLink
