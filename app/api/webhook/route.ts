import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Get the suggested by and avatar from metadata
    const suggestedBy = session.metadata?.suggestedBy || ''
    const avatarUrl = session.metadata?.suggestedByAvatar || ''

    // Add the item to the bucket list
    const { error } = await supabase.from('bucket_list_items').insert([
      {
        title: session.metadata?.itemTitle,
        elo_score: 1000,
        completed: false,
        suggested_by: suggestedBy,
        suggested_by_avatar: avatarUrl,
        price: session.amount_total ? session.amount_total / 100 : null,
      },
    ])

    if (error) {
      console.error('Error adding item to bucket list:', error)
      return NextResponse.json(
        { error: 'Failed to add item to bucket list' },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ received: true })
}
