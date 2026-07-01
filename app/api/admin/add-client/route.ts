import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  const adminKey = req.headers.get('x-admin-key');
  if (adminKey !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { full_name, email, services, send_email } = await req.json();
  if (!email || !full_name) {
    return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
  }

  const dfyFields = {
    full_name,
    plan_tier: 'dfy',
    dfy_services: services || '',
    dfy_created_at: new Date().toISOString(),
    case_status: 'payment_received',
    docs_prepared: false,
    docs_mailed: false,
    plan_purchased_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: existingProfile } = await adminClient
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  let userId: string;

  if (existingProfile) {
    userId = existingProfile.id;
    await adminClient.from('profiles').update(dfyFields).eq('id', existingProfile.id);
  } else {
    const { data: newUser, error: createError } = await adminClient.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name, plan_tier: 'dfy' },
    });
    if (createError || !newUser?.user) {
      return NextResponse.json({ error: createError?.message || 'Failed to create user' }, { status: 500 });
    }
    userId = newUser.user.id;
    await adminClient.from('profiles').update(dfyFields).eq('id', userId);
  }

  const intakeLink = `${process.env.NEXT_PUBLIC_SITE_URL}/dfy-intake?email=${encodeURIComponent(email)}`;

  if (send_email) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ASN Consulting <noreply@asnconsulting.co>',
        to: email,
        subject: 'Next Steps — Complete Your Agreement & Intake Form',
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; background: #0C0D11; color: #F0EAD6; padding: 40px; border-radius: 8px;">
            <img src="https://asnconsulting.co/logo.svg" alt="ASN Consulting" style="width: 180px; margin-bottom: 28px;" />
            <h1 style="font-family: Georgia, serif; font-weight: 300; font-size: 26px; margin-bottom: 16px;">Welcome, ${full_name.split(' ')[0]}.</h1>
            <p style="color: #8A8070; line-height: 1.75; margin-bottom: 16px;">To begin preparing your documents, we need two quick things from you:</p>
            <p style="color: #C8963C; font-weight: 600; margin-bottom: 8px;">Step 1 — Sign your Hold Harmless Agreement</p>
            <p style="color: #C8963C; font-weight: 600; margin-bottom: 20px;">Step 2 — Complete your intake form</p>
            <a href="${intakeLink}" style="display: inline-block; padding: 14px 28px; background: #C8963C; color: #0C0D11; font-weight: 700; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; border-radius: 5px; text-decoration: none;">Get Started Now</a>
            <p style="color: #8A8070; font-size: 12px; margin-top: 32px;">Questions? Email support@asnconsulting.co</p>
          </div>`,
      }),
    }).catch(err => console.error('Failed to send add-client email:', err));
  }

  return NextResponse.json({ success: true, user_id: userId, intake_link: intakeLink });
}
