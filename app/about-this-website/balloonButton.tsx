'use client'
import { balloons } from 'balloons-js'
import { useState, useCallback, useEffect } from 'react'

const BalloonButton = () => {
  const [lastClickTime, setLastClickTime] = useState(0)
  const [isDisabled, setIsDisabled] = useState(false)

  const handleClick = useCallback(() => {
    const currentTime = Date.now()
    if (currentTime - lastClickTime > 2000) {
      balloons()
      setLastClickTime(currentTime)
      setIsDisabled(true)
    }
  }, [lastClickTime])

  useEffect(() => {
    if (isDisabled) {
      const timer = setTimeout(() => {
        setIsDisabled(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isDisabled])

  return (
    <div className="flex justify-center">
      <button
        className={`bg-foreground text-background px-4 py-2 rounded-md m-auto transition-all ${
          isDisabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95 hover:opacity-90'
        }`}
        onClick={handleClick}
        disabled={isDisabled}>
        Like this button
      </button>
    </div>
  )
}

export default BalloonButton
