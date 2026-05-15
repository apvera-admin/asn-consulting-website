import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import { acTrackEvent, AC_TAGS, AC_FIELDS } from '@/lib/activecampaign';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const photo = formData.get('photo') as File | null;
    let photoUrl: string | null = null;

    if (photo && photo.size > 0) {
      const fileExt = photo.name.split('.').pop() || 'jpg';
      const fileName = `dfy-intake-${Date.now()}.${fileExt}`;
      const fileBuffer = await photo.arrayBuffer();

      const { data: uploadData, error: uploadError } = await adminClient.storage
        .from('client-photos')
        .upload(fileName, fileBuffer, {
          contentType: photo.type,
          upsert: false,
        });

      if (!uploadError && uploadData) {
        const { data: urlData } = adminClient.storage
          .from('client-photos')
          .getPublicUrl(fileName);
        photoUrl = urlData.publicUrl;
      }
    }

    const intakeData: Record<string, string> = {};
    for (const [key, value] of Array.from(formData.entries())) {
      if (key !== 'photo') {
        intakeData[key] = value.toString();
      }
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    await adminClient.from('dfy_intake_submissions').insert({
      user_id: user?.id || null,
      client_email: intakeData.email,
      photo_url: photoUrl,
      form_data: intakeData,
      submitted_at: new Date().toISOString(),
    });

    await acTrackEvent({
      email: intakeData.email || user?.email || '',
      firstName: intakeData.first_name || '',
      lastName: intakeData.last_name || '',
      tagId: AC_TAGS.dfy_intake_submitted,
      fields: [
        { fieldId: AC_FIELDS.case_status, value: 'documents_in_preparation' },
      ],
    });

    const fieldLines = Object.entries(intakeData)
      .map(
        ([k, v]) =>
          `<tr><td style="padding: 8px 12px; color: #8A8070; font-size: 12px; border-bottom: 1px solid #1a1b22;">${k.replace(/_/g, ' ').toUpperCase()}</td><td style="padding: 8px 12px; color: #F0EAD6; font-size: 12px; border-bottom: 1px solid #1a1b22;">${v}</td></tr>`
      )
      .join('');

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ASN Consulting <noreply@asnconsulting.co>',
        to: 'support@asnconsulting.co',
        subject: `New DFY Intake Form Submitted — ${intakeData.email}`,
        html: `
          <div style="font-family: sans-serif; max-width: 700px; margin: 0 auto; background: #0C0D11; color: #F0EAD6; padding: 32px; border-radius: 8px;">
            <h2 style="font-family: Georgia, serif; font-weight: 300; color: #C8963C; margin-bottom: 8px;">New DFY Client Intake</h2>
            <p style="color: #8A8070; margin-bottom: 24px;">A client has completed the HHA and submitted their intake form.</p>
            ${photoUrl ? `<p style="margin-bottom: 16px;"><strong style="color: #C8963C;">Photo:</strong> <a href="${photoUrl}" style="color: #C8963C;">${photoUrl}</a></p>` : ''}
            <table style="width: 100%; border-collapse: collapse; background: #131520; border-radius: 8px; overflow: hidden;">${fieldLines}</table>
            <p style="color: #8A8070; font-size: 12px; margin-top: 24px;">Log in to your Supabase dashboard to view the full submission record.</p>
          </div>
        `,
      }),
    });

    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ASN Consulting <noreply@asnconsulting.co>',
        to: intakeData.email,
        subject: 'ASN Consulting — We received your intake form',
        html: `
          <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; background: #0C0D11; color: #F0EAD6; padding: 40px; border-radius: 8px;">
            <img src="https://asnconsulting.co/logo.svg" alt="ASN Consulting" style="width: 180px; margin-bottom: 28px;" />
            <h1 style="font-family: Georgia, serif; font-weight: 300; font-size: 26px; color: #F0EAD6; margin-bottom: 16px;">We received your intake form.</h1>
            <p style="color: #8A8070; line-height: 1.75; margin-bottom: 16px;">Thank you for completing your Hold Harmless Agreement and intake form. Our team will begin preparing your documents shortly.</p>
            <p style="color: #8A8070; line-height: 1.75; margin-bottom: 28px;">We will reach out if we need any clarification. Most clients receive their completed documents within 5–7 business days.</p>
            <p style="color: #8A8070; font-size: 12px;">Questions? Email us at support@asnconsulting.co</p>
          </div>
        `,
      }),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Intake submission error:', err);
    return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
  }
}
