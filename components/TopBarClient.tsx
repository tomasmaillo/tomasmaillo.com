'use client'

import { Suspense, use } from 'react'

// TODO: All these files are ugly. I should refactor them.

const TopBarContent = ({
  dataPromise,
}: {
  dataPromise: Promise<{
    location: { city: string | null; region: string | null }
    visitor: { visitCount: number | null }
  }>
}) => {
  const { location, visitor } = use(dataPromise)

  return (
    <>
      {location.city && location.region && (
        <p title="Fetched every morning from my phone">
          {location.city}
          <span className="select-none"> {' · '}</span>
          {location.region}
        </p>
      )}
      {visitor.visitCount && (
        <p title="Lovely to see you here!" className="text-xs tabular-nums">
          Welcome{' '}
          {visitor.visitCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
          {visitor.visitCount % 10 === 1 && visitor.visitCount % 100 !== 11
            ? 'st'
            : visitor.visitCount % 10 === 2 && visitor.visitCount % 100 !== 12
            ? 'nd'
            : visitor.visitCount % 10 === 3 && visitor.visitCount % 100 !== 13
            ? 'rd'
            : 'th'}{' '}
          visitor
        </p>
      )}
    </>
  )
}

type TopBarClientProps = {
  dataPromise: Promise<{
    location: { city: string | null; region: string | null }
    visitor: { visitCount: number | null }
  }>
}

const TopBarClient = ({ dataPromise }: TopBarClientProps) => {
  return (
    <header className="flex items-center justify-between text-xs hover:opacity-100 opacity-50 h-4">
      <Suspense>
        <TopBarContent dataPromise={dataPromise} />
      </Suspense>
    </header>
  )
}

export default TopBarClient
