import Link from 'next/link'

const LinkTo = ({
  displayText,
  link,
  supportText,
}: {
  displayText: string
  link: string
  supportText?: string
}) => {
  return (
    <Link href={link}>
      <div
        className="group child mb-4 flex flex-row justify-between hover:bg-slate-50 rounded-lg p-2 box-border -mx-2 bg-slate-50 md:bg-transparent"
        style={{ width: 'calc(100% + 1rem)' }}>
        <span className="group-hover:underline">{displayText}</span>
        {supportText && (
          <span className="text-sm opacity-70 text-right">{supportText}</span>
        )}
      </div>
    </Link>
  )
}

export default LinkTo
