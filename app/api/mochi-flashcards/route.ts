import { timingSafeEqual } from 'crypto'
import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

// If you are stalking this file and wondering what its for:
// I use this endpoint to generate flashcards right from an iPhone Shortcut.
// They then get automatically added to my Mochi deck.
// I've set this up to work for just me atm :)

// Yes, I probably should have made a separate server/repo for this, but too much effort!

export const runtime = 'nodejs'

const MOCHI_BASE_URL = 'https://app.mochi.cards/api'

type Flashcard = {
  front: string
  back: string
}

type MochiTemplateField = {
  id: string
  pos?: string
}

type MochiTemplate = {
  id: string
  fields?: Record<string, MochiTemplateField>
}

type MochiCard = {
  id?: string
  content?: string
  'deck-id'?: string
  'template-id'?: string | null
}

type GenerateFlashcardsBody = {
  topic?: string
  deckId?: string
  count?: number
  tags?: string[]
}

function safeTokenMatch(providedToken: string, expectedToken: string): boolean {
  const encoder = new TextEncoder()
  const providedBuffer = encoder.encode(providedToken)
  const expectedBuffer = encoder.encode(expectedToken)

  if (providedBuffer.length !== expectedBuffer.length) {
    return false
  }

  return timingSafeEqual(providedBuffer, expectedBuffer)
}

function extractJsonObject(raw: string): string {
  const firstBrace = raw.indexOf('{')
  const lastBrace = raw.lastIndexOf('}')

  if (firstBrace === -1 || lastBrace === -1 || lastBrace <= firstBrace) {
    return raw
  }

  return raw.slice(firstBrace, lastBrace + 1)
}

function parseFlashcards(raw: string): Flashcard[] {
  const parsed = JSON.parse(extractJsonObject(raw)) as { cards?: unknown }

  if (!Array.isArray(parsed.cards)) {
    throw new Error('OpenAI response did not include a cards array')
  }

  const cards = parsed.cards
    .map((card) => {
      if (!card || typeof card !== 'object') return null
      const front = (card as { front?: unknown }).front
      const back = (card as { back?: unknown }).back
      if (typeof front !== 'string' || typeof back !== 'string') return null

      const trimmedFront = front.trim()
      const trimmedBack = back.trim()
      if (!trimmedFront || !trimmedBack) return null

      return {
        front: trimmedFront,
        back: trimmedBack,
      }
    })
    .filter((card): card is Flashcard => Boolean(card))

  if (cards.length === 0) {
    throw new Error('OpenAI generated zero valid flashcards')
  }

  return cards
}

function sanitizeTags(tags: unknown): string[] {
  if (!Array.isArray(tags)) {
    return []
  }

  return tags
    .filter((tag): tag is string => typeof tag === 'string')
    .map((tag) => tag.trim().replace(/^#+/, ''))
    .filter((tag) => tag.length > 0)
    .slice(0, 10)
}

function toMochiContent(card: Flashcard): string {
  return `${card.front}\n---\n${card.back}`
}

function buildTemplateFields(template: MochiTemplate, card: Flashcard) {
  const templateFields = template.fields ?? {}
  const orderedFields = Object.values(templateFields).sort((a, b) =>
    (a.pos ?? '').localeCompare(b.pos ?? ''),
  )

  if (orderedFields.length === 0) {
    return null
  }

  const frontField = orderedFields[0]
  const backField = orderedFields[1]
  const result: Record<string, { id: string; value: string }> = {
    [frontField.id]: {
      id: frontField.id,
      value: card.front,
    },
  }

  if (backField) {
    result[backField.id] = {
      id: backField.id,
      value: card.back,
    }
  } else {
    result[frontField.id] = {
      id: frontField.id,
      value: `${card.front}\n\n${card.back}`,
    }
  }

  return result
}

async function getMochiTemplate(params: {
  mochiApiKey: string
  templateId: string
}): Promise<MochiTemplate | null> {
  const response = await fetch(
    `${MOCHI_BASE_URL}/templates/${params.templateId}`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(`${params.mochiApiKey}:`).toString(
          'base64',
        )}`,
      },
    },
  )

  if (!response.ok) {
    return null
  }

  return (await response.json()) as MochiTemplate
}

async function updateMochiCard(params: {
  mochiApiKey: string
  cardId: string
  fields: Record<string, { id: string; value: string }>
}) {
  const response = await fetch(`${MOCHI_BASE_URL}/cards/${params.cardId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${params.mochiApiKey}:`).toString(
        'base64',
      )}`,
    },
    body: JSON.stringify({
      fields: params.fields,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Mochi update card fields failed with status ${response.status}: ${errorText}`,
    )
  }
}

function buildOpenAIPrompt(topic: string): string {
  return `
Create flashcards about this topic: "${topic}".

Flashcard quality rules:
- Prioritize understanding over trivia.
- Keep front concise and clear.
- Keep back concise but complete. No more than a sentence. 
- Include specific facts, definitions, examples, or contrasts when useful.
- Avoid repeating near-duplicate cards.
- Use plain Markdown only.
- If its just one (non-obvious) word, return the definition of the word with example.
- Straight to the point. No fluff. Keep it short.
- If the topic could be covered in a single flashcard, create a single flashcard. ONLY if needed, create multiple flashcards.
- If you write math, make sure it will be parsable by JavaScript's \`JSON.parse()\` function.

Return ONLY valid JSON with this exact shape:
{
  "cards": [
    { "front": "Question or prompt", "back": "Answer" }
  ]
}

Here are some examples on how to format the response:

If the topic is "3 tech companies and their CEOs", the response should be:
{
  "cards": [
    { "front": "Google CEO", "back": "Sundar Pichai" },
    { "front": "Apple CEO", "back": "Tim Cook" },
    { "front": "Microsoft CEO", "back": "Satya Nadella" }
  ]
}

If the topic is "Population of the USA", the response should be:
{
  "cards": [
    { "front": "Population of the USA", "back": "350 million" }
  ]
}

If the topic is "bulb work?", the response should be:
{
  "cards": [
    { "front": "How does a bulb work", "back": "Passing electricity through a thin tungsten filament, heating it to extreme temperatures (over 2,000°C) until it glows. Bulb is filled with inert gas or a vacuum to prevent the hot metal from oxidizing and immediately burning out." }
  ]
}

If the topic is "acquiesce", the response should be:
{
  "cards": [
    { "front": "Define acquiesce", "back": "To agree or submit to something without protest. Eg: 'Sara acquiesced in his decision'" }
  ]
}


No extra keys. No surrounding markdown. No explanation outside JSON.
`.trim()
}

async function createMochiCard(params: {
  mochiApiKey: string
  deckId: string
  content: string
  tags: string[]
}) {
  const body: Record<string, unknown> = {
    content: params.content,
    'deck-id': params.deckId,
  }

  if (params.tags.length > 0) {
    body['manual-tags'] = params.tags
  }

  const response = await fetch(`${MOCHI_BASE_URL}/cards/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${params.mochiApiKey}:`).toString(
        'base64',
      )}`,
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(
      `Mochi create card failed with status ${response.status}: ${errorText}`,
    )
  }

  const createdCard = (await response.json()) as MochiCard

  return createdCard
}

export async function POST(request: Request) {
  try {
    const shortcutToken = process.env.SHORTCUT_AUTH_TOKEN
    const mochiApiKey = process.env.MOCHI_API_KEY
    const openaiApiKey = process.env.FLASHCARDS_OPENAI_API_KEY

    if (!shortcutToken || !mochiApiKey || !openaiApiKey) {
      return NextResponse.json(
        {
          error:
            'Server is missing required env vars: SHORTCUT_AUTH_TOKEN, MOCHI_API_KEY, FLASHCARDS_OPENAI_API_KEY',
        },
        { status: 500 },
      )
    }

    const authHeader = request.headers.get('authorization')
    const headerToken = request.headers.get('x-shortcut-token')
    const bearerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7).trim()
      : ''
    const providedToken = (bearerToken || headerToken || '').trim()

    if (!providedToken || !safeTokenMatch(providedToken, shortcutToken)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = (await request.json()) as GenerateFlashcardsBody
    const topic = body.topic?.trim()
    const deckId = body.deckId?.trim() || process.env.MOCHI_DEFAULT_DECK_ID
    const tags = sanitizeTags(body.tags)

    if (!topic) {
      return NextResponse.json(
        { error: 'Missing required body field: topic' },
        { status: 400 },
      )
    }

    if (topic.length > 300) {
      return NextResponse.json(
        { error: 'Topic is too long (max 300 characters)' },
        { status: 400 },
      )
    }

    if (!deckId) {
      return NextResponse.json(
        {
          error:
            'Missing deckId in request body and MOCHI_DEFAULT_DECK_ID is not set',
        },
        { status: 400 },
      )
    }

    const openai = new OpenAI({ apiKey: openaiApiKey })
    const completion = await openai.chat.completions.create({
      model: process.env.FLASHCARDS_OPENAI_MODEL || 'gpt-4.1-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert study assistant that writes concise, accurate, useful flashcards.',
        },
        {
          role: 'user',
          content: buildOpenAIPrompt(topic),
        },
      ],
      temperature: 0.1,
    })

    const raw = completion.choices[0]?.message?.content?.trim()
    if (!raw) {
      return NextResponse.json(
        { error: 'OpenAI returned an empty response' },
        { status: 502 },
      )
    }

    const generatedCards = parseFlashcards(raw)
    const createdCards: Array<{ id?: string; front: string }> = []

    // Mochi allows only one concurrent active request per account.
    for (const card of generatedCards) {
      const created = await createMochiCard({
        mochiApiKey,
        deckId,
        content: toMochiContent(card),
        tags,
      })

      if (created.id && created['template-id']) {
        const template = await getMochiTemplate({
          mochiApiKey,
          templateId: created['template-id'],
        })

        if (template) {
          const fields = buildTemplateFields(template, card)
          if (fields) {
            await updateMochiCard({
              mochiApiKey,
              cardId: created.id,
              fields,
            })
          }
        }
      }

      createdCards.push({
        id: created.id,
        front: card.front,
      })
    }

    return NextResponse.json({
      success: true,
      topic,
      deckId,
      createdCount: createdCards.length,
      cards: createdCards,
    })
  } catch (error) {
    console.error('Error generating Mochi flashcards:', error)
    return NextResponse.json(
      { error: 'Failed to generate and create Mochi flashcards' },
      { status: 500 },
    )
  }
}
