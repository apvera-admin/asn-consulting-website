import { NextRequest, NextResponse } from 'next/server';
import { acTrackEvent, AC_TAGS } from '@/lib/activecampaign';

export async function POST(req: NextRequest) {
  try {
    const { email, firstName, tagId } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    await acTrackEvent({
      email,
      firstName: firstName || '',
      tagId: tagId ?? AC_TAGS.email_course_27day,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Subscribe route error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
