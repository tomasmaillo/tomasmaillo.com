'use client'

import Image from 'next/image'
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ALL_ANNOTATIONS } from './timeline-annotations'
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
const STEM_TOP_PAD_PX = 3
const LABEL_GAP = 8
const LABEL_LEADER_OFFSET = 6.5
const POINT_SIZE = 6
const STEM_WIDTH = 2

type PackedRail = {
  positions: Record<number, number>
  height: number
  ready: boolean
}

function isWorld(kind: AnnotationLayout['kind']) {
  return kind === 'world'
}

function pointClassName(kind: AnnotationLayout['kind']) {
  return `mt-[2px] h-1.5 w-1.5 shrink-0 ${
    isWorld(kind) ? 'rounded-[2px] bg-sky-400/70' : 'rounded-full bg-emerald-400/70'
  }`
}

function stemClassName(kind: AnnotationLayout['kind']) {
  return `w-0.5 ${
    isWorld(kind) ? 'rounded-none bg-sky-400/45' : 'rounded-full bg-emerald-400/45'
  }`
}

function annotationBorderClass(kind: AnnotationLayout['kind']) {
  return isWorld(kind) ? 'border-sky-400/45' : 'border-emerald-400/45'
}

function annotationLineClass(kind: AnnotationLayout['kind']) {
  return isWorld(kind) ? 'bg-sky-400/45' : 'bg-emerald-400/45'
}

function anchorTop(layout: AnnotationLayout) {
  return layout.r0 * ROW_PITCH
}

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

function AnnotationConnector({ layout }: { layout: AnnotationLayout }) {
  const trackStyle: CSSProperties = {
    gridColumn: 3,
    gridRow: `${layout.r0 + 1} / ${layout.r1 + 2}`,
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none relative z-0 self-stretch"
      style={trackStyle}>
      <div
        className="absolute inset-y-0 flex justify-center"
        style={{
          left: layout.barCol * BAR_COL_WIDTH,
          width: BAR_COL_WIDTH,
        }}>
        {layout.isPoint ? (
          <div className={pointClassName(layout.kind)} />
        ) : (
          <div
            className={stemClassName(layout.kind)}
            style={{
              marginTop: STEM_TOP_PAD_PX,
              height: `calc(100% - ${STEM_TOP_PAD_PX}px)`,
            }}
          />
        )}
      </div>
    </div>
  )
}

function AnnotationLeader({
  layout,
  labelLeft,
  top,
}: {
  layout: AnnotationLayout
  labelLeft: number
  top: number
}) {
  const trackLeft =
    MARKER_WIDTH + COLUMN_GAP + GRID_WIDTH + COLUMN_GAP + layout.barCol * BAR_COL_WIDTH
  const anchorX = trackLeft + BAR_COL_WIDTH / 2
  const startX = anchorX + (layout.isPoint ? POINT_SIZE / 2 : STEM_WIDTH / 2)
  const startY = anchorTop(layout) + CELL / 2
  const targetY = top + LABEL_LEADER_OFFSET
  const verticalHeight = Math.max(0, targetY - startY)

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-[1]"
      style={{
        left: startX,
        top: startY,
        width: Math.max(1, labelLeft - startX),
        height: verticalHeight + 1,
      }}>
      {verticalHeight > 0 && (
        <span
          className={`absolute left-0 top-0 w-px ${annotationLineClass(layout.kind)}`}
          style={{ height: verticalHeight }}
        />
      )}
      <span
        className={`absolute left-0 h-px ${annotationLineClass(layout.kind)}`}
        style={{ top: verticalHeight, width: '100%' }}
      />
    </div>
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
      className={`absolute left-0 right-0 min-w-0 border-l pl-2.5 ${annotationBorderClass(layout.kind)}`}
      style={{ top }}>
      <div className="flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
        <span className="min-w-0 break-words text-[10px] leading-[1.35] text-zinc-300 sm:text-[11px]">
          {annotation.label}
        </span>
        {media && (
          <button
            type="button"
            aria-controls={mediaId}
            aria-expanded={expanded}
            onClick={() => toggle(layout.annIndex)}
            className="shrink-0 text-[10px] font-mono text-emerald-400/90 underline decoration-emerald-400/40 underline-offset-2 transition-colors hover:text-emerald-300">
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
                className="h-auto max-w-full rounded border border-zinc-700/60"
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
                className="h-auto max-w-full rounded border border-zinc-700/60"
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
  numBarCols: number
}

export function TimelineRows({
  weeks,
  maxCount,
  markers,
  layouts,
  numBarCols,
}: Props) {
  const [expanded, setExpanded] = useState<Set<number>>(() => new Set())
  const cardRefs = useRef(new Map<number, HTMLElement>())
  const containerRef = useRef<HTMLDivElement>(null)

  const trackWidth = Math.max(1, numBarCols) * BAR_COL_WIDTH
  const labelLeft =
    MARKER_WIDTH + COLUMN_GAP + GRID_WIDTH + COLUMN_GAP + trackWidth + COLUMN_GAP
  const coreHeight = Math.max(0, weeks.length * ROW_STEP + (weeks.length - 1) * GAP)
  const [rail, setRail] = useState<PackedRail>({
    positions: {},
    height: coreHeight,
    ready: false,
  })

  const orderedLayouts = useMemo(
    () =>
      [...layouts].sort(
        (a, b) => a.r0 - b.r0 || a.barCol - b.barCol || a.annIndex - b.annIndex,
      ),
    [layouts],
  )

  const toggle = useCallback((annIndex: number) => {
    setExpanded((previous) => {
      const next = new Set(previous)
      if (next.has(annIndex)) next.delete(annIndex)
      else next.add(annIndex)
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
    <div
      ref={containerRef}
      className="relative w-full min-w-0"
      style={{ minHeight: rail.height }}>
      <div className="grid w-full min-w-0" style={gridStyle}>
        {layouts.map((layout) => (
          <AnnotationConnector key={layout.annIndex} layout={layout} />
        ))}

        {weeks.map((week, weekIndex) => {
          const marker = markersByRow.get(weekIndex)
          const row = weekIndex + 1

          return (
            <div key={weekIndex} className="contents">
              <div
                className="flex items-center justify-end self-start"
                style={{ gridColumn: 1, gridRow: row, height: ROW_STEP }}>
                {marker && (
                  <>
                    <span
                      className={`mr-1.5 text-[10px] font-mono leading-none ${
                        marker.label === 'Now'
                          ? 'font-medium text-emerald-400'
                          : 'text-zinc-500'
                      }`}>
                      {marker.label}
                    </span>
                    <span className="h-px w-1.5 shrink-0 bg-zinc-600/60" />
                  </>
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
                    className={`rounded-[2px] ${
                      cell
                        ? LEVEL_CLASS[
                            contributionLevel(cell.contributionCount, maxCount)
                          ]
                        : ''
                    }`}
                    style={{ width: CELL, height: CELL }}
                    title={
                      cell
                        ? `${cell.date}: ${cell.contributionCount} contributions`
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
          <AnnotationLeader
            key={layout.annIndex}
            layout={layout}
            labelLeft={labelLeft}
            top={rail.positions[layout.annIndex] ?? anchorTop(layout)}
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
  )
}
