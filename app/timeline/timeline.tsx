import { retrieveContributionData } from './fetchGithubContributions'
import { ALL_ANNOTATIONS, isPointAnnotation } from './timeline-annotations'
import { TimelineRows } from './timeline-rows'
import {
  CELL,
  GAP,
  rechunkWeeks,
  ROW_STEP,
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

    type AnnWork = AnnotationLayout & { top: number; height: number }

    const rawPositions: AnnWork[] = ALL_ANNOTATIONS.map((ann, annIndex) => {
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
          col: 0,
          top: row * ROW_STEP,
          height: CELL,
        }
      }

      const r0 = findRow(new Date(ann.to + 'T00:00:00'))
      const r1 = findRow(new Date(ann.from + 'T00:00:00'))
      const top = r0 * ROW_STEP
      const height = Math.max((r1 - r0 + 1) * ROW_STEP - GAP, CELL)

      return {
        annIndex,
        kind,
        isPoint: false,
        r0,
        r1,
        barCol: 0,
        col: 0,
        top,
        height,
      }
    })

    const barColumns: AnnWork[][] = []
    for (const ann of rawPositions) {
      let placed = false
      for (let c = 0; c < barColumns.length; c++) {
        const overlaps = barColumns[c].some(
          (a) =>
            !(a.top + a.height <= ann.top || ann.top + ann.height <= a.top),
        )
        if (!overlaps) {
          ann.barCol = c
          barColumns[c].push(ann)
          placed = true
          break
        }
      }
      if (!placed) {
        ann.barCol = barColumns.length
        barColumns.push([ann])
      }
    }

    const LABEL_HEIGHT_EST = ROW_STEP
    const labelColumns: AnnWork[][] = []
    for (const ann of rawPositions) {
      let placed = false
      for (let c = 0; c < labelColumns.length; c++) {
        const overlaps = labelColumns[c].some(
          (a) =>
            !(
              a.top + LABEL_HEIGHT_EST <= ann.top ||
              ann.top + LABEL_HEIGHT_EST <= a.top
            ),
        )
        if (!overlaps) {
          ann.col = c
          labelColumns[c].push(ann)
          placed = true
          break
        }
      }
      if (!placed) {
        ann.col = labelColumns.length
        labelColumns.push([ann])
      }
    }

    const numBarCols = barColumns.length

    const layouts: AnnotationLayout[] = rawPositions.map(
      ({ annIndex, kind, isPoint, r0, r1, barCol, col }) => ({
        annIndex,
        kind,
        isPoint,
        r0,
        r1,
        barCol,
        col,
      }),
    )

    return (
      <div className="max-w-full">
        <TimelineRows
          weeks={weeks}
          maxCount={maxCount}
          markers={markers}
          layouts={layouts}
          numBarCols={numBarCols}
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
