import TopBarClient from './TopBarClient'

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
  const dataPromise = getData()

  return <TopBarClient dataPromise={dataPromise} />
}

export default TopBar
