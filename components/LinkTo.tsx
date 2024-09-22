import Link from 'next/link'

const LinkTo = ({
  displayText,
  link,
  supportText,
  sideText,
}: {
  displayText: string
  link: string
  supportText?: string
  sideText?: string
}) => {
  return (
    <Link
      href={link}
      className="text-foreground !no-underline hover:!no-underline">
      <div
        className="group flex flex-col hover:bg-card rounded-lg p-2 box-border -mx-2 bg-card"
        style={{ width: 'calc(100% + 1rem)' }}>
        <div className="flex justify-between">
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
