// Required environment variables:
// PYTHON_GENERATOR_URL = the Railway deployment URL e.g. https://asn-doc-gen.up.railway.app
// GENERATOR_API_KEY    = a long random secret string — must match GENERATOR_API_KEY on Railway

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const SUBMISSION_LIMITS: Record<string, number> = {
  individual: 1,
  partner: 2,
  family: 4,
  roe: 1,
};

export async function POST(req: NextRequest) {
  // Authenticate
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch profile
  const { data: profile } = await adminClient
    .from('profiles')
    .select('plan_tier, submissions_used, submission_limit_override, purchased_services')
    .eq('id', user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  const limit =
    profile.submission_limit_override ??
    SUBMISSION_LIMITS[profile.plan_tier] ??
    1;

  if ((profile.submissions_used ?? 0) >= limit) {
    return NextResponse.json({ error: 'Submission limit reached' }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.form_data) {
    return NextResponse.json({ error: 'form_data required' }, { status: 400 });
  }

  // Call the Python microservice on Railway
  const generatorUrl =
    process.env.PYTHON_GENERATOR_URL ?? process.env.GENERATOR_URL;
  const generatorApiKey = process.env.GENERATOR_API_KEY;

  if (!generatorUrl || !generatorApiKey) {
    return NextResponse.json({ error: 'Generator not configured' }, { status: 500 });
  }

  let zipBuffer: ArrayBuffer;
  try {
    const generatorRes = await fetch(`${generatorUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': generatorApiKey,
      },
      body: JSON.stringify({ form_data: body.form_data }),
    });

    if (!generatorRes.ok) {
      const errData = await generatorRes.json().catch(() => ({}));
      return NextResponse.json(
        { error: (errData as { error?: string }).error ?? 'Generation failed' },
        { status: generatorRes.status }
      );
    }

    zipBuffer = await generatorRes.arrayBuffer();
  } catch (err) {
    console.error('Generator fetch error:', err);
    return NextResponse.json(
      { error: 'Could not reach document generator' },
      { status: 502 }
    );
  }

  const newCount = (profile.submissions_used ?? 0) + 1;

  // Increment counter and log
  await Promise.all([
    adminClient
      .from('profiles')
      .update({
        submissions_used: newCount,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id),
    adminClient.from('submissions').insert({
      user_id: user.id,
      submission_number: newCount,
      submitted_at: new Date().toISOString(),
      form_data: body.form_data,
    }),
  ]);

  const firstName = (body.form_data.first_name as string) || 'Client';
  const lastName = (body.form_data.last_name as string) || '';
  const zipFilename = `ASN Documents - ${firstName} ${lastName}.zip`.trim();

  return new NextResponse(zipBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${zipFilename}"`,
    },
  });
}
