import Link from 'next/link'
import type { FC, SVGProps } from 'react'

const LinkTo = ({
  displayText,
  link,
  supportText,
  Icon,
}: {
  displayText: string
  link: string
  supportText: string
  Icon: FC<SVGProps<SVGSVGElement>>
}) => {
  return (
    <Link
      href={link}
      className="blog-card group flex items-center gap-4 rounded-lg p-4 text-foreground !no-underline focus-visible:outline-none sm:p-5">
      <Icon aria-hidden="true" className="h-7 w-7 shrink-0 overflow-visible fill-current" />
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className="text-sm font-medium leading-5 underline-offset-4 group-focus-visible:underline">
          {displayText}
        </span>
        <span className="line-clamp-2 text-[13px] leading-relaxed text-muted">
          {supportText}
        </span>
      </span>
    </Link>
  )
}

export default LinkTo
