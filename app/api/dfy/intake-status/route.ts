import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const emailParam = searchParams.get('email');

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const email = user?.email || emailParam;

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 });
  }

  const { data: profile } = await adminClient
    .from('profiles')
    .select('hha_signed, hha_signed_at')
    .eq('email', email)
    .single();

  const { data: intake } = await adminClient
    .from('dfy_intake_submissions')
    .select('id, submitted_at')
    .eq('client_email', email)
    .single();

  return NextResponse.json({
    hha_signed: profile?.hha_signed || false,
    hha_signed_at: profile?.hha_signed_at || null,
    intake_submitted: !!intake,
    intake_submitted_at: intake?.submitted_at || null,
  });
}
