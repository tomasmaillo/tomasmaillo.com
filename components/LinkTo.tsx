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
      className="text-foreground !no-underline hover:!no-underline">
      <div
        className="group flex flex-col hover:bg-card rounded-lg p-3 box-border -mx-2 bg-card"
        style={{ width: 'calc(100% + 1rem)' }}>
        {Icon && (
          <Icon className="w-[50px] h-[50px] mx-auto my-12 fill-current text-foreground" />
        )}
        <div className="flex justify-between items-baseline md:flex-row flex-col">
          <span className="group-hover:underline">{displayText}</span>
          {sideText && (
            <span className="text-sm text-muted text-right">{sideText}</span>
          )}
        </div>
        {supportText && (
          <span className="text-sm text-muted">{supportText}</span>
        )}
      </div>
    </Link>
  )
}

export default LinkTo
