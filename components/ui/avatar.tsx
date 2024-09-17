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
  url: string
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
      <Image
        src={url}
        alt="Avatar"
        width={100}
        height={100}
        draggable={false}
        className={cn(
          'relative h-4 w-4 shrink-0 overflow-hidden rounded-full inline-block align-text-top select-none'
        )}
      />
      {name && <span className="text-sm ml-1">{name}</span>} {link && '↗'}
    </Link>
  )
}
export default Avatar
