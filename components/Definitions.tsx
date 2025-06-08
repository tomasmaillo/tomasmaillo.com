'use client'

import { useState, useEffect, useRef, useMemo } from 'react'

const Definitions = ({
  text,
  helperText,
}: {
  text: string
  helperText: string
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isHiding, setIsHiding] = useState(false)
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const hideTimeoutRef = useRef<NodeJS.Timeout>()
  const words = useMemo(() => helperText.split(' '), [helperText])

  useEffect(() => {
    if (isVisible && !isHiding && currentIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => {
          if (currentIndex === 0 && helperText.startsWith(',')) {
            return words[currentIndex]
          }
          return prev + ' ' + words[currentIndex]
        })
        setCurrentIndex((prev) => prev + 1)
      }, 25)
      return () => clearTimeout(timer)
    } else if (isHiding && currentIndex > 0) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => {
          const words = prev.split(' ')
          words.pop()
          return words.join(' ')
        })
        setCurrentIndex((prev) => prev - 1)
      }, 25)
      return () => clearTimeout(timer)
    } else if (!isVisible && !isHiding) {
      setDisplayedText('')
      setCurrentIndex(0)
    }
  }, [isVisible, isHiding, currentIndex, helperText, words])

  const handleClick = () => {
    if (isVisible) {
      setIsHiding(true)
      // Clear any existing timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
      hideTimeoutRef.current = setTimeout(() => {
        setIsVisible(false)
        setIsHiding(false)
      }, words.length * 25)
    } else {
      setIsVisible(true)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  return (
    <span>
      <span
        onClick={handleClick}
        className="border-b border-dashed border-orange-500 cursor-help">
        {text}
      </span>
      {(isVisible || isHiding) && (
        <span className="text-sm opacity-50 border-b border-dashed border-orange-500">
          {displayedText}
        </span>
      )}
    </span>
  )
}

export default Definitions
