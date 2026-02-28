import { timingSafeEqual } from 'crypto'
import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'
import {
  FLASHCARDS_INSTRUCTIONS,
  FLASHCARDS_RESPONSE_SCHEMA,
} from './instructions'

// If you are stalking this file and wondering what its for:
// I use this endpoint to generate flashcards right from an iPhone Shortcut.
// They then get automatically added to my Mochi deck.
// I've set this up to work for just me atm :)

// Yes, I probably should have made a separate server/repo for this, but too much effort!

export const runtime = 'nodejs'

const MOCHI_BASE_URL = 'https://app.mochi.cards/api'
const MOCHI_TEMPLATE_ID = 'Xk2rKwFs'
const MOCHI_FRONT_FIELD_ID = 'name'
const MOCHI_BACK_FIELD_ID = 'V72yjxYh'

type Flashcard = {
  front: string
  back: string
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

function parseFlashcards(raw: string): Flashcard[] {
  const parsed = JSON.parse(raw) as { cards?: unknown }

  if (!Array.isArray(parsed.cards)) {
    throw new Error('OpenAI response did not include a cards array')
  }

  const cards = parsed.cards.map((card, index) => {
    if (!card || typeof card !== 'object') {
      throw new Error(`Invalid card at index ${index}: expected object`)
    }

    const front = (card as { front?: unknown }).front
    const back = (card as { back?: unknown }).back

    if (typeof front !== 'string' || typeof back !== 'string') {
      throw new Error(
        `Invalid card at index ${index}: front/back must be strings`,
      )
    }

    const trimmedFront = front.trim()
    const trimmedBack = back.trim()

    if (!trimmedFront || !trimmedBack) {
      throw new Error(`Invalid card at index ${index}: front/back are empty`)
    }

    return {
      front: trimmedFront,
      back: trimmedBack,
    }
  })

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

function buildTemplateFields(card: Flashcard) {
  return {
    [MOCHI_FRONT_FIELD_ID]: {
      id: MOCHI_FRONT_FIELD_ID,
      value: card.front,
    },
    [MOCHI_BACK_FIELD_ID]: {
      id: MOCHI_BACK_FIELD_ID,
      value: card.back,
    },
  }
}

async function createMochiCard(params: {
  mochiApiKey: string
  deckId: string
  content: string
  tags: string[]
  fields: Record<string, { id: string; value: string }>
}) {
  const body: Record<string, unknown> = {
    content: params.content,
    'deck-id': params.deckId,
    'template-id': MOCHI_TEMPLATE_ID,
    fields: params.fields,
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
  const startedAt = Date.now()

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

    const client = new OpenAI({ apiKey: openaiApiKey })

    const response = await client.responses.create({
      model: process.env.FLASHCARDS_OPENAI_MODEL || 'gpt-5.2',
      reasoning: { effort: 'low' },
      instructions: FLASHCARDS_INSTRUCTIONS,
      input: topic,
      text: {
        format: {
          type: 'json_schema',
          name: 'flashcards_response',
          schema: FLASHCARDS_RESPONSE_SCHEMA,
          strict: true,
        },
      },
    } as never)

    const raw = response.output_text.trim()

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
        fields: buildTemplateFields(card),
      })

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
      timeTaken: Date.now() - startedAt,
    })
  } catch (error) {
    console.error('Error generating Mochi flashcards:', error)
    return NextResponse.json(
      { error: 'Failed to generate and create Mochi flashcards' },
      { status: 500 },
    )
  }
}
