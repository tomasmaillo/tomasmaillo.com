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
    <Link href={link}>
      <div
        className="group child mb-4 flex flex-row justify-between hover:bg-zinc-50 rounded-lg p-2 box-border -mx-2 bg-zinc-50"
        style={{ width: 'calc(100% + 1rem)' }}>
        <div className="flex flex-col">
          <span className="group-hover:underline">{displayText}</span>
          {supportText && (
            <span className="text-sm opacity-70 text-right">{supportText}</span>
          )}
        </div>
        {sideText && (
          <span className="text-sm opacity-70 text-right">{sideText}</span>
        )}
      </div>
    </Link>
  )
}

export default LinkTo
