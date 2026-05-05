import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminClient } from '@/lib/supabase/admin';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'Missing stripe-signature header' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature failed' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const sessionType = session.metadata?.type;
    const customerEmail = session.customer_details?.email || '';
    const stripeCustomerId = session.customer as string;

    if (sessionType === 'dfy_purchase') {
      await adminClient
        .from('profiles')
        .upsert(
          {
            email: customerEmail,
            plan_tier: 'dfy',
            plan_purchased_at: new Date().toISOString(),
            stripe_customer_id: stripeCustomerId,
            dfy_services: session.metadata?.services || '',
          },
          { onConflict: 'email' }
        );

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'ASN Consulting <noreply@asnconsulting.co>',
          to: customerEmail,
          subject: 'Welcome to ASN Consulting — Next Steps',
          html: `
            <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; background: #0C0D11; color: #F0EAD6; padding: 40px; border-radius: 8px;">
              <img src="https://asnconsulting.co/logo.svg" alt="ASN Consulting" style="width: 180px; margin-bottom: 28px;" />
              <h1 style="font-family: Georgia, serif; font-weight: 300; font-size: 28px; color: #F0EAD6; margin-bottom: 16px;">Thank you for your payment.</h1>
              <p style="color: #8A8070; line-height: 1.75; margin-bottom: 16px;">We have received your payment for: <strong style="color: #F0EAD6;">${session.metadata?.services}</strong></p>
              <p style="color: #8A8070; line-height: 1.75; margin-bottom: 28px;">To begin your document preparation, you need to complete two quick steps:</p>
              <p style="color: #C8963C; font-weight: 600; margin-bottom: 8px;">Step 1 — Sign your Hold Harmless Agreement</p>
              <p style="color: #8A8070; line-height: 1.75; margin-bottom: 20px;">This is required before we begin preparing your documents.</p>
              <p style="color: #C8963C; font-weight: 600; margin-bottom: 8px;">Step 2 — Complete your intake form</p>
              <p style="color: #8A8070; line-height: 1.75; margin-bottom: 28px;">This gives us all the information we need to prepare your documents correctly.</p>
              <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dfy-thank-you" style="display: inline-block; padding: 14px 28px; background: #C8963C; color: #0C0D11; font-weight: 700; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 5px; text-decoration: none;">Get Started Now</a>
              <p style="color: #8A8070; font-size: 12px; margin-top: 32px;">Questions? Email us at support@asnconsulting.co</p>
            </div>
          `,
        }),
      });
    }
  }

  return NextResponse.json({ received: true });
}
