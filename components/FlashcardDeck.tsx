'use client'

import { RotateCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Latex from 'react-latex-next'
import { cn } from '@/lib/utils'

const flashcards = [
  {
    front: 'Forward secrecy',
    back: 'Past messages stay secret even if a later key is leaked.',
  },
  {
    front: 'DNSSEC',
    back: 'Signed DNS records that provide authenticity and integrity, but not privacy.',
  },
  {
    front: 'Same Origin Policy requires matching what?',
    back: 'Protocol, full domain, and port.',
  },
  {
    front: "Cohen's Kappa",
    back: 'Annotator agreement adjusted for chance agreement.',
  },
  {
    front: 'Projectivity in dependency parsing',
    back: 'Every subtree occupies a contiguous span, with no crossing arcs.',
  },
  {
    front: 'Cross entropy measures what?',
    back: 'How close an estimated distribution is to the true distribution.',
  },
  {
    front: 'Injective function',
    back: 'Distinct inputs map to distinct outputs.',
  },
  {
    front: 'Master Theorem $c$ value',
    back: '$c = \\log_b(a)$',
  },
  {
    front: 'Residual capacity',
    back: '$c_f(u,v) = c(u,v) - f(u,v)$',
  },
  {
    front: 'Edmonds-Karp improvement',
    back: 'Uses BFS for augmenting paths, giving $O(VE^2)$.',
  },
]

const cardFaceClasses =
  'absolute inset-0 flex flex-col items-center justify-center overflow-hidden rounded-[1.25rem] border border-border p-6 min-[481px]:p-10 shadow-[0_24px_60px_hsl(var(--foreground)/0.08),inset_0_1px_0_hsl(var(--foreground)/0.05)] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]'

type SwapPhase = 'idle' | 'leaving' | 'waiting' | 'entering'

export default function FlashcardDeck() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [hasFlipped, setHasFlipped] = useState(false)
  const [swapPhase, setSwapPhase] = useState<SwapPhase>('idle')
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([])
  const card = flashcards[currentIndex]
  const canGoNext =
    isFlipped &&
    currentIndex < flashcards.length - 1 &&
    swapPhase === 'idle'

  useEffect(() => {
    const activeTimers = timers.current

    return () => {
      activeTimers.forEach(clearTimeout)
    }
  }, [])

  const flipCard = () => {
    if (swapPhase !== 'idle') return

    if (isFlipped && currentIndex < flashcards.length - 1) {
      nextCard()
      return
    }

    setIsFlipped((flipped) => !flipped)
    setHasFlipped(true)
  }

  const nextCard = () => {
    if (!canGoNext) return

    setSwapPhase('leaving')

    timers.current.push(
      setTimeout(() => {
        setCurrentIndex((index) => index + 1)
        setIsFlipped(false)
        setSwapPhase('waiting')

        timers.current.push(
          setTimeout(() => {
            setSwapPhase('entering')

            timers.current.push(
              setTimeout(() => {
                setSwapPhase('idle')
              }, 420),
            )
          }, 40),
        )
      }, 340),
    )
  }

  const handleCardKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      flipCard()
    }

  }

  return (
    <section className="my-8 mb-10" aria-label="Example flashcards">
      <div className="relative min-h-72 min-[481px]:min-h-80 [perspective:1200px]">
        <div
          className={cn(
            'relative min-h-72 w-full [transform-style:preserve-3d] min-[481px]:min-h-80',
            swapPhase !== 'idle' && 'pointer-events-none',
          )}
          style={{
            opacity:
              swapPhase === 'leaving' || swapPhase === 'waiting' ? 0 : 1,
            transform:
              swapPhase === 'leaving'
                ? 'translateX(-45%) rotate(-8deg)'
                : swapPhase === 'waiting'
                  ? 'translateX(45%) rotate(6deg)'
                  : 'translateX(0) rotate(0)',
            transition:
              swapPhase === 'waiting'
                ? 'none'
                : 'transform 340ms cubic-bezier(0.4, 0, 0.2, 1), opacity 240ms ease',
          }}>
          <div
            className={cn(
              'relative min-h-72 w-full cursor-pointer select-none rounded-[1.25rem] [transform-style:preserve-3d] [-webkit-tap-highlight-color:transparent] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-accent min-[481px]:min-h-80',
              isFlipped && '[transform:rotateY(180deg)]',
            )}
            style={{
              transition:
                swapPhase === 'idle'
                  ? 'transform 900ms cubic-bezier(0.34, 1.35, 0.64, 1)'
                  : 'none',
            }}
            role="button"
            tabIndex={0}
            aria-label={`${isFlipped ? `Answer: ${card.back}` : `Question: ${card.front}`} Card ${
              currentIndex + 1
            } of ${flashcards.length}. ${
              isFlipped && currentIndex < flashcards.length - 1
                ? 'Press Enter or Space for the next card.'
                : 'Press Enter or Space to flip.'
            }`}
            aria-pressed={isFlipped}
            onClick={flipCard}
            onKeyDown={handleCardKeyDown}>
            <div
              className={cn(
                cardFaceClasses,
                'bg-[radial-gradient(circle_at_15%_10%,hsl(var(--accent)/0.1),transparent_35%),hsl(var(--background))]',
              )}>
              <span className="absolute left-1/2 top-5 -translate-x-1/2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted opacity-50">
                Question
              </span>
              <div className="relative z-10 max-w-[34rem] text-balance text-center text-[clamp(1.35rem,4vw,2rem)] leading-[1.35] text-foreground">
                <Latex>{card.front}</Latex>
              </div>
              {!hasFlipped && (
                <span className="absolute bottom-[1.2rem] flex items-center gap-1.5 text-[0.72rem] text-muted">
                  <RotateCw size={12} aria-hidden="true" />
                  Tap to reveal
                </span>
              )}
            </div>

            <div
              className={cn(
                cardFaceClasses,
                '[transform:rotateY(180deg)] bg-[radial-gradient(circle_at_85%_90%,hsl(var(--accent)/0.16),transparent_38%),hsl(var(--card))]',
              )}>
              <span className="absolute left-1/2 top-5 -translate-x-1/2 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted opacity-50">
                Answer
              </span>
              <div className="relative z-10 max-w-[34rem] text-balance text-center text-[clamp(1.35rem,4vw,2rem)] leading-[1.35] text-foreground">
                <Latex>{card.back}</Latex>
              </div>
              {currentIndex === 0 && isFlipped && (
                <span className="absolute bottom-[1.2rem] text-[0.72rem] text-muted">
                  Tap for next
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
