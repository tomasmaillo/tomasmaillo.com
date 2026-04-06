import { cn } from '@/lib/utils'

type SpacingProps = {
  lines?: number
  className?: string
}

export default function Spacing({ lines = 1, className }: SpacingProps) {
  const safeLines = Number.isFinite(lines) ? Math.max(0, lines) : 1

  if (safeLines === 0) return null

  return (
    <div
      aria-hidden="true"
      className={cn('block w-full select-none', className)}
      style={{ height: `calc(${safeLines} * 1.5em)` }}
    />
  )
}
