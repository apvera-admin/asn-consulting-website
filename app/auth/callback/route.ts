import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  
  const code = searchParams.get('code');
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type');
  const next = searchParams.get('next') ?? '/dashboard';

  // Handle PKCE code exchange (OAuth and magic links)
  if (code) {
    const supabase = createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // If this is a recovery (password reset) flow redirect to update-password
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/update-password`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Handle email OTP token hash (password reset emails)
  if (token_hash && type) {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as 'recovery' | 'email' | 'signup' | 'invite' | 'magiclink' | 'email_change',
    });

    if (!error) {
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/update-password`);
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
    
    console.error('Token verification error:', error);
  }

  // Something went wrong — redirect to login with error message
  return NextResponse.redirect(`${origin}/login?error=invalid_link`);
}
