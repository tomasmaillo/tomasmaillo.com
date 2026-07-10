import { retrieveContributionData } from './fetchGithubContributions'
import { ALL_ANNOTATIONS, isPointAnnotation } from './timeline-annotations'
import { TimelineRows } from './timeline-rows'
import {
  rechunkWeeks,
  weekStartDate,
  type AnnotationLayout,
} from './timeline-utils'

const USERNAME = 'tomasmaillo'

export default async function Timeline() {
  try {
    const data = await retrieveContributionData(USERNAME, {
      from: '1970-01-01T00:00:00.000Z',
    })

    const allWeeks = rechunkWeeks(data.weeks)

    const firstActive = allWeeks.findIndex((w) =>
      w.some((cell) => cell && cell.contributionCount > 0),
    )
    const active = firstActive === -1 ? allWeeks : allWeeks.slice(firstActive)
    const weeks = [...active].reverse()

    const maxCount = active
      .flat()
      .reduce((m, cell) => Math.max(m, cell?.contributionCount ?? 0), 0)

    const markers: { label: string; row: number }[] = []
    let prevYear = ''

    for (let i = 0; i < weeks.length; i++) {
      const d = weekStartDate(weeks[i])
      if (!d) continue
      const y = String(d.getFullYear())
      if (y !== prevYear) {
        markers.push({ label: i === 0 ? 'Now' : y, row: i })
        prevYear = y
      }
    }

    const findRow = (date: Date): number => {
      for (let i = 0; i < weeks.length; i++) {
        const wd = weekStartDate(weeks[i])
        if (wd && wd <= date) return i
      }
      return weeks.length - 1
    }

    const rawPositions: AnnotationLayout[] = ALL_ANNOTATIONS.map(
      (ann, annIndex) => {
        const kind = ann.kind ?? 'personal'

        if (isPointAnnotation(ann)) {
          const row = findRow(new Date(ann.at + 'T00:00:00'))
          return {
            annIndex,
            kind,
            isPoint: true,
            r0: row,
            r1: row,
            barCol: 0,
          }
        }

        return {
          annIndex,
          kind,
          isPoint: false,
          r0: findRow(new Date(ann.to + 'T00:00:00')),
          r1: findRow(new Date(ann.from + 'T00:00:00')),
          barCol: 0,
        }
      },
    )

    // Interval partitioning gives each overlapping annotation a dedicated
    // connector track, with the smallest possible number of tracks.
    const barColumns: AnnotationLayout[][] = []
    const positionsByStart = [...rawPositions].sort(
      (a, b) => a.r0 - b.r0 || a.r1 - b.r1 || a.annIndex - b.annIndex,
    )

    for (const ann of positionsByStart) {
      const column = barColumns.findIndex((existing) =>
        existing.every((other) => other.r1 < ann.r0 || ann.r1 < other.r0),
      )
      const barCol = column === -1 ? barColumns.length : column

      ann.barCol = barCol
      if (column === -1) barColumns.push([ann])
      else barColumns[barCol].push(ann)
    }

    return (
      <div className="max-w-full">
        <TimelineRows
          weeks={weeks}
          maxCount={maxCount}
          markers={markers}
          layouts={rawPositions}
          numBarCols={barColumns.length}
        />
      </div>
    )
  } catch (error) {
    console.error('Timeline error:', error)
    return (
      <p className="text-xs text-zinc-500">Unable to load contribution data.</p>
    )
  }
}
