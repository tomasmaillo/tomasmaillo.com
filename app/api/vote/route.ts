import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase-server'

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      winnerId?: unknown
      loserId?: unknown
    }

    if (
      typeof body.winnerId !== 'string' ||
      typeof body.loserId !== 'string' ||
      !UUID_PATTERN.test(body.winnerId) ||
      !UUID_PATTERN.test(body.loserId) ||
      body.winnerId === body.loserId
    ) {
      return NextResponse.json({ error: 'Invalid vote' }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()
    const { error } = await supabase.rpc('record_bucket_list_vote', {
      p_winner_id: body.winnerId,
      p_loser_id: body.loserId,
    })

    if (error) {
      console.error('Failed to record bucket-list vote:', error)
      return NextResponse.json(
        { error: 'Failed to record vote' },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Invalid vote request:', error)
    return NextResponse.json({ error: 'Invalid vote request' }, { status: 400 })
  }
}
