import { useEffect, useState } from 'react'

interface Visit {
  count: number
  timestamp: number
}

const randomItem = <T,>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)]

const fetchVisitorCount = async (): Promise<number> => {
  const response = await fetch('https://web.tomasmaillo.com/visit')
  const data = await response.json()
  return data.visitCount
}

const saveVisitHistory = (history: Visit[]) => {
  localStorage.setItem('visitHistory', JSON.stringify(history))
}

const loadVisitHistory = (): Visit[] => {
  const savedHistory = localStorage.getItem('visitHistory')
  return savedHistory ? JSON.parse(savedHistory) : []
}

const VisitorCounter = () => {
  const [visitHistory, setVisitHistory] = useState<Visit[]>([])

  useEffect(() => {
    const initializeVisitHistory = async () => {
      const history = loadVisitHistory()
      setVisitHistory(history)

      try {
        const visitCount = await fetchVisitorCount()
        const newVisit: Visit = { count: visitCount, timestamp: Date.now() }
        updateVisitHistory(newVisit)
      } catch (error) {
        console.error('Failed to fetch visitor count', error)
      }
    }

    initializeVisitHistory()
  }, [])

  const updateVisitHistory = (newVisit: Visit) => {
    setVisitHistory((prevHistory) => {
      const updatedHistory = [...prevHistory, newVisit]
      saveVisitHistory(updatedHistory)
      return updatedHistory
    })
  }

  const renderMessage = (): string => {
    if (visitHistory.length === 0) return ''

    const lastVisit = visitHistory[visitHistory.length - 1]
    const previousVisit = visitHistory[visitHistory.length - 2]

    if (Date.now() - lastVisit.timestamp > 1000 * 60 * 60 * 24 * 7) {
      return "It's been a while! Welcome back <3"
    }

    if (previousVisit && lastVisit.count - previousVisit.count > 15) {
      return `You've missed a lot! There have been ${
        lastVisit.count - previousVisit.count
      } visits since your last visit!`
    }

    const visitsInLastFiveMins = visitHistory.filter(
      (visit) => Date.now() - visit.timestamp < 1000 * 60 * 5
    )

    if (visitHistory.length > 15) {
      return randomItem([
        'Are you stalking me?',
        'Every time you refresh the page, I get a notification on my phone :( ',
      ])
    }

    if (visitsInLastFiveMins.length > 3) {
      return randomItem([
        'You are visiting a lot!',
        'Are you just refreshing the page?',
        'You must really like my website!',
      ])
    }

    if (visitHistory.length < 3) {
      return 'Welcome back!'
    }

    return ''
  }

  return (
    <>
      {visitHistory.length > 0 && (
        <>
          Welcome {visitHistory[visitHistory.length - 1].count.toLocaleString()}
          <span
            style={{ verticalAlign: 'super', fontSize: '0.6rem' }}
            onClick={() => {
              if (import.meta.env.MODE === 'development') {
                setVisitHistory([])
                localStorage.removeItem('visitHistory')
              }
            }}>
            th
          </span>{' '}
          visitor. {renderMessage()}
        </>
      )}
    </>
  )
}

export default VisitorCounter
