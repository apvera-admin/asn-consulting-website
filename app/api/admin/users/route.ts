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

  let query = adminClient
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  if (email.length >= 2) {
    query = query.ilike('email', `%${email}%`);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json({ error: error.message, users: [] }, { status: 500 });
  }

  return NextResponse.json({ users: data ?? [] });
}
