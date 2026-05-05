import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'Thank You — ASN Consulting',
};

export default function ThankYouPage() {
  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.cardAccent} />

        <div className={styles.icon}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="27" stroke="#C8963C" strokeWidth="1.5" />
            <path d="M17 28l8 8 14-16" stroke="#C8963C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className={styles.heading}>You&apos;re in.</h1>

        <p className={styles.body}>
          Thank you for your purchase. Check your email — we&apos;ve sent you a link to set
          your password and access your member dashboard. If you don&apos;t see it within a
          few minutes, check your spam folder.
        </p>

        <div className={styles.btnGroup}>
          <Link href="/update-password" className={styles.primaryBtn}>
            Set Up My Account
          </Link>
          <Link href="/" className={styles.outlineBtn}>
            Back to Home
          </Link>
        </div>

        <p className={styles.note}>
          Questions? Email us at{' '}
          <a href="mailto:support@asnconsulting.co" className={styles.noteLink}>
            support@asnconsulting.co
          </a>
        </p>
      </div>
    </main>
  );
}
