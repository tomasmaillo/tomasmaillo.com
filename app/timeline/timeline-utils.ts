import type { ContributionDay } from './fetchGithubContributions'
import type { AnnotationKind } from './timeline-annotations'

/** Packed layout for one annotation (week rows are indices into reversed `weeks`). */
export type AnnotationLayout = {
  annIndex: number
  kind: AnnotationKind
  isPoint: boolean
  /** Inclusive row span; `r0` is the row where the label sits (same as legacy `top` row). */
  r0: number
  r1: number
  barCol: number
  col: number
}

export const CELL = 10
export const GAP = 2
export const ROW_STEP = CELL
export const ANNOTATION_COL_WIDTH = 120

export function contributionLevel(count: number, max: number): number {
  if (count <= 0) return 0
  if (max <= 0) return 1
  const r = count / max
  if (r < 0.25) return 1
  if (r < 0.5) return 2
  if (r < 0.75) return 3
  return 4
}

export const LEVEL_CLASS = [
  'bg-zinc-500/10',
  'bg-emerald-800/50',
  'bg-emerald-600/60',
  'bg-emerald-500/70',
  'bg-emerald-400/90',
]

export type Cell = ContributionDay | null

export function weekStartDate(week: Cell[]): Date | null {
  for (const cell of week) {
    if (cell) return new Date(cell.date + 'T00:00:00')
  }
  return null
}

/** ISO day-of-week: 1 = Monday … 7 = Sunday */
export function isoDow(date: string): number {
  const dow = new Date(date + 'T00:00:00').getDay()
  return dow === 0 ? 7 : dow
}

export function rechunkWeeks(rawWeeks: ContributionDay[][]): Cell[][] {
  const dayMap = new Map<string, ContributionDay>()
  for (const week of rawWeeks) {
    for (const day of week) {
      const existing = dayMap.get(day.date)
      if (!existing || day.contributionCount > existing.contributionCount) {
        dayMap.set(day.date, day)
      }
    }
  }

  const sorted = Array.from(dayMap.values()).sort((a, b) =>
    a.date.localeCompare(b.date),
  )
  if (sorted.length === 0) return []

  const weeks: Cell[][] = []
  let current: Cell[] = []

  for (const day of sorted) {
    const dow = isoDow(day.date)

    if (dow === 1 && current.length > 0) {
      while (current.length < 7) current.push(null)
      weeks.push(current)
      current = []
    }

    if (current.length === 0 && dow > 1) {
      for (let i = 1; i < dow; i++) current.push(null)
    }

    current.push(day)
  }

  if (current.length > 0) {
    while (current.length < 7) current.push(null)
    weeks.push(current)
  }

  return weeks
}
