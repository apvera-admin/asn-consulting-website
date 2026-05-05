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
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: profile } = await adminClient
    .from('profiles')
    .select('plan_tier, submissions_used')
    .eq('id', user.id)
    .single();

  if (!profile || !profile.plan_tier) {
    return NextResponse.json({ error: 'No active plan found' }, { status: 403 });
  }

  const limit = SUBMISSION_LIMITS[profile.plan_tier] ?? 0;
  if (profile.submissions_used >= limit) {
    return NextResponse.json({ error: 'Submission limit reached' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));

  await adminClient.from('submissions').insert({
    user_id: user.id,
    submission_number: profile.submissions_used + 1,
    form_data: body.form_data ?? {},
  });

  await adminClient
    .from('profiles')
    .update({
      submissions_used: profile.submissions_used + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id);

  return NextResponse.json({
    success: true,
    submissions_used: profile.submissions_used + 1,
    submissions_remaining: limit - (profile.submissions_used + 1),
  });
}
