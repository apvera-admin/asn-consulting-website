import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { adminClient } from '@/lib/supabase/admin';
import { acTrackEvent, AC_TAGS, AC_FIELDS } from '@/lib/activecampaign';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Map Stripe price IDs to plan tiers.
// After setting up your Stripe products, replace these placeholder keys
// with your actual Price IDs from Stripe Dashboard → Products.
const PLAN_MAP: Record<string, string> = {
  'price_individual_placeholder': 'individual',
  'price_partner_placeholder': 'partner',
  'price_family_placeholder': 'family',
  'price_roe_placeholder': 'roe',
};

const SUBMISSION_LIMITS: Record<string, number> = {
  individual: 1,
  partner: 2,
  family: 4,
  roe: 1,
};

const PLAN_SERVICES: Record<string, string[]> = {
  individual: ['status_correction'],
  partner:    ['status_correction'],
  family:     ['status_correction'],
  roe:        ['roe'],
};

async function sendEmail(to: string, subject: string, html: string) {
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ASN Consulting <noreply@asnconsulting.co>',
        to,
        subject,
        html,
      }),
    });
  } catch (err) {
    console.error('Failed to send email:', err);
  }
}

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
    const customerEmail = session.customer_details?.email ?? '';
    const stripeCustomerId = session.customer as string;

    // ── DFY purchase (done-for-you services) ──────────────────────────────
    if (sessionType === 'dfy_purchase') {
      await adminClient
        .from('profiles')
        .upsert(
          {
            email: customerEmail,
            plan_tier: 'dfy' as any,
            plan_purchased_at: new Date().toISOString(),
            stripe_customer_id: stripeCustomerId,
            dfy_services: session.metadata?.services ?? '',
          },
          { onConflict: 'email' }
        );

      await acTrackEvent({
        email: customerEmail,
        firstName: session.customer_details?.name?.split(' ')[0] || '',
        lastName: session.customer_details?.name?.split(' ').slice(1).join(' ') || '',
        tagId: AC_TAGS.dfy_client,
        fields: [
          { fieldId: AC_FIELDS.purchase_type, value: 'dfy' },
          { fieldId: AC_FIELDS.purchase_date, value: new Date().toISOString().split('T')[0] },
          { fieldId: AC_FIELDS.case_status, value: 'payment_received' },
        ],
      });

      await sendEmail(
        customerEmail,
        'Welcome to ASN Consulting — Next Steps',
        `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; background: #0C0D11; color: #F0EAD6; padding: 40px; border-radius: 8px;">
          <img src="https://asnconsulting.co/logo.svg" alt="ASN Consulting" style="width: 180px; margin-bottom: 28px;" />
          <h1 style="font-family: Georgia, serif; font-weight: 300; font-size: 28px; color: #F0EAD6; margin-bottom: 16px;">Thank you for your payment.</h1>
          <p style="color: #8A8070; line-height: 1.75; margin-bottom: 16px;">We have received your payment for: <strong style="color: #F0EAD6;">${session.metadata?.services ?? ''}</strong></p>
          <p style="color: #8A8070; line-height: 1.75; margin-bottom: 28px;">To begin your document preparation, you need to complete two quick steps:</p>
          <p style="color: #C8963C; font-weight: 600; margin-bottom: 8px;">Step 1 — Sign your Hold Harmless Agreement</p>
          <p style="color: #8A8070; line-height: 1.75; margin-bottom: 20px;">This is required before we begin preparing your documents.</p>
          <p style="color: #C8963C; font-weight: 600; margin-bottom: 8px;">Step 2 — Complete your intake form</p>
          <p style="color: #8A8070; line-height: 1.75; margin-bottom: 28px;">This link is yours to keep. If you close the page or get interrupted, you can return at any time.</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/dfy-intake?email=${encodeURIComponent(customerEmail)}" style="display: inline-block; padding: 14px 28px; background: #C8963C; color: #0C0D11; font-weight: 700; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 5px; text-decoration: none;">Get Started Now</a>
          <p style="color: #8A8070; font-size: 12px; margin-top: 32px;">Questions? Email us at support@asnconsulting.co</p>
        </div>
        `
      );
    }

    // ── DIY plan purchase ─────────────────────────────────────────────────
    if (!sessionType && customerEmail) {
      // Determine plan tier from line items
      const expandedSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items.data.price'],
      });
      const priceId = expandedSession.line_items?.data[0]?.price?.id ?? '';
      const planTier = PLAN_MAP[priceId] ?? 'individual';

      // Check if profile already exists
      const { data: existing } = await adminClient
        .from('profiles')
        .select('id')
        .eq('email', customerEmail)
        .single();

      const purchasedServices = PLAN_SERVICES[planTier] ?? ['status_correction'];

      if (existing) {
        await adminClient
          .from('profiles')
          .update({
            plan_tier: planTier,
            purchased_services: purchasedServices,
            plan_purchased_at: new Date().toISOString(),
            stripe_customer_id: stripeCustomerId,
            submissions_used: 0,
            updated_at: new Date().toISOString(),
          })
          .eq('email', customerEmail);
      } else {
        // Create auth user — profile row created automatically by trigger
        const { data: newUser } = await adminClient.auth.admin.createUser({
          email: customerEmail,
          email_confirm: false,
          user_metadata: { plan_tier: planTier },
        });

        if (newUser.user) {
          await adminClient
            .from('profiles')
            .update({
              plan_tier: planTier,
              purchased_services: purchasedServices,
              plan_purchased_at: new Date().toISOString(),
              stripe_customer_id: stripeCustomerId,
            })
            .eq('id', newUser.user.id);

          // Generate password-reset link so user can set their password
          await adminClient.auth.admin.generateLink({
            type: 'recovery',
            email: customerEmail,
            options: {
              redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
            },
          });
        }
      }

      const DIY_TAG_MAP: Record<string, number> = {
        individual: AC_TAGS.diy_individual,
        partner:    AC_TAGS.diy_partner,
        family:     AC_TAGS.diy_family,
        roe:        AC_TAGS.diy_roe,
      };
      const diyTagId = DIY_TAG_MAP[planTier];
      if (diyTagId && customerEmail) {
        await acTrackEvent({
          email: customerEmail,
          firstName: session.customer_details?.name?.split(' ')[0] || '',
          lastName: session.customer_details?.name?.split(' ').slice(1).join(' ') || '',
          tagId: diyTagId,
          fields: [
            { fieldId: AC_FIELDS.purchase_type, value: planTier },
            { fieldId: AC_FIELDS.purchase_date, value: new Date().toISOString().split('T')[0] },
          ],
        });
      }

      const tierLabel = planTier.charAt(0).toUpperCase() + planTier.slice(1);
      await sendEmail(
        customerEmail,
        'Welcome to ASN Consulting — Your account is ready',
        `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; background: #0C0D11; color: #F0EAD6; padding: 40px; border-radius: 8px;">
          <img src="https://asnconsulting.co/logo.svg" alt="ASN Consulting" style="width: 180px; margin-bottom: 28px;" />
          <h1 style="font-family: Georgia, serif; font-weight: 300; font-size: 28px; color: #F0EAD6; margin-bottom: 16px;">Welcome to ASN Consulting</h1>
          <p style="color: #8A8070; line-height: 1.75; margin-bottom: 16px;">Thank you for your purchase. Your <strong style="color: #F0EAD6;">${tierLabel} Plan</strong> is now active.</p>
          <p style="color: #8A8070; line-height: 1.75; margin-bottom: 28px;">Click the button below to set your password and access your member dashboard.</p>
          <a href="${process.env.NEXT_PUBLIC_SITE_URL}/update-password" style="display: inline-block; padding: 14px 28px; background: #C8963C; color: #0C0D11; font-weight: 700; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 5px; text-decoration: none;">Set Your Password & Login</a>
          <p style="color: #8A8070; font-size: 12px; margin-top: 32px; line-height: 1.65;">Questions? Email us at support@asnconsulting.co</p>
        </div>
        `
      );
    }
  }

  // TODO: Set up a Supabase Edge Function or Vercel Cron job that runs daily
  // and sends a reminder email to any DFY client who purchased more than 24 hours ago
  // but has not submitted their intake form.
  // Query: SELECT email FROM profiles WHERE plan_tier = 'dfy'
  //        AND plan_purchased_at < NOW() - INTERVAL '24 hours'
  //        AND NOT EXISTS (SELECT 1 FROM dfy_intake_submissions WHERE client_email = email)

  return NextResponse.json({ received: true });
}
