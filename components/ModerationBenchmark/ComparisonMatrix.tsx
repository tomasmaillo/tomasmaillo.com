type Result = {
  score: number
  missed: number
  cost: number
  best?: boolean
}

type ModelResult = {
  model: string
  effort: 'low' | 'medium' | 'none'
  results: Partial<Record<ImageTreatment, Result>>
}

const treatments = [
  { key: '512-high', label: '512', detail: 'high' },
  { key: '512-low', label: '512', detail: 'low' },
  { key: '256-high', label: '256', detail: 'high' },
  { key: '128-high', label: '128', detail: 'high' },
  { key: 'jpeg', label: 'JPEG', detail: 'q35' },
] as const

type ImageTreatment = (typeof treatments)[number]['key']

const models: ModelResult[] = [
  {
    model: 'GPT-5 mini',
    effort: 'low',
    results: {
      '512-high': { score: 99.3, missed: 0, cost: 0.51, best: true },
      '512-low': { score: 98.2, missed: 0, cost: 0.51 },
      '256-high': { score: 97.9, missed: 0, cost: 0.47 },
      '128-high': { score: 97.5, missed: 0, cost: 0.47 },
    },
  },
  {
    model: 'GPT-5.1 Codex',
    effort: 'low',
    results: {
      '512-high': { score: 98.9, missed: 0, cost: 1.35 },
      '512-low': { score: 95.0, missed: 1, cost: 1.21 },
      '256-high': { score: 94.7, missed: 1, cost: 1.34 },
      '128-high': { score: 91.8, missed: 2, cost: 1.32 },
    },
  },
  {
    model: 'GPT-4.1 mini',
    effort: 'none',
    results: {
      '512-high': { score: 98.2, missed: 0, cost: 0.38 },
      '512-low': { score: 98.2, missed: 0, cost: 0.37 },
      '256-high': { score: 98.6, missed: 0, cost: 0.27 },
      '128-high': { score: 95.4, missed: 1, cost: 0.24 },
    },
  },
  {
    model: 'GPT-5.4 mini',
    effort: 'low',
    results: {
      '512-high': { score: 91.8, missed: 2, cost: 0.92 },
      '512-low': { score: 95.0, missed: 1, cost: 0.93 },
      '256-high': { score: 96.1, missed: 1, cost: 0.81 },
      '128-high': { score: 91.1, missed: 2, cost: 0.78 },
      jpeg: { score: 95.4, missed: 1, cost: 0.92 },
    },
  },
  {
    model: 'GPT-5 nano',
    effort: 'low',
    results: {
      '512-high': { score: 92.9, missed: 1, cost: 0.11 },
      '512-low': { score: 85.8, missed: 3, cost: 0.11 },
      '256-high': { score: 91.1, missed: 2, cost: 0.10 },
      '128-high': { score: 82.9, missed: 4, cost: 0.10 },
    },
  },
  {
    model: 'GPT-5.6 Luna',
    effort: 'low',
    results: {
      '512-high': { score: 85.4, missed: 4, cost: 1.36 },
      '512-low': { score: 84.7, missed: 4, cost: 1.39 },
      '256-high': { score: 80.7, missed: 5, cost: 1.19 },
      '128-high': { score: 84.3, missed: 4, cost: 1.16 },
    },
  },
  {
    model: 'GPT-5.6 Luna',
    effort: 'medium',
    results: {
      '512-high': { score: 77.9, missed: 6, cost: 1.48 },
      '512-low': { score: 80.7, missed: 5, cost: 1.54 },
      '256-high': { score: 76.8, missed: 6, cost: 1.36 },
      '128-high': { score: 84.0, missed: 4, cost: 1.38 },
    },
  },
  {
    model: 'GPT-4.1 nano',
    effort: 'none',
    results: {
      '512-high': { score: 82.5, missed: 4, cost: 0.1 },
      '512-low': { score: 75.4, missed: 6, cost: 0.1 },
      '256-high': { score: 49.6, missed: 14, cost: 0.06 },
      '128-high': { score: 50.0, missed: 14, cost: 0.05 },
    },
  },
  {
    model: 'GPT-5.4 nano',
    effort: 'low',
    results: {
      '512-high': { score: 77.2, missed: 5, cost: 0.29 },
      '512-low': { score: 79.4, missed: 4, cost: 0.29 },
      '256-high': { score: 72.9, missed: 6, cost: 0.27 },
      '128-high': { score: 76.2, missed: 5, cost: 0.25 },
    },
  },
  {
    model: 'GPT-5.4 nano',
    effort: 'medium',
    results: {
      '512-high': { score: 72.9, missed: 6, cost: 0.36 },
      '512-low': { score: 77.9, missed: 5, cost: 0.34 },
      '256-high': { score: 63.3, missed: 8, cost: 0.33 },
      '128-high': { score: 76.2, missed: 5, cost: 0.31 },
    },
  },
]

function resultTone(result: Result) {
  if (result.best) return 'bg-accent/15 ring-1 ring-inset ring-accent/40'
  if (result.score >= 98) return 'bg-accent/[0.08]'
  if (result.score >= 95) return 'bg-foreground/[0.05]'
  if (result.score >= 90) return 'bg-foreground/[0.025]'
  return ''
}

export function ComparisonMatrix() {
  return (
    <figure className="my-8 md:-ml-24 md:w-[calc(100%+12rem)]">
      <div className="mb-3 flex items-end justify-between gap-4">
        <div>
          <div className="text-sm font-medium">All 41 test configurations</div>
          <div className="mt-1 text-xs text-muted">Balanced accuracy, unsafe misses and cost per 1,000</div>
        </div>
        <div className="hidden text-right text-[10px] text-muted sm:block">
          image size<br />API detail
        </div>
      </div>

      <div className="overflow-x-auto border-y">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <caption className="sr-only">
            Comparison of balanced accuracy, unsafe misses and cost across every
            tested model and image treatment.
          </caption>
          <thead>
            <tr className="border-b text-[10px] uppercase tracking-wide text-muted">
              <th scope="col" className="sticky left-0 z-10 w-40 bg-background px-3 py-3 font-medium">
                Model
              </th>
              {treatments.map((treatment) => (
                <th key={treatment.key} scope="col" className="min-w-28 px-3 py-3 font-medium">
                  <span className="block text-foreground">{treatment.label}</span>
                  <span className="font-normal normal-case tracking-normal">{treatment.detail}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={`${model.model}-${model.effort}`} className="border-b last:border-b-0">
                <th scope="row" className="sticky left-0 z-10 bg-background px-3 py-3 align-top">
                  <span className="block whitespace-nowrap text-xs font-medium">{model.model}</span>
                  <span className="mt-0.5 block text-[10px] font-normal text-muted">
                    {model.effort === 'none' ? 'no reasoning setting' : `${model.effort} reasoning`}
                  </span>
                </th>
                {treatments.map((treatment) => {
                  const result = model.results[treatment.key]

                  return (
                    <td
                      key={treatment.key}
                      className={`px-3 py-3 align-top tabular-nums ${result ? resultTone(result) : ''}`}>
                      {result ? (
                        <>
                          <span className={`block text-sm ${result.best ? 'font-semibold text-accent' : 'font-medium'}`}>
                            {result.score.toFixed(1)}%
                          </span>
                          <span className={`mt-0.5 block text-[10px] ${result.missed === 0 ? 'text-muted' : 'text-accent'}`}>
                            {result.missed} missed · ${result.cost.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-muted/40">—</span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <figcaption className="mt-3 text-xs text-muted">
        “Missed” means an unsafe drawing was approved. The orange cell is the
        overall winner. Scroll sideways on smaller screens.
      </figcaption>
    </figure>
  )
}
