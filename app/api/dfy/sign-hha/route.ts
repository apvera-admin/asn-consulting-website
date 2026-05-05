import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { full_name, agreed } = body as { full_name: string; agreed: boolean };

    if (!agreed || !full_name?.trim()) {
      return NextResponse.json({ error: 'Agreement and name are required' }, { status: 400 });
    }

    const ip =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      'unknown';

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      await adminClient
        .from('profiles')
        .update({
          hha_signed: true,
          hha_signed_at: new Date().toISOString(),
          hha_signature_name: full_name.trim(),
          hha_ip_address: ip,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
    }

    await adminClient.from('hha_records').insert({
      full_name: full_name.trim(),
      ip_address: ip,
      signed_at: new Date().toISOString(),
      user_id: user?.id || null,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('HHA signing error:', err);
    return NextResponse.json({ error: 'Failed to record agreement' }, { status: 500 });
  }
}
