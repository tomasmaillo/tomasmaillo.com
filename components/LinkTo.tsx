import Link from 'next/link'
import type { FC, SVGProps } from 'react'

const LinkTo = ({
  displayText,
  link,
  supportText,
  sideText,
  Icon,
}: {
  displayText: string
  link: string
  supportText?: string
  sideText?: string
  Icon?: FC<SVGProps<SVGSVGElement>>
}) => {
  if (Icon) {
    return (
      <Link
        href={link}
        className="group flex min-h-14 items-center gap-3 rounded-md px-2 py-2 text-foreground !no-underline hover:bg-card hover:!no-underline">
        <Icon className="h-7 w-7 shrink-0 fill-current text-foreground overflow-visible" />
        <span className="min-w-0 flex-1 truncate text-sm group-hover:underline">
          {displayText}
        </span>
        {sideText && (
          <span className="shrink-0 text-xs text-muted">
            {sideText.replace(' read', '')}
          </span>
        )}
      </Link>
    )
  }

  return (
    <Link
      href={link}
      className="text-foreground !no-underline hover:!no-underline relative">
      <div className="group flex flex-row hover:bg-card rounded-lg p-3 box-border -mx-2 bg-card">
        <div className="flex flex-col justify-center gap-1 truncate">
          <span className="group-hover:underline text-ellipsis overflow-hidden whitespace-nowrap">
            {displayText}
          </span>
          {supportText && (
            <span className="text-sm text-muted text-ellipsis overflow-hidden whitespace-nowrap">
              {supportText}
            </span>
          )}
        </div>
      </div>
      {sideText && (
        <span className="text-muted ml-auto absolute top-4 right-2 text-xs pointer-events-none">
          {sideText}
        </span>
      )}
    </Link>
  )
}

export default LinkTo
