import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { items, email } = body as {
      items: { name: string; amount: number; quantity: number }[];
      email?: string;
    };

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 });
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          description: `ASN Consulting — DFY ${item.name}`,
        },
        unit_amount: item.amount * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: email || undefined,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dfy-thank-you?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/done-for-you-services#calculator`,
      metadata: {
        type: 'dfy_purchase',
        services: items.map((i) => i.name).join(', '),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error('Stripe session error:', err);
    return NextResponse.json(
      { error: 'Failed to create payment session' },
      { status: 500 }
    );
  }
}
