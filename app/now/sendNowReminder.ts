'use client'

export type NowReminderResult =
  | { status: 'sent' }
  | { status: 'cooldown'; retryAfterSeconds: number }

export async function sendNowReminder(): Promise<NowReminderResult> {
  const minDelay = 1000
  const delayPromise = new Promise<void>(resolve => setTimeout(resolve, minDelay))

  const responsePromise = fetch('/api/now-reminder', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Now-Reminder': 'clicked',
    },
    body: JSON.stringify({
      intent: 'update-now-page',
    }),
  })

  // artificial delay lol
  // just so that people really believe that the notification gets sent
  const [response] = await Promise.all([responsePromise, delayPromise])

  if (response.status === 429) {
    const body = (await response.json()) as {
      retryAfterSeconds?: number
    }

    return {
      status: 'cooldown',
      retryAfterSeconds: body.retryAfterSeconds ?? 300,
    }
  }

  if (!response.ok) {
    throw new Error('Reminder request failed')
  }

  return { status: 'sent' }
}
