import { NextRequest, NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { sendPushoverNotification } from '@/lib/pushover'

const COOLDOWN_SECONDS = 5 * 60
const REMINDER_INTENT = 'update-now-page'
const REMINDER_HEADER = 'clicked'
const ALLOWED_ORIGINS = new Set([
  'http://localhost:3000',
  'https://tomasmaillo.com',
  'https://www.tomasmaillo.com',
])

const sendCachedNowReminder = unstable_cache(
  async () => {
    await sendPushoverNotification({
      title: 'Update your /now page',
      message:
        'Someone pressed the /now reminder button.\n\nhttps://tomasmaillo.com/now',
    })

    return {
      sentAt: Date.now(),
    }
  },
  ['now-page-update-reminder'],
  {
    revalidate: COOLDOWN_SECONDS,
  },
)

function isAllowedOrigin(request: NextRequest) {
  const origin = request.headers.get('origin')

  if (!origin) {
    return false
  }

  return ALLOWED_ORIGINS.has(origin)
}

async function hasButtonIntent(request: NextRequest) {
  if (request.headers.get('x-now-reminder') !== REMINDER_HEADER) {
    return false
  }

  try {
    const body = (await request.json()) as { intent?: unknown }
    return body.intent === REMINDER_INTENT
  } catch {
    return false
  }
}

function retryAfterFromSentAt(sentAt: number) {
  const secondsSinceSent = Math.floor((Date.now() - sentAt) / 1000)

  if (secondsSinceSent < 0 || secondsSinceSent >= COOLDOWN_SECONDS) {
    return null
  }

  return COOLDOWN_SECONDS - secondsSinceSent
}

function cooldownResponse(retryAfterSeconds: number) {
  return NextResponse.json(
    {
      error: 'Reminder cooldown is active',
      retryAfterSeconds,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(retryAfterSeconds),
      },
    },
  )
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request) || !(await hasButtonIntent(request))) {
    console.log(
      'Forbidden',
      request.headers.get('origin'),
      request.headers.get('x-now-reminder'),
    )
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const requestStartedAt = Date.now()
  const { sentAt } = await sendCachedNowReminder()
  const cacheRetryAfter = retryAfterFromSentAt(sentAt)
  const reminderWasSentForThisRequest = sentAt >= requestStartedAt

  if (cacheRetryAfter != null && !reminderWasSentForThisRequest) {
    return cooldownResponse(cacheRetryAfter)
  }

  return NextResponse.json({ success: true })
}
