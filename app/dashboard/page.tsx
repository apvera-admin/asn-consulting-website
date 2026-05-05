import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import styles from './page.module.css';

const PLAN_DATA: Record<string, { name: string; submissions: number }> = {
  individual: { name: 'Individual Package', submissions: 1 },
  partner: { name: 'Partner Package', submissions: 2 },
  family: { name: 'Family Package', submissions: 4 },
  roe: { name: 'ROE Package', submissions: 1 },
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, plan_tier, plan_purchased_at, submissions_used')
    .eq('id', user.id)
    .single();

  const plan = profile?.plan_tier as string | null;
  const planData = plan ? PLAN_DATA[plan] : null;
  const submissionsUsed = profile?.submissions_used ?? 0;
  const submissionsMax = planData?.submissions ?? 0;
  const progressPct = submissionsMax > 0 ? Math.min((submissionsUsed / submissionsMax) * 100, 100) : 0;
  const limitReached = submissionsUsed >= submissionsMax && submissionsMax > 0;

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there';

  const memberSince = profile?.plan_purchased_at
    ? new Date(profile.plan_purchased_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : '—';

  return (
    <div className={styles.page}>
      <h1 className={styles.welcomeHeading}>Welcome back, {firstName}</h1>
      <p className={styles.welcomeSub}>Here&apos;s your ASN Consulting member dashboard.</p>

      {planData && (
        <div className={styles.planCard}>
          <div className={styles.cardAccent} />
          <p className={styles.planLabel}>Your Plan</p>
          <h2 className={styles.planName}>{planData.name}</h2>
          <div className={styles.planStats}>
            <div className={styles.planStat}>
              <p className={styles.statLabel}>Submissions Used</p>
              <p className={styles.statValue}>{submissionsUsed} of {submissionsMax}</p>
              <div className={styles.progressBar}>
                <div
                  className={`${styles.progressFill} ${limitReached ? styles.progressFillFull : ''}`}
                  style={{ width: `${progressPct}%` }}
                />
              </div>
              {limitReached && <p className={styles.limitNote}>Submission limit reached</p>}
            </div>
            <div className={styles.planStat}>
              <p className={styles.statLabel}>Member Since</p>
              <p className={styles.statValue}>{memberSince}</p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.actionGrid}>
        <Link href="/dashboard/documents" className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8L14 2z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className={styles.actionTitle}>Generate Documents</p>
          <p className={styles.actionDesc}>Fill out your form and download your complete document package.</p>
        </Link>

        <Link href="/dashboard/videos" className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 8l6 4-6 4V8z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
          <p className={styles.actionTitle}>Watch Videos</p>
          <p className={styles.actionDesc}>Step-by-step instructional videos for each stage of the process.</p>
        </Link>

        <Link href="/services" className={styles.actionCard}>
          <div className={styles.actionIcon}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
              <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <p className={styles.actionTitle}>Book a Call</p>
          <p className={styles.actionDesc}>Have questions? Book a call with Titus or Jenna.</p>
        </Link>
      </div>

      <div className={styles.checklist}>
        <h3 className={styles.checklistHeading}>Your Process Checklist</h3>
        <div className={styles.checkItems}>
          {[
            {
              title: 'Generate your documents',
              desc: 'Complete the document generator form and download your package.',
            },
            {
              title: 'Get notarized',
              desc: 'Follow the notarization instructions in your video portal.',
            },
            {
              title: 'Record your documents',
              desc: (
                <>
                  File on the public record at{' '}
                  <a href="https://sovereignledger.co" target="_blank" rel="noopener noreferrer" className={styles.checkLink}>
                    sovereignledger.co
                  </a>
                </>
              ),
            },
            {
              title: 'Mail your letters',
              desc: 'Send certified mail to all appropriate parties using your cover letters.',
            },
          ].map((step, i) => (
            <div key={i} className={styles.checkItem}>
              <div className={styles.checkNum}>{i + 1}</div>
              <div className={styles.checkContent}>
                <p className={styles.checkTitle}>{step.title}</p>
                <p className={styles.checkDesc}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
