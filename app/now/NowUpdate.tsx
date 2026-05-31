import type { CSSProperties, ReactElement, ReactNode } from 'react'
import { isValidElement } from 'react'
import { cn } from '@/lib/utils'

/** Stable string from children for hashing (text + structure; MDX-safe). */
function reactNodeSignature(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(reactNodeSignature).join('\0')
  if (isValidElement(node)) return elementSignature(node)
  return ''
}

function elementSignature(el: ReactElement): string {
  const { children, ...rest } = el.props as {
    children?: ReactNode
    [k: string]: unknown
  }
  // DOM tags only: custom components minify in prod and would change the hash.
  const type = typeof el.type === 'string' ? el.type : 'C'
  const key = el.key != null ? String(el.key) : ''
  const primitives = Object.keys(rest)
    .sort()
    .map((k) => {
      const v = rest[k]
      if (typeof v === 'string' || typeof v === 'number') return `${k}=${v}`
      return ''
    })
    .filter(Boolean)
    .join('|')
  return `<${type}#${key}${primitives ? ` ${primitives}` : ''}>${reactNodeSignature(children)}</${type}>`
}

function fnv1a32(str: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** Maps hash to approximately uniform [-1, 1]. */
function unitIntervalFromHash(h: number): number {
  return (h / 0xffff_ffff) * 2 - 1
}

function tiltsFromChildren(
  children: ReactNode,
  fallback: string,
): {
  tiltWide: number
  tiltMobile: number
} {
  let sig = reactNodeSignature(children)
  if (!sig.trim()) sig = fallback
  const u = unitIntervalFromHash(fnv1a32(sig))
  return { tiltWide: u * 1, tiltMobile: u * 0.25 }
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

function ordinalDay(n: number): string {
  const j = n % 10
  const k = n % 100
  if (j === 1 && k !== 11) return `${n}st`
  if (j === 2 && k !== 12) return `${n}nd`
  if (j === 3 && k !== 13) return `${n}rd`
  return `${n}th`
}

/** Parse MDX `date="YYYY-MM-DD"` as local calendar date (avoids UTC off-by-one). */
function toCalendarDate(date: Date | string): Date {
  if (date instanceof Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  }
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date.trim())
  if (iso) {
    const y = Number(iso[1])
    const m = Number(iso[2]) - 1
    const d = Number(iso[3])
    return new Date(y, m, d)
  }
  const parsed = new Date(date)
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate())
}

function calendarDayDiff(from: Date, to: Date): number {
  const a = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  const b = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate())
  return Math.round((b - a) / 86400000)
}

function formatSingleUnitAgo(postDay: Date, now: Date): string {
  const dayDiff = calendarDayDiff(postDay, now)

  if (dayDiff < 0) {
    return 'upcoming'
  }
  if (dayDiff === 0) {
    const hours = Math.floor((now.getTime() - postDay.getTime()) / 3_600_000)
    if (hours >= 1) return `${hours}h ago`
    const mins = Math.floor((now.getTime() - postDay.getTime()) / 60_000)
    if (mins >= 1) return `${mins}m ago`
    return 'today'
  }

  let years = now.getFullYear() - postDay.getFullYear()
  if (
    now.getMonth() < postDay.getMonth() ||
    (now.getMonth() === postDay.getMonth() && now.getDate() < postDay.getDate())
  ) {
    years -= 1
  }
  if (years >= 1) return `${years}y ago`

  let months =
    (now.getFullYear() - postDay.getFullYear()) * 12 +
    (now.getMonth() - postDay.getMonth())
  if (now.getDate() < postDay.getDate()) months -= 1
  if (months >= 1) return `${months}mo ago`

  return `${dayDiff}d ago`
}

function formatDisplayDate(postDay: Date, now: Date): string {
  const day = postDay.getDate()
  const month = MONTHS[postDay.getMonth()]
  const year = postDay.getFullYear()
  const sameYear = year === now.getFullYear()
  const dateCore = sameYear
    ? `${ordinalDay(day)} ${month}`
    : `${ordinalDay(day)} ${month} ${year}`
  const ago = formatSingleUnitAgo(postDay, now)
  return `${dateCore} (${ago})`
}

function toISODateString(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

type NowUpdateProps = {
  children: ReactNode
  date: Date | string
  location: string
  className?: string
}

const jaggedPaper = `polygon(
  0.8% 1.8%, 8% 0.6%, 16% 1.7%, 27% 0.7%,
  38% 1.9%, 50% 0.5%, 63% 1.5%, 75% 0.8%,
  87% 1.8%, 98.8% 0.9%, 98.2% 12%, 99.5% 25%,
  98.4% 38%, 99.6% 52%, 98.5% 66%, 99.3% 81%,
  98.4% 98.8%, 87% 98%, 76% 99.4%, 64% 98.2%,
  51% 99.5%, 39% 98.4%, 27% 99.2%, 15% 98.1%,
  1.2% 99%, 1.9% 86%, 0.6% 73%, 1.7% 60%,
  0.5% 46%, 1.5% 33%, 0.7% 19%
)`

export default function NowUpdate({
  children,
  date,
  location,
  className,
}: NowUpdateProps) {
  const postDay = toCalendarDate(date)
  const now = new Date()
  const displayDate = formatDisplayDate(postDay, now)
  const iso = toISODateString(postDay)
  const { tiltWide, tiltMobile } = tiltsFromChildren(
    children,
    `${iso}\0${location}`,
  )

  const wrapperStyle = {
    filter:
      'drop-shadow(0 1.35rem 1.15rem var(--now-shadow-main)) drop-shadow(0 0.28rem 0.25rem var(--now-shadow-tight))',
    transformOrigin: '48% 12%',
    '--now-tilt': `${tiltMobile}deg`,
    '--now-tilt-wide': `${tiltWide}deg`,
  } as CSSProperties

  const paperStyle = {
    background:
      'radial-gradient(circle, var(--now-paper-fleck) 1px, transparent 1px) 0 0 / 22px 20px, var(--now-paper)',
    clipPath: jaggedPaper,
  } satisfies CSSProperties

  return (
    <div
      className={cn(
        "my-10 -mx-1 [--now-shadow-main:rgba(30,24,18,0.188)] [--now-shadow-tight:rgba(30,24,18,0.069)] [transform:rotate(var(--now-tilt))] [[data-theme='dark']_&]:[--now-shadow-main:rgba(0,0,0,0.42)] [[data-theme='dark']_&]:[--now-shadow-tight:rgba(0,0,0,0.25)] sm:[transform:rotate(var(--now-tilt-wide))]",
        className,
      )}
      style={wrapperStyle}>
      <article
        className="relative px-5 py-6 text-[var(--now-paper-ink)] [--now-paper:#ffffff] [--now-paper-fleck:rgba(35,29,22,0.055)] [--now-paper-ink:#241f1a] [--now-paper-muted:rgba(36,31,26,0.6)] [[data-theme='dark']_&]:[--now-paper:#1b1815] [[data-theme='dark']_&]:[--now-paper-fleck:rgba(255,246,230,0.075)] [[data-theme='dark']_&]:[--now-paper-ink:#f5efe5] [[data-theme='dark']_&]:[--now-paper-muted:rgba(245,239,229,0.64)] sm:px-9 sm:py-8"
        style={paperStyle}
        aria-label={`Now update written on ${displayDate} from ${location}`}>
        <header className="mt-6 mb-2 flex flex-wrap gap-x-2 gap-y-1 text-xs leading-snug text-[var(--now-paper-muted)]">
          <time dateTime={iso}>{displayDate}</time>
          <span aria-hidden="true" className="select-none">
            /
          </span>
          <span>{location}</span>
        </header>
        <div>{children}</div>
      </article>
    </div>
  )
}
