import { NextRequest, NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

function checkAdminKey(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!checkAdminKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const email = req.nextUrl.searchParams.get('email') ?? '';
  if (email.length < 2) {
    return NextResponse.json({ users: [] });
  }

  const { data, error } = await adminClient
    .from('profiles')
    .select(
      'id, email, full_name, plan_tier, purchased_services, submission_limit_override, submissions_used, plan_purchased_at, hha_signed'
    )
    .ilike('email', `%${email}%`)
    .limit(20);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: data ?? [] });
}
