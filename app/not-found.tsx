'use client'

import { useEffect, useState, useCallback } from 'react'

const GRID_SIZE = 20
const CELL_SIZE = 15
const INITIAL_SPEED = 150

const NotFound = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }])
  const [food, setFood] = useState({ x: 20, y: 20 })
  const [direction, setDirection] = useState('RIGHT')
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameTime, setGameTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const generateFood = useCallback(() => {
    return {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  }, [])

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }])
    setFood(generateFood())
    setDirection('RIGHT')
    setScore(0)
    setGameOver(false)
    setGameTime(0)
    setIsPlaying(true)
  }

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout
    if (isPlaying && !gameOver) {
      timer = setInterval(() => {
        setGameTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [isPlaying, gameOver])

  // High score effect
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score)
    }
  }, [score, highScore])

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      e.preventDefault() // Prevent default scrolling
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          if (direction !== 'DOWN') setDirection('UP')
          break
        case 'arrowdown':
        case 's':
          if (direction !== 'UP') setDirection('DOWN')
          break
        case 'arrowleft':
        case 'a':
          if (direction !== 'RIGHT') setDirection('LEFT')
          break
        case 'arrowright':
        case 'd':
          if (direction !== 'LEFT') setDirection('RIGHT')
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [direction])

  // Touch controls for mobile
  useEffect(() => {
    let touchStartX = 0
    let touchStartY = 0
    const minSwipeDistance = 30 // Minimum distance required for a swipe

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault() // Prevent scrolling
      const touchEndX = e.touches[0].clientX
      const touchEndY = e.touches[0].clientY

      const diffX = touchEndX - touchStartX
      const diffY = touchEndY - touchStartY

      // Only register swipe if it's long enough
      if (
        Math.abs(diffX) > minSwipeDistance ||
        Math.abs(diffY) > minSwipeDistance
      ) {
        if (Math.abs(diffX) > Math.abs(diffY)) {
          // Horizontal swipe
          if (diffX > 0 && direction !== 'LEFT') {
            setDirection('RIGHT')
          } else if (diffX < 0 && direction !== 'RIGHT') {
            setDirection('LEFT')
          }
        } else {
          // Vertical swipe
          if (diffY > 0 && direction !== 'UP') {
            setDirection('DOWN')
          } else if (diffY < 0 && direction !== 'DOWN') {
            setDirection('UP')
          }
        }
        // Reset touch start position to prevent multiple swipes
        touchStartX = touchEndX
        touchStartY = touchEndY
      }
    }

    const handleTouchEnd = () => {
      touchStartX = 0
      touchStartY = 0
    }

    window.addEventListener('touchstart', handleTouchStart)
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [direction])

  useEffect(() => {
    if (gameOver) return

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] }

        switch (direction) {
          case 'UP':
            head.y -= 1
            break
          case 'DOWN':
            head.y += 1
            break
          case 'LEFT':
            head.x -= 1
            break
          case 'RIGHT':
            head.x += 1
            break
        }

        // Check collision with walls
        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE
        ) {
          setGameOver(true)
          return prevSnake
        }

        // Check collision with self
        if (
          prevSnake.some(
            (segment) => segment.x === head.x && segment.y === head.y
          )
        ) {
          setGameOver(true)
          return prevSnake
        }

        const newSnake = [head, ...prevSnake]

        // Check if food is eaten
        if (head.x === food.x && head.y === food.y) {
          setFood(generateFood())
          setScore((prev) => prev + 1)
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }

    const gameInterval = setInterval(moveSnake, INITIAL_SPEED)
    return () => clearInterval(gameInterval)
  }, [direction, food, gameOver, generateFood])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleDirectionChange = (newDirection: string) => {
    if (
      (newDirection === 'UP' && direction !== 'DOWN') ||
      (newDirection === 'DOWN' && direction !== 'UP') ||
      (newDirection === 'LEFT' && direction !== 'RIGHT') ||
      (newDirection === 'RIGHT' && direction !== 'LEFT')
    ) {
      setDirection(newDirection)
    }
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center bg-background gap-4 p-2">
      <div className="text-xl text-center mb-2">
        <span className="font-bold">404</span>
        <br />
        <span className="text-sm opacity-70">
          Could not find what you were looking for, but here&apos;s a game of
          Snake instead.
        </span>
      </div>
      <div className="flex flex-col items-center w-full max-w-[min(100vw-16px,400px)]">
        <div className="relative border border-black/20 overflow-hidden w-full aspect-square">
          <canvas
            width={GRID_SIZE * CELL_SIZE}
            height={GRID_SIZE * CELL_SIZE}
            className="bg-white w-full h-full"
            ref={(canvas) => {
              if (!canvas) return
              const ctx = canvas.getContext('2d')
              if (!ctx) return

              // Clear canvas
              ctx.fillStyle = 'white'
              ctx.fillRect(0, 0, canvas.width, canvas.height)

              // Draw snake
              ctx.fillStyle = 'black'
              snake.forEach((segment) => {
                ctx.fillRect(
                  segment.x * CELL_SIZE,
                  segment.y * CELL_SIZE,
                  CELL_SIZE - 1,
                  CELL_SIZE - 1
                )
              })

              // Draw food
              ctx.fillStyle = 'black'
              ctx.fillRect(
                food.x * CELL_SIZE,
                food.y * CELL_SIZE,
                CELL_SIZE - 1,
                CELL_SIZE - 1
              )
            }}
          />
          {gameOver && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white">
              <div className="text-2xl font-bold mb-2">Game Over!</div>
              <div className="text-sm mb-4">Final Score: {score}</div>
              <button
                onClick={resetGame}
                className="px-4 py-2 border border-white/20 hover:bg-white hover:text-black transition-colors">
                Play Again
              </button>
            </div>
          )}
        </div>
        <div className="w-full bg-black/5 border border-black/20 border-t-0 flex items-center justify-between px-3 py-2 text-sm">
          <div className="flex items-center gap-4">
            <div>Score: {score}</div>
            <div>High: {highScore}</div>
            <div>Time: {formatTime(gameTime)}</div>
          </div>
          <button
            onClick={resetGame}
            className="px-3 py-1 border border-black/20 hover:bg-black hover:text-white transition-colors text-xs">
            {gameOver ? 'Play Again' : 'Restart'}
          </button>
        </div>
        {/* Mobile Controls */}
        <div className="grid grid-cols-3 gap-2 mt-4 w-full max-w-[200px]">
          <div /> {/* Empty cell for grid alignment */}
          <button
            onClick={() => handleDirectionChange('UP')}
            className="aspect-square flex items-center justify-center border border-black/20 hover:bg-black/5 active:bg-black/10">
            ↑
          </button>
          <div /> {/* Empty cell for grid alignment */}
          <button
            onClick={() => handleDirectionChange('LEFT')}
            className="aspect-square flex items-center justify-center border border-black/20 hover:bg-black/5 active:bg-black/10">
            ←
          </button>
          <button
            onClick={() => handleDirectionChange('DOWN')}
            className="aspect-square flex items-center justify-center border border-black/20 hover:bg-black/5 active:bg-black/10">
            ↓
          </button>
          <button
            onClick={() => handleDirectionChange('RIGHT')}
            className="aspect-square flex items-center justify-center border border-black/20 hover:bg-black/5 active:bg-black/10">
            →
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound
