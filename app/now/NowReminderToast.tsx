'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { sendNowReminder } from './sendNowReminder'

const TOAST_ID = 'now-page-reminder'
const REMINDER_DELAY_MS = 5000
const NUDGE_MESSAGE =
  'Sometimes I forget to update this page. You can send a notification to my phone to remind me.'
const COOLDOWN_MESSAGE =
  'Someone already pressed this button in the last 5 minutes! Give poor Tomas a break.'

function ReminderToast({ id }: { id: string | number }) {
  const [isSending, setIsSending] = useState(false)

  async function sendReminder() {
    setIsSending(true)

    try {
      const result = await sendNowReminder()

      toast.dismiss(id)
      if (result.status === 'cooldown') {
        toast.info(COOLDOWN_MESSAGE)
        return
      }

      toast.success('Reminder sent to my phone!')
    } catch (error) {
      console.error(error)
      toast.dismiss(id)
      toast.error('Eh, something went wrong :(')
    }
  }

  return (
    <div className="flex w-full flex-col items-start gap-3">
      <p className="text-sm font-normal leading-5 text-muted-foreground">
        {NUDGE_MESSAGE}
      </p>
      <button
        data-button
        type="button"
        className="gap-1.5 disabled:cursor-not-allowed disabled:opacity-70"
        style={{ marginLeft: 0, marginRight: 0 }}
        disabled={isSending}
        onClick={sendReminder}>
        {isSending && <Loader2 className="h-3 w-3 animate-spin" />}
        {isSending ? 'Sending...' : 'Nudge Tomas'}
      </button>
    </div>
  )
}

export default function NowReminderToast() {
  const hasShownToast = useRef(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      if (hasShownToast.current) {
        return
      }

      hasShownToast.current = true
      toast(<ReminderToast id={TOAST_ID} />, {
        id: TOAST_ID,
        duration: 10000,
        position: 'bottom-right',
      })
    }, REMINDER_DELAY_MS)

    return () => {
      window.clearTimeout(timeout)
      toast.dismiss(TOAST_ID)
    }
  }, [])

  return null
}
