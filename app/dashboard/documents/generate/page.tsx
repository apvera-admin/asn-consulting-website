/**
 * DOCUMENT GENERATOR — INSTALLATION INSTRUCTIONS
 *
 * This page is ready to receive the document generator.
 * When the generator code is available:
 *
 * 1. Install required packages: npm install docxtemplater pizzip file-saver
 * 2. Upload your Word template files to /public/templates/
 *    Name them: individual-template.docx, partner-template.docx, etc.
 * 3. Replace the placeholder content in this page with the generator form
 * 4. On form submit, call POST /api/submissions/increment with the form data
 *    before triggering the document generation
 * 5. If the API returns 403, the user has hit their submission limit —
 *    show an error and do not generate the document
 *
 * The submission tracking API is already built and ready at:
 * POST /api/submissions/increment
 * Body: { form_data: { ...all form fields } }
 * Returns: { success: true, submissions_used: N, submissions_remaining: N }
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';

const SUBMISSION_LIMITS: Record<string, number> = {
  individual: 1,
  partner: 2,
  family: 4,
  roe: 1,
};

export default async function GeneratePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan_tier, submissions_used')
    .eq('id', user.id)
    .single();

  const plan = profile?.plan_tier as string | null;
  const limit = plan ? (SUBMISSION_LIMITS[plan] ?? 0) : 0;
  const used = profile?.submissions_used ?? 0;

  if (used >= limit) {
    redirect('/dashboard/documents');
  }

  return (
    <div style={{ padding: '48px 40px', maxWidth: '860px' }}>
      <p style={{ fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '10px' }}>
        Document Generator
      </p>
      <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 300, color: 'var(--cream)', margin: '0 0 24px' }}>
        Generate Your Documents
      </h1>

      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid rgba(200,150,60,0.12)',
        borderRadius: '10px',
        padding: '32px',
      }}>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.75, margin: '0 0 12px' }}>
          The document generator will be installed here. Please check back shortly.
        </p>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>
          This page is ready to receive the document generator code. Once installed, it will
          track your submission count automatically.
        </p>
      </div>
    </div>
  );
}
