'use client'

import Image from 'next/image'
import { type ReactNode, useCallback, useLayoutEffect, useState } from 'react'
import { ALL_ANNOTATIONS } from './timeline-annotations'
import type { AnnotationLayout } from './timeline-utils'
import {
  ANNOTATION_COL_WIDTH,
  CELL,
  contributionLevel,
  GAP,
  LEVEL_CLASS,
  ROW_STEP,
  type Cell,
} from './timeline-utils'

const BAR_COL_WIDTH = 6
const STEM_TOP_PAD_PX = 3

function barCellStyle(barCol: number) {
  return {
    left: barCol * BAR_COL_WIDTH,
    width: BAR_COL_WIDTH,
  } as const
}

function annotationLeftPx(baseLeft: number, col: number) {
  return baseLeft + col * ANNOTATION_COL_WIDTH
}

function isWorld(kind: AnnotationLayout['kind']) {
  return kind === 'world'
}

function pointClassName(kind: AnnotationLayout['kind']) {
  return `mt-[2.5px] h-1.5 w-1.5 shrink-0 bg-emerald-500/60 ${
    isWorld(kind) ? 'rounded-[2px]' : 'rounded-full'
  }`
}

function stemClassName(kind: AnnotationLayout['kind']) {
  return `w-0.5 shrink-0 bg-emerald-500/40 ${
    isWorld(kind) ? 'rounded-none' : 'rounded-full'
  }`
}

function stemStyle(isFirstRow: boolean) {
  return {
    marginTop: isFirstRow ? STEM_TOP_PAD_PX : 0,
    height: isFirstRow ? `calc(100% - ${STEM_TOP_PAD_PX}px)` : '100%',
  } as const
}

/** Animates height open/close; keeps last children mounted while collapsing so exit can run. */
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
      onTransitionEnd={(e) => {
        if (e.target !== e.currentTarget) return
        if (e.propertyName !== 'grid-template-rows') return
        if (!open) setContent(null)
      }}>
      <div className="min-h-0 overflow-hidden">{content}</div>
    </div>
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

  const toggle = useCallback((annIndex: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(annIndex)) next.delete(annIndex)
      else next.add(annIndex)
      return next
    })
  }, [])

  return (
    <div className="flex flex-col" style={{ gap: GAP }}>
      {weeks.map((week, wi) => {
        const active = layouts
          .filter((l) => l.r0 <= wi && wi <= l.r1)
          .sort((a, b) => a.barCol - b.barCol)

        const labelOnes = active.filter((l) => l.r0 === wi)
        const barStripWidth = Math.max(1, numBarCols) * BAR_COL_WIDTH
        const baseLeft = barStripWidth + 8

        const expandedHere = labelOnes.filter((l) => expanded.has(l.annIndex))
        const hasExpandableMedia = labelOnes.some((l) =>
          Boolean(ALL_ANNOTATIONS[l.annIndex]?.media),
        )
        const expandBlocks = expandedHere.map((l) => {
          const ann = ALL_ANNOTATIONS[l.annIndex]
          const media = ann?.media
          if (!media) return null
          return (
            <div key={l.annIndex} className="mt-2 pl-1">
              {media.type === 'image' && (
                <Image
                  src={media.src}
                  alt={media.alt}
                  width={media.width}
                  height={media.height}
                  className="rounded"
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
                  className="rounded"
                />
              )}
            </div>
          )
        })

        const marker = markers.find((m) => m.row === wi)

        return (
          <div key={wi} className="flex w-full items-stretch">
            <div
              className="relative shrink-0 mr-3 flex flex-col"
              style={{ width: 44 }}>
              <div
                className="flex flex-none items-center"
                style={{ height: ROW_STEP, minHeight: ROW_STEP }}>
                {marker && (
                  <div className="flex w-full items-center justify-end">
                    <span
                      className={`text-[10px] font-mono leading-none mr-1.5 ${
                        marker.label === 'Now'
                          ? 'text-emerald-400 font-medium'
                          : 'text-zinc-500'
                      }`}>
                      {marker.label}
                    </span>
                    <div className="w-1.5 h-px shrink-0 bg-zinc-600/60" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex shrink-0 flex-col">
              <div className="flex" style={{ gap: GAP, height: ROW_STEP }}>
                {week.map((cell, di) => (
                  <div
                    key={di}
                    className={`rounded-[2px] ${cell ? LEVEL_CLASS[contributionLevel(cell.contributionCount, maxCount)] : ''}`}
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

            <div className="ml-3 min-w-0 flex-1 flex flex-col">
              <div
                className="relative min-w-0 flex-1"
                style={{ minHeight: ROW_STEP }}>
                <div
                  className="absolute left-0 top-0 h-full"
                  style={{ width: barStripWidth }}>
                  {active.map((l) => {
                    const ann = ALL_ANNOTATIONS[l.annIndex]
                    if (!ann) return null
                    const isFirstRow = wi === l.r0

                    return (
                      <div
                        key={l.annIndex}
                        className="relative top-0 flex h-full items-start justify-center"
                        style={barCellStyle(l.barCol)}>
                        {l.isPoint ? (
                          <div className={pointClassName(l.kind)} />
                        ) : (
                          <div
                            className={stemClassName(l.kind)}
                            style={stemStyle(isFirstRow)}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>

                {labelOnes.map((l) => {
                  const ann = ALL_ANNOTATIONS[l.annIndex]
                  if (!ann) return null
                  const hasMedia = Boolean(ann.media)
                  const isOpen = expanded.has(l.annIndex)

                  return (
                    <div
                      key={l.annIndex}
                      className="absolute top-0 min-w-0 max-w-[min(100%,320px)] flex flex-col gap-1"
                      style={{
                        left: annotationLeftPx(baseLeft, l.col),
                      }}>
                      <div className="flex flex-wrap items-baseline gap-x-1 gap-y-0">
                        <span className="text-[10px] font-mono leading-tight text-zinc-400 whitespace-normal break-words">
                          {ann.label}
                        </span>
                        {hasMedia && (
                          <button
                            type="button"
                            onClick={() => toggle(l.annIndex)}
                            className="shrink-0 text-[10px] font-mono text-emerald-500/90 underline decoration-emerald-500/40 underline-offset-2 hover:text-emerald-400">
                            {isOpen ? 'Less' : 'More'}
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {hasExpandableMedia && (
                <CollapsibleHeight open={expandedHere.length > 0}>
                  <div className="min-w-0 pb-0.5">{expandBlocks}</div>
                </CollapsibleHeight>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
