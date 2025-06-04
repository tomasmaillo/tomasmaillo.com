import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
})

export async function POST(request: Request) {
  try {
    const { itemTitle, amount } = await request.json()

    if (!itemTitle || !amount) {
      return NextResponse.json(
        { error: 'Item title and amount are required' },
        { status: 400 }
      )
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'User suggested item: ' + itemTitle,
              description: 'Bucket List Item Payment',
            },
            unit_amount: amount * 100, // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/bucket-list?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/bucket-list?canceled=true`,
      metadata: {
        itemTitle,
        suggestedBy: request.headers.get('x-suggested-by'),
        suggestedByAvatar: request.headers.get('x-suggested-by-avatar'),
        environment: 'test',
      },
    })

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
