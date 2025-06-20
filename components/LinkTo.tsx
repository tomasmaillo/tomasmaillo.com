import Link from 'next/link'
import type { FC, SVGProps } from 'react'

const LinkTo = ({
  displayText,
  link,
  supportText,
  sideText,
  image,
  Icon,
}: {
  displayText: string
  link: string
  supportText?: string
  sideText?: string
  image?: string
  Icon?: FC<SVGProps<SVGSVGElement>>
}) => {
  return (
    <Link
      href={link}
      className="text-foreground !no-underline hover:!no-underline relative">
      <div className="group flex flex-row hover:bg-card rounded-lg p-3 box-border -mx-2 bg-card">
        {Icon && (
          <Icon className="w-[50px] h-[50px] my-4 mx-4 mr-6 fill-current text-foreground overflow-visible" />
        )}
        <div className="flex flex-col justify-center gap-1 truncate">
          <span className="group-hover:underline text-ellipsis overflow-hidden whitespace-nowrap">{displayText}</span>
          {supportText && (
            <span className="text-sm text-muted text-ellipsis overflow-hidden whitespace-nowrap">{supportText}</span>
          )}
        </div>
      </div>
      {sideText && (
        <span className="text-muted ml-auto absolute top-4 right-4 text-xs">
          {sideText}
        </span>
      )}
    </Link>
  )
}

export default LinkTo
