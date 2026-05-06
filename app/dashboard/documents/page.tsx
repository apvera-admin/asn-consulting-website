import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { adminClient } from '@/lib/supabase/admin';
import styles from './page.module.css';

const SUBMISSION_LIMITS: Record<string, number> = {
  individual: 1,
  partner: 2,
  family: 4,
  roe: 1,
};

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan_tier, submissions_used')
    .eq('id', user.id)
    .single();

  const plan = profile?.plan_tier as string | null;
  const submissionsUsed = profile?.submissions_used ?? 0;
  const submissionsAllowed = plan ? (SUBMISSION_LIMITS[plan] ?? 0) : 0;
  const submissionsRemaining = Math.max(submissionsAllowed - submissionsUsed, 0);
  const progressPct = submissionsAllowed > 0 ? Math.min((submissionsUsed / submissionsAllowed) * 100, 100) : 0;

  const { data: submissions } = await adminClient
    .from('submissions')
    .select('id, submission_number, submitted_at')
    .eq('user_id', user.id)
    .order('submitted_at', { ascending: false });

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Document Generator</h1>
      <p className={styles.sub}>Manage and generate your document packages.</p>

      <div className={styles.statusBar}>
        <div className={styles.statusLeft}>
          <p className={styles.statusBarLabel}>Submissions Used</p>
          <p className={styles.statusBarValue}>{submissionsUsed} of {submissionsAllowed}</p>
          <div className={styles.progressBar}>
            <div
              className={`${styles.progressFill} ${submissionsRemaining === 0 && submissionsAllowed > 0 ? styles.progressFillFull : ''}`}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
        <span className={`${styles.pill} ${submissionsRemaining > 0 ? styles.pillReady : styles.pillFull}`}>
          {submissionsRemaining > 0 ? 'Ready to Generate' : 'Limit Reached'}
        </span>
      </div>

      {submissionsRemaining > 0 ? (
        <div className={styles.generateCard}>
          <h2 className={styles.generateHeading}>Generate Your Documents</h2>
          <Link href="/dashboard/documents/generate" className={styles.generateBtn}>
            Open Document Generator →
          </Link>
          <p className={styles.generateNote}>
            Each submission uses one of your {submissionsAllowed} allotted
            generation{submissionsAllowed > 1 ? 's' : ''}. Review all your information carefully before submitting.
          </p>
        </div>
      ) : submissionsAllowed > 0 ? (
        <div className={styles.exhaustedCard}>
          <h2 className={styles.exhaustedHeading}>
            You have used all {submissionsAllowed} submission{submissionsAllowed > 1 ? 's' : ''} included in your plan.
          </h2>
          <p className={styles.exhaustedBody}>
            If you need to make corrections or generate additional documents, please contact our team.
          </p>
          <a href="mailto:support@asnconsulting.co" className={styles.contactBtn}>
            Contact Support
          </a>
        </div>
      ) : null}

      <div>
        <h3 className={styles.historyHeading}>Submission History</h3>
        {submissions && submissions.length > 0 ? (
          <div className={styles.historyList}>
            {submissions.map(s => (
              <div key={s.id} className={styles.historyRow}>
                <span className={styles.historyName}>Submission #{s.submission_number}</span>
                <span className={styles.historyDate}>
                  {new Date(s.submitted_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.emptyHistory}>No submissions yet.</p>
        )}
      </div>
    </div>
  );
}
