import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

interface Visit {
  count: number
  timestamp: number // Using a number to represent the timestamp (milliseconds since epoch)
}

const randomItem = (array: any[]) =>
  array[Math.floor(Math.random() * array.length)]

const VisitorCounter = () => {
  const [visitHistory, setVisitHistory] = useState<Visit[]>([])

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const response = await fetch('https://web.tomasmaillo.com/visit')
        const data = await response.json()
        const newVisit: Visit = {
          count: data.visitCount,
          timestamp: Date.now(),
        }
        updateVisitHistory(newVisit)
      } catch (error) {
        console.error('Failed to fetch visitor count', error)
      }
    }

    const savedVisitHistory = localStorage.getItem('visitHistory')
    if (savedVisitHistory) {
      setVisitHistory(JSON.parse(savedVisitHistory))
    }

    fetchVisitorCount()
  }, [])

  const updateVisitHistory = (newVisit: Visit) => {
    setVisitHistory((prevHistory) => {
      const updatedHistory = [...prevHistory, newVisit]
      localStorage.setItem('visitHistory', JSON.stringify(updatedHistory))
      return updatedHistory
    })
  }

  const renderMessage = () => {
    // if its been more than a week since the last visit
    if (Date.now() - visitHistory[0].timestamp > 1000 * 60 * 60 * 24 * 7)
      return 'Its been a while! Welcome back <3'

    // if there have been more than 15 visits since the last visit
    if (visitHistory.length > 2 && visitHistory[0].count - visitHistory[1].count > 15)
      return `You\'ve missed a lot! There have been ${
        visitHistory[0].count - visitHistory[1].count
      } visits since your last visit!`

    // get number of visits that happened in the last 5 minutes
    const visitsInLastFiveMins = visitHistory.filter(
      (visit) => Date.now() - visit.timestamp < 1000 * 60 * 5
    )

    if (visitHistory.length > 15)
      return randomItem([
        'Are you stalking me?',
        'Every time you refresh the page, I get a notification on my phone :( ',
      ])

    if (visitsInLastFiveMins.length > 3)
      return randomItem([
        'You are visiting a lot!',
        'Are you just refreshing the page?',
        'You must really like my website!',
      ])

    if (visitHistory.length < 3) return 'Welcome back!'

    return ''
  }

  return (
    <>
      {visitHistory.length > 0 && (
        <>
          Welcome {visitHistory[0].count.toLocaleString()}
          <span style={{ verticalAlign: 'super', fontSize: '0.6rem' }}>
            th
          </span>{' '}
          visitor. {visitHistory.length > 0 && renderMessage()}
        </>
      )}
    </>
  )
}

export default VisitorCounter
