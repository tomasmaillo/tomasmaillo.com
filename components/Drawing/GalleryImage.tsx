'use client'

import { useState, type ReactNode } from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

interface GalleryImageProps {
  src: string
  author: string
  caption?: ReactNode
  overlayCaption?: boolean
  frameClassName?: string
}

export default function GalleryImage(props: GalleryImageProps) {
  // A changed URL starts a fresh loading state, including refreshed drawings.
  return <ImageReveal key={props.src} {...props} />
}

function ImageReveal({
  src,
  author,
  caption,
  overlayCaption = false,
  frameClassName = '',
}: GalleryImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading')
  const pending = status === 'loading'
  const revealClass = `transition-opacity duration-500 motion-reduce:transition-none ${pending ? 'opacity-0' : 'opacity-100'}`

  return (
    <div className="space-y-2" aria-busy={pending}>
      <div className={`relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-background shadow-md ${frameClassName}`}>
        {pending && (
          <div role="status" className="absolute inset-0 flex items-center justify-center bg-muted/60 text-muted-foreground">
            <Loader2 aria-hidden="true" className="h-4 w-4 motion-safe:animate-spin" />
            <span className="sr-only">Loading drawing by {author || 'an anonymous visitor'}…</span>
          </div>
        )}
        {status === 'error' ? (
          <div className="absolute inset-0 flex items-center justify-center p-3 text-center text-xs text-muted-foreground" role="status">
            Image unavailable
          </div>
        ) : (
          <Image
            unoptimized
            src={src}
            alt={`Drawing by ${author || 'an anonymous visitor'}`}
            fill
            draggable={false}
            className={`pointer-events-none object-contain ${revealClass}`}
            onLoad={() => setStatus('loaded')}
            onError={() => setStatus('error')}
          />
        )}
        {overlayCaption && <div className={revealClass}>{caption}</div>}
      </div>
      {!overlayCaption && caption && (
        <div className="relative">
          {pending && (
            <div aria-hidden="true" className="absolute inset-0 space-y-2 motion-safe:animate-pulse">
              <div className="h-4 w-24 rounded bg-muted/70" />
              <div className="h-3 w-full rounded bg-muted/50" />
              <div className="h-3 w-4/5 rounded bg-muted/50" />
            </div>
          )}
          <div aria-hidden={pending} className={revealClass}>{caption}</div>
        </div>
      )}
    </div>
  )
}
