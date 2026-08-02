import { OpenAI } from 'openai'
import { unstable_cache } from 'next/cache'
import { NextResponse } from 'next/server'
import {
  EstimateRequestError,
  MAX_ESTIMATE_REQUEST_BYTES,
  parseEstimateOutput,
  parseEstimateRequestBody,
} from '@/lib/estimate-cost'
import { sendPushoverNotification } from '@/lib/pushover'

const ESTIMATE_CACHE_SECONDS = 24 * 60 * 60
const OPENAI_TIMEOUT_MS = 10_000

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const ESTIMATE_INSTRUCTIONS = `
You are evaluating a user-submitted bucket list item.

Your job is to decide how much someone would need to pay *me* to actually do that thing. The price reflects:
1. How fun, pleasant, or desirable the activity is
2. How much effort, time, discomfort, or risk it involves
3. How mentally or physically demanding it is
4. How much motivation I'd need to actually go do it

Return either:
- "ILLEGAL" (if the item is illegal or clearly inappropriate)
- A number (minimum is 1) representing how much someone should pay *me* to do it. Return only the number, no text or currency symbol.

This is NOT based on how much the activity costs in real life. It's how much *you'd have to pay me to want to do it*. The more effort, fear, or unpleasantness involved, the higher the number - even if it's a cool experience.

Examples:
- "Take a nap" → 1
- "Pet a dog" → 1
- "Do the dishes" → 3
- "Go on a 5km run" → 5
- "Write a short story" → 4
- "Go vegan for a day" → 10
- "Eat an entire raw onion" → 30
- "Wake up at 4am for a week" → 60
- "Fly in a hot air balloon" → 50
- "Skydiving" → 120
- "Give a public speech" → 100
- "Run a marathon" → 500
- "Climb Mount Everest" → 1000
- "Travel to Japan" → 150
- "Delete Instagram forever" → 80
- "Talk to a stranger on the street" → 8
- "Spend a weekend without phone or internet" → 40
- "Sleep in a tent in the woods alone" → 70
- "Steal from a shop" → ILLEGAL
- "Rob a bank" → ILLEGAL
- "Break into a house" → ILLEGAL
- "Trespass into a concert" → ILLEGAL
- "Get a face tattoo" → 10000
- "Lick a subway pole" → 250
- "Eat a spider" → 400

Evaluate the bucket list item supplied by the user.
`

const estimateCost = unstable_cache(
  async (item: string) => {
    const response = await openai.responses.create(
      {
        model: 'gpt-5.6-luna',
        reasoning: { effort: 'none' },
        instructions: ESTIMATE_INSTRUCTIONS,
        input: item,
        max_output_tokens: 16,
        store: false,
      },
      {
        maxRetries: 0,
        timeout: OPENAI_TIMEOUT_MS,
      },
    )

    return parseEstimateOutput(response.output_text)
  },
  ['bucket-list-cost-estimate-v2'],
  {
    revalidate: ESTIMATE_CACHE_SECONDS,
  },
)

export async function POST(request: Request) {
  try {
    if (!request.headers.get('content-type')?.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type must be application/json' },
        { status: 415 },
      )
    }

    const contentLength = Number(request.headers.get('content-length'))
    if (
      Number.isFinite(contentLength) &&
      contentLength > MAX_ESTIMATE_REQUEST_BYTES
    ) {
      return NextResponse.json(
        { error: 'Request body is too large' },
        { status: 413 },
      )
    }

    const { item, cacheItem } = parseEstimateRequestBody(await request.text())
    const estimatedCost = await estimateCost(cacheItem)

    void sendPushoverNotification({
      title: 'Bucket Item Estimation',
      message:
        estimatedCost === 'Infinity'
          ? `ILLEGAL: ${item}`
          : `${estimatedCost}: ${item}`,
    })

    return NextResponse.json({ estimatedCost })
  } catch (error) {
    if (error instanceof EstimateRequestError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status },
      )
    }

    console.error('Error estimating value:', error)
    return NextResponse.json(
      { error: 'Failed to estimate value' },
      { status: 500 },
    )
  }
}
