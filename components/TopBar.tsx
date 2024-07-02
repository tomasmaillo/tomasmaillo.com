async function getData() {
  const [locationRes, visitorRes] = await Promise.all([
    fetch('https://web.tomasmaillo.com/location', {
      next: { revalidate: 3600 },
    }),
    fetch('https://web.tomasmaillo.com/visit'),
  ])

  if (!locationRes.ok || !visitorRes.ok) {
    throw new Error('Failed to fetch data')
  }

  const location = await locationRes.json()
  const visitor = await visitorRes.json()

  return { location, visitor }
}

const TopBar = async () => {
  const { location, visitor } = await getData()

  return (
    <header className="flex items-center justify-between text-xs hover:opacity-100 opacity-50">
      <p>
        {location.city}
        {' · '}
        {location.region}
      </p>
      <p>Welcome {visitor.visitCount}th visitor</p>
    </header>
  )
}

export default TopBar
