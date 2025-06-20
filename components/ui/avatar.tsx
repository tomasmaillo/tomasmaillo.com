'use client'

import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'

const Avatar = ({
  url,
  className,
  name,
  link,
}: {
  url?: string
  className?: string
  name?: string
  link: string
}) => {
  return (
    <Link
      href={link || '#'}
      className={cn(
        'bg-card rounded-full py-0.5 pl-1 pr-1.5 inline-block',
        className
      )}>
      {url ? (
        <Image
          src={url || '/placeholder-avatar.png'}
          alt="Avatar"
          width={100}
          height={100}
          draggable={false}
          className={cn(
            'relative h-4 w-4 shrink-0 overflow-hidden rounded-full inline-block align-text-top select-none'
          )}
        />
      ) : (
        <div className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full inline-flex items-center justify-center align-text-top select-none bg-accent">
          <span className="text-sm text-white">?</span>
        </div>
      )}
      {name && <span className="text-sm ml-1">{name}</span>} {link && '↗'}
    </Link>
  )
}
export default Avatar
