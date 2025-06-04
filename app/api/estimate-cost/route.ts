import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'
import { sendPushoverNotification } from '@/lib/pushover'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { item } = await request.json()

    if (!item) {
      return NextResponse.json({ error: 'Item is required' }, { status: 400 })
    }

    const prompt = `
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

Now evaluate this bucket list item:
`


    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        {
          role: 'system',
          content: prompt,
        },
        {
          role: 'user',
          content: item,
        },
      ],
      temperature: 0.05,
      max_tokens: 50,
    })

    const response = completion.choices[0].message.content?.trim() || '0'

    if (response === 'ILLEGAL') {
      return NextResponse.json({ estimatedCost: 'Infinity' })
    }

    const estimatedCost = Math.max(1, parseInt(response) || 1)

    sendPushoverNotification({
      title: 'Bucket Item Estimation',
      message: `${estimatedCost}: ${item}`,
    })

    return NextResponse.json({ estimatedCost })
  } catch (error) {
    console.error('Error estimating value:', error)
    return NextResponse.json(
      { error: 'Failed to estimate value' },
      { status: 500 }
    )
  }
}
