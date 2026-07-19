type Treatment = {
  label: string
  tokens: number
  cost: number
  safeRejected: number
}

const treatments: Treatment[] = [
  { label: '512-high', tokens: 507, cost: 0.509, safeRejected: 2 },
  { label: '512-low', tokens: 507, cost: 0.512, safeRejected: 5 },
  { label: '256-high', tokens: 328, cost: 0.467, safeRejected: 6 },
  { label: '128-high', tokens: 285, cost: 0.469, safeRejected: 7 },
]

const xPositions = [210, 350, 490, 630]

type Metric = {
  key: 'tokens' | 'cost' | 'safeRejected'
  label: string
  top: number
  bottom: number
  min: number
  max: number
  change: string
  accent?: boolean
  format: (value: number) => string
}

const metrics: Metric[] = [
  {
    key: 'tokens',
    label: 'Input tokens',
    top: 38,
    bottom: 104,
    min: 250,
    max: 550,
    change: '−44%',
    format: (value) => Math.round(value).toString(),
  },
  {
    key: 'cost',
    label: 'Cost / 1,000',
    top: 138,
    bottom: 204,
    min: 0.44,
    max: 0.53,
    change: '−8%',
    format: (value) => `$${value.toFixed(3)}`,
  },
  {
    key: 'safeRejected',
    label: 'Safe rejected',
    top: 238,
    bottom: 304,
    min: 0,
    max: 8,
    change: '+5',
    accent: true,
    format: (value) => Math.round(value).toString(),
  },
]

function yPosition(value: number, metric: Metric) {
  const ratio = (value - metric.min) / (metric.max - metric.min)
  return metric.bottom - ratio * (metric.bottom - metric.top)
}

export function ImageTreatmentPlots() {
  return (
    <figure
      id="image-treatment-trade-off"
      className="my-10 scroll-mt-6 md:-ml-24 md:w-[calc(100%+12rem)]">
      <div className="mb-3">
        <div className="text-sm font-medium">What changed as image fidelity fell?</div>
        <div className="mt-1 text-xs text-muted">
          GPT-5 mini across the same 156 drawings · lower is better
        </div>
      </div>

      <div className="overflow-x-auto border-y py-3">
        <svg
          viewBox="0 0 720 350"
          className="h-auto w-full min-w-[660px]"
          role="img"
          aria-label="Effect of image treatment on tokens, cost and safe rejections"
          aria-describedby="image-treatment-description">
          <title>Image treatment trade-offs for GPT-5 mini</title>
          <desc id="image-treatment-description">
            Three aligned line charts show that average input tokens fell from
            507 to 285 and cost fell by only eight percent, while harmless
            drawings rejected increased from two to seven.
          </desc>

          {xPositions.map((x, index) => (
            <line
              key={treatments[index].label}
              x1={x}
              x2={x}
              y1="28"
              y2="310"
              stroke="hsl(var(--border))"
              strokeWidth="1"
            />
          ))}

          {metrics.map((metric) => {
            const colour = metric.accent
              ? 'hsl(var(--accent))'
              : 'hsl(var(--foreground))'
            const coordinates = treatments.map((treatment, index) => ({
              x: xPositions[index],
              y: yPosition(treatment[metric.key], metric),
              value: treatment[metric.key],
            }))
            const path = coordinates
              .map((coordinate, index) => `${index === 0 ? 'M' : 'L'} ${coordinate.x} ${coordinate.y}`)
              .join(' ')

            return (
              <g key={metric.key}>
                <text
                  x="18"
                  y={(metric.top + metric.bottom) / 2 - 3}
                  fill="hsl(var(--foreground))"
                  fontSize="11"
                  fontWeight="500">
                  {metric.label}
                </text>
                <text
                  x="18"
                  y={(metric.top + metric.bottom) / 2 + 14}
                  fill={colour}
                  fontSize="10">
                  {metric.change}
                </text>
                <line
                  x1="176"
                  x2="664"
                  y1={metric.bottom}
                  y2={metric.bottom}
                  stroke="hsl(var(--border))"
                  strokeWidth="1"
                />
                <path
                  d={path}
                  fill="none"
                  stroke={colour}
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                {coordinates.map((coordinate, index) => (
                  <g key={treatments[index].label}>
                    <circle
                      cx={coordinate.x}
                      cy={coordinate.y}
                      r="4"
                      fill="hsl(var(--background))"
                      stroke={colour}
                      strokeWidth="1.5"
                    />
                    <text
                      x={coordinate.x}
                      y={coordinate.y - 9}
                      textAnchor="middle"
                      fill="hsl(var(--foreground))"
                      fontSize="10">
                      {metric.format(coordinate.value)}
                    </text>
                  </g>
                ))}
              </g>
            )
          })}

          {treatments.map((treatment, index) => (
            <text
              key={treatment.label}
              x={xPositions[index]}
              y="334"
              textAnchor="middle"
              fill="hsl(var(--muted))"
              fontSize="10">
              {treatment.label}
            </text>
          ))}
        </svg>
      </div>

      <figcaption className="mt-3 text-xs text-muted">
        Tokens dropped substantially, but total cost barely followed and false
        rejections climbed. In the JPEG control, the 512×384 PNG and quality-35
        JPEG both used 507 input tokens. Scroll sideways on smaller screens.
      </figcaption>
    </figure>
  )
}
