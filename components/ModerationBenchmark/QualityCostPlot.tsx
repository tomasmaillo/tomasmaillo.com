type Point = {
  label: string
  cost: number
  score: number
  missed: number
  labelX: number
  labelY: number
  anchor?: 'start' | 'middle' | 'end'
  recommended?: boolean
}

const points: Point[] = [
  { label: 'GPT-5 mini', cost: 0.51, score: 99.3, missed: 0, labelX: 224, labelY: 18, anchor: 'middle', recommended: true },
  { label: 'GPT-4.1 mini', cost: 0.27, score: 98.6, missed: 0, labelX: 142, labelY: 59, anchor: 'middle' },
  { label: 'GPT-5.1 Codex', cost: 1.35, score: 98.9, missed: 0, labelX: 491, labelY: 22, anchor: 'end' },
  { label: 'GPT-5.4 mini', cost: 0.81, score: 96.1, missed: 1, labelX: 323, labelY: 58, anchor: 'middle' },
  { label: 'GPT-5 nano', cost: 0.11, score: 92.9, missed: 1, labelX: 108, labelY: 104 },
  { label: 'Luna · low', cost: 1.36, score: 85.4, missed: 4, labelX: 490, labelY: 178, anchor: 'end' },
  { label: 'Luna · medium', cost: 1.38, score: 84.0, missed: 4, labelX: 494, labelY: 217, anchor: 'end' },
  { label: 'GPT-4.1 nano', cost: 0.1, score: 82.5, missed: 4, labelX: 103, labelY: 217 },
  { label: 'GPT-5.4 nano · low', cost: 0.29, score: 79.4, missed: 4, labelX: 166, labelY: 247 },
  { label: 'GPT-5.4 nano · medium', cost: 0.34, score: 77.9, missed: 5, labelX: 184, labelY: 282 },
]

const plot = {
  left: 58,
  right: 584,
  top: 30,
  bottom: 300,
}

const xTicks = [0, 0.4, 0.8, 1.2, 1.6]
const yTicks = [75, 80, 85, 90, 95, 100]

function xPosition(cost: number) {
  return plot.left + (cost / 1.6) * (plot.right - plot.left)
}

function yPosition(score: number) {
  return plot.bottom - ((score - 75) / 25) * (plot.bottom - plot.top)
}

export function QualityCostPlot() {
  return (
    <figure
      id="quality-vs-cost"
      className="my-10 scroll-mt-6 md:-ml-24 md:w-[calc(100%+12rem)]">
      <div className="mb-3">
        <div className="text-sm font-medium">Quality versus cost</div>
        <div className="mt-1 text-xs text-muted">
          Each model&apos;s best-performing image treatment
        </div>
      </div>

      <div className="overflow-x-auto border-y py-3">
        <svg
          viewBox="0 0 640 350"
          className="h-auto w-full min-w-[560px]"
          role="img"
          aria-label="Moderation quality compared with API cost"
          aria-describedby="quality-cost-description">
          <title id="quality-cost-title">Moderation quality compared with API cost</title>
          <desc id="quality-cost-description">
            A scatter plot comparing balanced accuracy and cost per one thousand
            images. GPT-5 mini has the highest balanced accuracy at 99.3 percent
            and costs 51 cents per thousand images.
          </desc>

          {yTicks.map((tick) => {
            const y = yPosition(tick)
            return (
              <g key={tick}>
                <line
                  x1={plot.left}
                  x2={plot.right}
                  y1={y}
                  y2={y}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                />
                <text
                  x={plot.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  fill="hsl(var(--muted))"
                  fontSize="10">
                  {tick}%
                </text>
              </g>
            )
          })}

          {xTicks.map((tick) => {
            const x = xPosition(tick)
            return (
              <g key={tick}>
                <line
                  x1={x}
                  x2={x}
                  y1={plot.top}
                  y2={plot.bottom}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={plot.bottom + 19}
                  textAnchor="middle"
                  fill="hsl(var(--muted))"
                  fontSize="10">
                  ${tick.toFixed(1)}
                </text>
              </g>
            )
          })}

          <text
            x={(plot.left + plot.right) / 2}
            y="344"
            textAnchor="middle"
            fill="hsl(var(--muted))"
            fontSize="10">
            cost per 1,000 images →
          </text>
          <text
            x="13"
            y={(plot.top + plot.bottom) / 2}
            textAnchor="middle"
            transform={`rotate(-90 13 ${(plot.top + plot.bottom) / 2})`}
            fill="hsl(var(--muted))"
            fontSize="10">
            balanced accuracy →
          </text>

          {points.map((point) => {
            const x = xPosition(point.cost)
            const y = yPosition(point.score)
            const fill = point.recommended
              ? 'hsl(var(--accent))'
              : point.missed === 0
                ? 'hsl(var(--foreground))'
                : 'hsl(var(--background))'
            const stroke = point.recommended
              ? 'hsl(var(--accent))'
              : 'hsl(var(--foreground))'

            return (
              <g key={`${point.label}-${point.cost}`}>
                {point.recommended && (
                  <circle
                    cx={x}
                    cy={y}
                    r="9"
                    fill="none"
                    stroke="hsl(var(--accent))"
                    strokeWidth="1"
                    opacity="0.45"
                  />
                )}
                <circle cx={x} cy={y} r="4.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
                <text
                  x={point.labelX}
                  y={point.labelY}
                  textAnchor={point.anchor ?? 'start'}
                  fill="hsl(var(--foreground))"
                  fontSize="10"
                  fontWeight={point.recommended ? '600' : '400'}>
                  {point.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
        <span><span className="mr-1.5 text-accent">●</span>recommended</span>
        <span><span className="mr-1.5 text-foreground">●</span>caught all unsafe drawings</span>
        <span><span className="mr-1.5 text-foreground">○</span>missed at least one</span>
      </div>
      <figcaption className="mt-3 text-xs text-muted">
        The useful frontier is at the top-left: better moderation for less money.
        Scroll sideways on smaller screens.
      </figcaption>
    </figure>
  )
}
