async function getData() {
  if (process.env.NODE_ENV === 'development') {
    return {
      location: { city: 'Barcelona', region: 'Catalonia' },
      visitor: { visitCount: 1000 },
    }
  }

  const [locationRes, visitorRes] = await Promise.all([
    fetch('https://web.tomasmaillo.com/location', {
      next: { revalidate: 3600 },
    }),
    fetch('https://web.tomasmaillo.com/visit', { cache: 'no-store' }),
  ])

  if (!locationRes.ok || !visitorRes.ok) {
    return {
      location: { city: null, region: null },
      visitor: { visitCount: null },
    }
  }

  const location = await locationRes.json()
  const visitor = await visitorRes.json()

  return { location, visitor }
}

const TopBar = async () => {
  const { location, visitor } = await getData()

  return (
    <header className="flex items-center justify-between text-xs hover:opacity-100 opacity-50">
      {location.city && location.region && (
        <p title="Fetched every morning from my phone">
          {location.city}
          {' · '}
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
    </header>
  )
}

export default TopBar
