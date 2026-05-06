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
  // Auth
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  // Check submission limit
  const { data: profile } = await adminClient
    .from('profiles')
    .select('plan_tier, submissions_used')
    .eq('id', user.id)
    .single();

  if (!profile?.plan_tier) {
    return NextResponse.json({ error: 'No active plan found' }, { status: 403 });
  }

  const limit = SUBMISSION_LIMITS[profile.plan_tier] ?? 0;
  if (profile.submissions_used >= limit) {
    return NextResponse.json({ error: 'Submission limit reached' }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.form_data) {
    return NextResponse.json({ error: 'form_data is required' }, { status: 400 });
  }

  // Call Railway generator
  const generatorUrl = process.env.GENERATOR_URL;
  const generatorKey = process.env.GENERATOR_API_KEY;

  if (!generatorUrl || !generatorKey) {
    return NextResponse.json({ error: 'Generator not configured' }, { status: 500 });
  }

  let railwayRes: Response;
  try {
    railwayRes = await fetch(`${generatorUrl}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': generatorKey,
      },
      body: JSON.stringify({ form_data: body.form_data }),
    });
  } catch (err) {
    console.error('Generator fetch failed:', err);
    return NextResponse.json({ error: 'Could not reach document generator' }, { status: 502 });
  }

  if (!railwayRes.ok) {
    const errText = await railwayRes.text().catch(() => 'Unknown error');
    return NextResponse.json({ error: errText }, { status: railwayRes.status });
  }

  // Log the submission before streaming the response
  await adminClient.from('submissions').insert({
    user_id: user.id,
    submission_number: profile.submissions_used + 1,
    form_data: body.form_data,
  });
  await adminClient
    .from('profiles')
    .update({ submissions_used: profile.submissions_used + 1, updated_at: new Date().toISOString() })
    .eq('id', user.id);

  // Stream the ZIP back to the browser
  const zipBuffer = await railwayRes.arrayBuffer();
  const contentDisposition = railwayRes.headers.get('content-disposition') ?? 'attachment; filename="documents.zip"';

  return new NextResponse(zipBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': contentDisposition,
    },
  });
}
