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
        className="group mb-4 flex flex-row justify-between hover:bg-card rounded-lg p-2 box-border -mx-2 bg-card"
        style={{ width: 'calc(100% + 1rem)' }}>
        <div className="flex flex-col">
          <span className="group-hover:underline">{displayText}</span>
          {supportText && (
            <span className="text-sm text-muted text-right">{supportText}</span>
          )}
        </div>
        {sideText && (
          <span className="text-sm text-muted text-right">{sideText}</span>
        )}
      </div>
    </Link>
  )
}

export default LinkTo
