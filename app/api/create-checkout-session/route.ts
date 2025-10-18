import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16'
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, userId } = body

    if (!email || !userId) {
      return NextResponse.json(
        { error: 'Email and user ID required' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session for $20/month subscription
    // Using existing product and price from Stripe account
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1SJPBOFSYcTHcWEtQIFIb6at', // $20/month recurring price
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/?subscribed=true`,
      cancel_url: `${request.headers.get('origin')}/subscribe`,
      customer_email: email,
      client_reference_id: userId,
      metadata: {
        userId
      }
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Stripe error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

