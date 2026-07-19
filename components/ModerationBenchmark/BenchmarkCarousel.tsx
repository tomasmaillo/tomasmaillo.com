'use client'

import Image from 'next/image'
import { Eye, EyeOff, ShieldAlert } from 'lucide-react'
import { useState } from 'react'

type Drawing = {
  src: string
  alt: string
  caption: string
  sensitive?: string
}

const drawings: Drawing[] = [
  {
    src: '/posts/moderation-benchmark/hearts.png',
    alt: 'Two purple hearts and the word hi',
    caption: 'A straightforward approval.',
  },
  {
    src: '/posts/moderation-benchmark/computer.png',
    alt: 'A hand-drawn desktop computer',
    caption: 'Real drawings, not polished test images.',
  },
  {
    src: '/posts/moderation-benchmark/mountains.png',
    alt: 'Mountains, trees and a sun',
    caption: 'A safe scene from the gallery.',
  },
  {
    src: '/posts/moderation-benchmark/unsafe-hate-symbol.png',
    alt: 'A benchmark submission containing a hate symbol',
    caption: 'A rejected example used to measure recall.',
    sensitive: 'hate symbol',
  },
]

export function BenchmarkCarousel() {
  const [revealed, setRevealed] = useState(false)

  return (
    <figure className="my-9 md:-ml-24 md:w-[calc(100%+12rem)]">
      <div
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-5 pt-1"
        role="region"
        aria-label="Drawings from the moderation benchmark">
        {drawings.map((drawing, index) => {
          const isSensitive = Boolean(drawing.sensitive)
          const isVisible = !isSensitive || revealed

          return (
            <article
              key={drawing.src}
              className="w-[78%] min-w-[15rem] max-w-[18rem] shrink-0 snap-start rounded-lg border bg-card shadow-[0_6px_22px_rgba(0,0,0,0.09)] sm:w-[42%]">
              <div className="relative aspect-[4/3] bg-white">
                {isVisible ? (
                  <Image
                    src={drawing.src}
                    alt={drawing.alt}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 640px) 78vw, 288px"
                    className="object-contain"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-background px-6 text-center">
                    <ShieldAlert
                      className="mb-3 h-5 w-5 text-accent"
                      aria-hidden="true"
                    />
                    <div className="text-sm font-medium">Content warning</div>
                    <p className="mb-0 mt-2 text-xs leading-relaxed text-muted">
                      This rejected drawing contains a {drawing.sensitive}. It
                      may be offensive or not safe for work.
                    </p>
                    <button
                      type="button"
                      onClick={() => setRevealed(true)}
                      className="mt-4 inline-flex items-center gap-2 border-b border-foreground pb-0.5 text-xs text-foreground transition-colors hover:border-accent hover:text-accent">
                      <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                      Reveal drawing
                    </button>
                  </div>
                )}

                {isSensitive && isVisible && (
                  <button
                    type="button"
                    onClick={() => setRevealed(false)}
                    className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-[10px] text-foreground shadow-sm backdrop-blur transition-colors hover:text-accent"
                    aria-label="Hide sensitive drawing">
                    <EyeOff className="h-3 w-3" aria-hidden="true" />
                    Hide
                  </button>
                )}
              </div>

              <div className="min-h-20 border-t px-4 py-3">
                <div className="font-mono text-[10px] uppercase tracking-wide text-accent">
                  {isSensitive ? 'Rejected' : 'Approved'} ·{' '}
                  {String(index + 1).padStart(2, '0')}
                </div>
                <p className="mb-0 mt-1.5 text-xs leading-relaxed text-muted">
                  {drawing.caption}
                </p>
              </div>
            </article>
          )
        })}
      </div>
      <figcaption className="mt-1 text-center text-xs text-muted">
        Four real benchmark submissions. Scroll sideways to see them all; the
        rejected example is hidden behind a warning.
      </figcaption>
    </figure>
  )
}
