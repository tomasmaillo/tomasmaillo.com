'use client'

import Image from 'next/image'
import {
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  ALL_ANNOTATIONS,
  type AnnotationCategory,
} from './timeline-annotations'
import type { AnnotationLayout } from './timeline-utils'
import {
  CELL,
  contributionLevel,
  GAP,
  LEVEL_CLASS,
  ROW_STEP,
  type Cell,
} from './timeline-utils'

const BAR_COL_WIDTH = 6
const COLUMN_GAP = 10
const MARKER_WIDTH = 38
const GRID_WIDTH = CELL * 7 + GAP * 6
const ROW_PITCH = ROW_STEP + GAP
const HEADER_HEIGHT = 14
const LABEL_GAP = 8
const LABEL_LEADER_OFFSET = 6.5
const DAY_NAMES = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
] as const
const DAY_INITIALS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const
const DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})
const CATEGORY_FILTERS: readonly {
  value: AnnotationCategory
  label: string
}[] = [
  { value: 'living', label: 'Living' },
  { value: 'education', label: 'Education' },
  { value: 'career', label: 'Career' },
  { value: 'projects', label: 'Projects' },
  { value: 'hackathons', label: 'Hackathons' },
  { value: 'world', label: 'World' },
]

type PackedRail = {
  positions: Record<number, number>
  height: number
  ready: boolean
}

type TooltipDay = {
  date: string
  count: number
}

type TimelineTooltipHandle = {
  show: (day: TooltipDay, x: number, y: number) => void
  hide: () => void
}

function isWorld(kind: AnnotationLayout['kind']) {
  return kind === 'world'
}

function inkClassName(kind: AnnotationLayout['kind']) {
  return isWorld(kind) ? 'timeline-ink-world' : 'timeline-ink-personal'
}

function anchorTop(layout: AnnotationLayout) {
  return layout.r0 * ROW_PITCH
}

function rowCentre(row: number) {
  return row * ROW_PITCH + CELL / 2
}

function contributionSummary(count: number) {
  if (count === 0) return 'No contributions'
  return `${count} ${count === 1 ? 'contribution' : 'contributions'}`
}

function formattedDate(date: string) {
  return DATE_FORMATTER.format(new Date(`${date}T00:00:00Z`))
}

const TimelineTooltip = forwardRef<TimelineTooltipHandle>(
  function TimelineTooltip(_, forwardedRef) {
    const [day, setDay] = useState<TooltipDay | null>(null)
    const [visible, setVisible] = useState(false)
    const [size, setSize] = useState<{ width: number; height: number } | null>(
      null,
    )
    const elementRef = useRef<HTMLDivElement>(null)
    const contentRef = useRef<HTMLDivElement>(null)
    const activeDateRef = useRef<string | null>(null)
    const positionRef = useRef({ x: 0, y: 0 })
    const frameRef = useRef<number | null>(null)

    const positionAt = useCallback((x: number, y: number) => {
      positionRef.current = { x, y }
      if (frameRef.current !== null) return

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null
        const tooltip = elementRef.current
        if (!tooltip) return

        const pointer = positionRef.current
        const bounds = tooltip.getBoundingClientRect()
        const left =
          pointer.x + 14 + bounds.width > window.innerWidth - 8
            ? pointer.x - bounds.width - 14
            : pointer.x + 14
        const top =
          pointer.y + 14 + bounds.height > window.innerHeight - 8
            ? pointer.y - bounds.height - 14
            : pointer.y + 14

        tooltip.style.transform = `translate3d(${left}px, ${top}px, 0)`
      })
    }, [])

    useImperativeHandle(
      forwardedRef,
      () => ({
        show(nextDay, x, y) {
          if (activeDateRef.current !== nextDay.date) {
            activeDateRef.current = nextDay.date
            setDay(nextDay)
          }
          setVisible(true)
          positionAt(x, y)
        },
        hide() {
          if (activeDateRef.current === null) return
          activeDateRef.current = null
          setVisible(false)
        },
      }),
      [positionAt],
    )

    useLayoutEffect(
      () => () => {
        if (frameRef.current !== null) {
          window.cancelAnimationFrame(frameRef.current)
        }
      },
      [],
    )

    useLayoutEffect(() => {
      const content = contentRef.current
      if (!day || !content) return

      const bounds = content.getBoundingClientRect()
      setSize({
        width: Math.ceil(bounds.width) + 22,
        height: Math.ceil(bounds.height) + 18,
      })
    }, [day])

    return (
      <div
        ref={elementRef}
        role="tooltip"
        aria-hidden={!visible}
        className={`timeline-tooltip pointer-events-none fixed left-0 top-0 z-50 overflow-hidden rounded-md border px-2.5 py-2 text-left transition-[opacity,width,height] duration-150 ease-out motion-reduce:transition-none ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: 'translate3d(-999px, -999px, 0)',
          willChange: visible ? 'transform' : 'auto',
          width: size?.width,
          height: size?.height,
        }}>
        {day && (
          <div ref={contentRef} className="w-max">
            <div className="text-[11px] font-medium leading-none">
              {formattedDate(day.date)}
            </div>
            <div className="timeline-tooltip-detail mt-1 text-[10px] leading-none">
              {contributionSummary(day.count)}
            </div>
          </div>
        )}
      </div>
    )
  },
)

function railIsEqual(a: PackedRail, b: PackedRail) {
  if (a.ready !== b.ready || Math.abs(a.height - b.height) > 0.5) return false

  const aKeys = Object.keys(a.positions)
  const bKeys = Object.keys(b.positions)
  if (aKeys.length !== bKeys.length) return false

  return aKeys.every((key) => {
    const index = Number(key)
    return Math.abs(a.positions[index] - b.positions[index]) <= 0.5
  })
}

/** Animates height open/close; keeps the media mounted while it closes. */
function CollapsibleHeight({
  open,
  children,
}: {
  open: boolean
  children: ReactNode
}) {
  const [content, setContent] = useState<ReactNode>(null)

  useLayoutEffect(() => {
    if (open) setContent(children)
  }, [open, children])

  return (
    <div
      className="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none"
      style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      onTransitionEnd={(event) => {
        if (event.target !== event.currentTarget) return
        if (event.propertyName !== 'grid-template-rows') return
        if (!open) setContent(null)
      }}>
      <div className="min-h-0 overflow-hidden">{content}</div>
    </div>
  )
}

function AnnotationInk({
  layout,
  labelLeft,
  top,
  height,
}: {
  layout: AnnotationLayout
  labelLeft: number
  top: number
  height: number
}) {
  const gridLeft = MARKER_WIDTH + COLUMN_GAP
  const trackX =
    gridLeft + GRID_WIDTH + COLUMN_GAP + layout.barCol * BAR_COL_WIDTH + BAR_COL_WIDTH / 2
  const rowY = rowCentre(layout.r0)
  const targetY = top + LABEL_LEADER_OFFSET
  const pointX =
    gridLeft + (layout.dayCol ?? 6) * (CELL + GAP) + CELL / 2
  const usesCircle = layout.isPoint || layout.r1 - layout.r0 <= 1

  const rangeBottom = Math.max(rowCentre(layout.r1), rowY + 10)
  const rangeMid = (rowY + rangeBottom) / 2
  const rangeQuarter = (rangeBottom - rowY) / 4
  const startX = usesCircle ? pointX + CELL / 2 + 2.5 : trackX + 6
  const startY = usesCircle ? rowY : rangeMid
  const controlOffset = Math.min(34, Math.max(18, (labelLeft - startX) * 0.34))
  const leader = `M ${startX} ${startY} C ${startX + controlOffset} ${startY}, ${labelLeft - controlOffset} ${targetY}, ${labelLeft} ${targetY}`

  const brace = [
    `M ${trackX - 3} ${rowY}`,
    `C ${trackX + 2.5} ${rowY}, ${trackX + 2.5} ${rowY + rangeQuarter * 0.72}, ${trackX + 2.5} ${rangeMid - 3}`,
    `C ${trackX + 2.5} ${rangeMid - 1}, ${trackX + 6} ${rangeMid - 1}, ${trackX + 6} ${rangeMid}`,
    `C ${trackX + 2.5} ${rangeMid + 1}, ${trackX + 2.5} ${rangeMid + 1}, ${trackX + 2.5} ${rangeMid + 3}`,
    `C ${trackX + 2.5} ${rangeBottom - rangeQuarter * 0.72}, ${trackX + 2.5} ${rangeBottom}, ${trackX - 3} ${rangeBottom}`,
  ].join(' ')

  const circle = [
    `M ${pointX - 6.5} ${rowY - 1}`,
    `C ${pointX - 6.1} ${rowY - 6.1}, ${pointX - 1.8} ${rowY - 7.2}, ${pointX + 2.2} ${rowY - 6.5}`,
    `C ${pointX + 6.5} ${rowY - 5.7}, ${pointX + 7.3} ${rowY - 1.2}, ${pointX + 6.4} ${rowY + 2.5}`,
    `C ${pointX + 5.4} ${rowY + 6.4}, ${pointX + 0.8} ${rowY + 7}, ${pointX - 3} ${rowY + 6}`,
    `C ${pointX - 6.8} ${rowY + 5}, ${pointX - 7.2} ${rowY + 1.7}, ${pointX - 6.5} ${rowY - 1}`,
  ].join(' ')

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 z-[1] overflow-visible ${inkClassName(layout.kind)}`}
      width="100%"
      height={height}
      preserveAspectRatio="none">
      <path d={usesCircle ? circle : brace} vectorEffect="non-scaling-stroke" />
      <path d={leader} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

function AnnotationCard({
  layout,
  top,
  expanded,
  toggle,
  cardRef,
}: {
  layout: AnnotationLayout
  top: number
  expanded: boolean
  toggle: (annIndex: number) => void
  cardRef: (element: HTMLElement | null) => void
}) {
  const annotation = ALL_ANNOTATIONS[layout.annIndex]
  if (!annotation) return null

  const media = annotation.media
  const mediaId = `timeline-annotation-media-${layout.annIndex}`

  return (
    <section
      ref={cardRef}
      className="absolute left-0 right-0 min-w-0 pl-[5px]"
      style={{ top }}>
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
        <span className="timeline-annotation-label min-w-0 break-words text-[10px] leading-[1.35] sm:text-[11px]">
          {annotation.label}
        </span>
        {media && (
          <button
            type="button"
            aria-controls={mediaId}
            aria-expanded={expanded}
            onClick={() => toggle(layout.annIndex)}
            className="timeline-more shrink-0 text-[10px] font-mono underline underline-offset-2 transition-colors">
            {expanded ? 'Less' : 'More'}
          </button>
        )}
      </div>

      {media && (
        <CollapsibleHeight open={expanded}>
          <div id={mediaId} className="pt-2">
            {media.type === 'image' && (
              <Image
                src={media.src}
                alt={media.alt}
                width={media.width}
                height={media.height}
                className="timeline-media h-auto max-w-full rounded border"
              />
            )}
            {media.type === 'video' && (
              <video
                src={media.src}
                width={media.width}
                height={media.height}
                autoPlay
                muted
                loop
                playsInline
                className="timeline-media h-auto max-w-full rounded border"
              />
            )}
          </div>
        </CollapsibleHeight>
      )}
    </section>
  )
}

type Props = {
  weeks: Cell[][]
  maxCount: number
  markers: { label: string; row: number }[]
  layouts: AnnotationLayout[]
}

export function TimelineRows({
  weeks,
  maxCount,
  markers,
  layouts,
}: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set())
  const [pivotalEnabled, setPivotalEnabled] = useState(true)
  const [enabledCategories, setEnabledCategories] = useState<
    Set<AnnotationCategory>
  >(() => new Set())
  const cardRefs = useRef(new Map<number, HTMLElement>())
  const containerRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<TimelineTooltipHandle>(null)

  const { orderedLayouts, numBarCols } = useMemo(() => {
    const visibleLayouts = layouts
      .filter((layout) => {
        const annotation = ALL_ANNOTATIONS[layout.annIndex]
        if (!annotation) return false
        return (
          (pivotalEnabled && annotation.pivotal) ||
          enabledCategories.has(annotation.category)
        )
      })
      .map((layout) => ({ ...layout, barCol: 0 }))

    // Only long ranges need brace tracks. Repack them whenever filters change
    // so filtered views do not retain empty connector columns.
    const barColumns: AnnotationLayout[][] = []
    const rangedLayouts = visibleLayouts
      .filter((layout) => !layout.isPoint && layout.r1 - layout.r0 > 1)
      .sort(
        (a, b) => a.r0 - b.r0 || a.r1 - b.r1 || a.annIndex - b.annIndex,
      )

    for (const layout of rangedLayouts) {
      const column = barColumns.findIndex((existing) =>
        existing.every(
          (other) => other.r1 < layout.r0 || layout.r1 < other.r0,
        ),
      )
      const barCol = column === -1 ? barColumns.length : column

      layout.barCol = barCol
      if (column === -1) barColumns.push([layout])
      else barColumns[barCol].push(layout)
    }

    return {
      orderedLayouts: visibleLayouts.sort(
        (a, b) =>
          a.r0 - b.r0 || a.barCol - b.barCol || a.annIndex - b.annIndex,
      ),
      numBarCols: Math.max(1, barColumns.length),
    }
  }, [enabledCategories, layouts, pivotalEnabled])

  const trackWidth = Math.max(1, numBarCols) * BAR_COL_WIDTH
  const labelLeft =
    MARKER_WIDTH + COLUMN_GAP + GRID_WIDTH + COLUMN_GAP + trackWidth + COLUMN_GAP
  const coreHeight = Math.max(0, weeks.length * ROW_STEP + (weeks.length - 1) * GAP)
  const [rail, setRail] = useState<PackedRail>({
    positions: {},
    height: coreHeight,
    ready: false,
  })

  const toggle = useCallback((annIndex: number) => {
    setExpanded((previous) => {
      const next = new Set(previous)
      if (next.has(annIndex)) next.delete(annIndex)
      else next.add(annIndex)
      return next
    })
  }, [])

  const toggleCategory = useCallback((category: AnnotationCategory) => {
    setEnabledCategories((previous) => {
      const next = new Set(previous)
      if (next.has(category)) next.delete(category)
      else next.add(category)
      return next
    })
  }, [])

  const setCardRef = useCallback(
    (annIndex: number, element: HTMLElement | null) => {
      if (element) cardRefs.current.set(annIndex, element)
      else cardRefs.current.delete(annIndex)
    },
    [],
  )

  const hideTooltip = useCallback(() => {
    tooltipRef.current?.hide()
  }, [])

  const moveTooltip = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (event.pointerType !== 'mouse') return

      const target = (event.target as Element).closest<HTMLElement>(
        '[data-timeline-day]',
      )
      const date = target?.dataset.date
      const count = Number(target?.dataset.count)

      if (!target || !date || Number.isNaN(count)) {
        hideTooltip()
        return
      }

      tooltipRef.current?.show({ date, count }, event.clientX, event.clientY)
    },
    [hideTooltip],
  )

  const recalculateRail = useCallback(() => {
    if (orderedLayouts.some((layout) => !cardRefs.current.has(layout.annIndex))) {
      return
    }

    const positions: Record<number, number> = {}
    let previousBottom = 0

    for (const layout of orderedLayouts) {
      const card = cardRefs.current.get(layout.annIndex)
      if (!card) return

      const height = card.getBoundingClientRect().height
      const top = Math.max(
        anchorTop(layout),
        previousBottom === 0 ? 0 : previousBottom + LABEL_GAP,
      )

      positions[layout.annIndex] = top
      previousBottom = top + height
    }

    const nextRail: PackedRail = {
      positions,
      height: Math.max(coreHeight, previousBottom),
      ready: true,
    }

    setRail((previous) => (railIsEqual(previous, nextRail) ? previous : nextRail))
  }, [coreHeight, orderedLayouts])

  useLayoutEffect(() => {
    recalculateRail()

    const container = containerRef.current
    if (!container) return

    let frame: number | undefined
    const scheduleRecalculation = () => {
      if (frame !== undefined) window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(recalculateRail)
    }

    window.addEventListener('resize', scheduleRecalculation)

    if (typeof ResizeObserver === 'undefined') {
      return () => {
        window.removeEventListener('resize', scheduleRecalculation)
        if (frame !== undefined) window.cancelAnimationFrame(frame)
      }
    }

    const observer = new ResizeObserver(scheduleRecalculation)
    observer.observe(container)
    Array.from(cardRefs.current.values()).forEach((card) => observer.observe(card))

    return () => {
      window.removeEventListener('resize', scheduleRecalculation)
      observer.disconnect()
      if (frame !== undefined) window.cancelAnimationFrame(frame)
    }
  }, [expanded, recalculateRail])

  const markersByRow = new Map(markers.map((marker) => [marker.row, marker]))
  const gridStyle: CSSProperties = {
    gridTemplateColumns: `${MARKER_WIDTH}px ${GRID_WIDTH}px ${trackWidth}px`,
    columnGap: COLUMN_GAP,
    rowGap: GAP,
    gridAutoRows: ROW_STEP,
  }
  const railStyle: CSSProperties = {
    left: labelLeft,
    right: 0,
    top: 0,
    height: rail.height,
  }

  return (
    <div ref={containerRef} className="timeline relative w-full min-w-0">
      <div className="timeline-filter-bar sticky top-2 z-30 mb-3 flex items-center gap-2 rounded-full border p-1.5 shadow-sm backdrop-blur-md">
        <div className="timeline-filter-scroll min-w-0 flex-1 overflow-x-auto">
          <div
            role="group"
            aria-label="Timeline filters"
            className="flex w-max items-center gap-1">
            <button
              type="button"
              aria-pressed={pivotalEnabled}
              onClick={() => setPivotalEnabled((enabled) => !enabled)}
              className={`timeline-filter-chip rounded-full px-2.5 py-1 text-[10px] font-medium leading-none transition-colors ${
                pivotalEnabled ? 'is-active' : ''
              }`}>
              Pivotal
            </button>
            {CATEGORY_FILTERS.map((filter) => {
              const enabled = enabledCategories.has(filter.value)
              return (
                <button
                  key={filter.value}
                  type="button"
                  aria-pressed={enabled}
                  onClick={() => toggleCategory(filter.value)}
                  className={`timeline-filter-chip rounded-full px-2.5 py-1 text-[10px] font-medium leading-none transition-colors ${
                    enabled ? 'is-active' : ''
                  }`}>
                  {filter.label}
                </button>
              )
            })}
          </div>
        </div>
        <span
          aria-live="polite"
          className="timeline-filter-count shrink-0 pr-1.5 font-mono text-[9px] tabular-nums">
          {orderedLayouts.length}/{layouts.length} shown
        </span>
      </div>

      <div
        className="relative w-full min-w-0"
        style={{ minHeight: rail.height + HEADER_HEIGHT }}>
        <div
          role="row"
          aria-label="Days of the week"
          className="timeline-day-header absolute top-0 grid font-mono text-[8px] leading-none"
          style={{
            left: MARKER_WIDTH + COLUMN_GAP,
            gridTemplateColumns: `repeat(7, ${CELL}px)`,
            columnGap: GAP,
          }}>
          {DAY_INITIALS.map((initial, index) => (
            <span
              key={DAY_NAMES[index]}
              role="columnheader"
              aria-label={DAY_NAMES[index]}
              className="text-center">
              {initial}
            </span>
          ))}
        </div>

        <div
          className="relative w-full min-w-0"
          style={{ minHeight: rail.height, top: HEADER_HEIGHT }}
          onPointerMove={moveTooltip}
          onPointerLeave={hideTooltip}
          onPointerDown={hideTooltip}>
          <div className="grid w-full min-w-0" style={gridStyle}>
        {weeks.map((week, weekIndex) => {
          const marker = markersByRow.get(weekIndex)
          const row = weekIndex + 1

          return (
            <div key={weekIndex} className="contents">
              <div
                className="flex items-center justify-end self-start"
                style={{ gridColumn: 1, gridRow: row, height: ROW_STEP }}>
                {marker && (
                  <span
                    className={`text-[10px] font-mono leading-none ${
                      marker.label === 'Now'
                        ? 'timeline-now font-medium'
                        : 'timeline-year'
                    }`}>
                    {marker.label}
                  </span>
                )}
              </div>

              <div
                className="flex self-start"
                style={{
                  gridColumn: 2,
                  gridRow: row,
                  gap: GAP,
                  height: ROW_STEP,
                }}>
                {week.map((cell, dayIndex) => (
                  <div
                    key={dayIndex}
                    className={`timeline-cell rounded-[2px] ${
                      cell
                        ? LEVEL_CLASS[
                            contributionLevel(cell.contributionCount, maxCount)
                          ]
                        : ''
                    }`}
                    style={{ width: CELL, height: CELL }}
                    data-timeline-day={cell ? '' : undefined}
                    data-date={cell?.date}
                    data-count={cell?.contributionCount}
                    aria-label={
                      cell
                        ? `${cell.date}: ${contributionSummary(cell.contributionCount)}`
                        : undefined
                    }
                  />
                ))}
              </div>
            </div>
          )
        })}
          </div>

          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 transition-opacity duration-150 ${
              rail.ready ? 'opacity-100' : 'opacity-0'
            }`}>
            {orderedLayouts.map((layout) => (
              <AnnotationInk
                key={layout.annIndex}
                layout={layout}
                labelLeft={labelLeft}
                top={rail.positions[layout.annIndex] ?? anchorTop(layout)}
                height={rail.height}
              />
            ))}
          </div>

          <div
            className={`absolute z-10 transition-opacity duration-150 ${
              rail.ready ? 'opacity-100' : 'opacity-0'
            }`}
            style={railStyle}>
            {orderedLayouts.map((layout) => (
              <AnnotationCard
                key={layout.annIndex}
                layout={layout}
                top={rail.positions[layout.annIndex] ?? anchorTop(layout)}
                expanded={expanded.has(layout.annIndex)}
                toggle={toggle}
                cardRef={(element) => setCardRef(layout.annIndex, element)}
              />
            ))}
          </div>
        </div>
      </div>

      <TimelineTooltip ref={tooltipRef} />
    </div>
  )
}
