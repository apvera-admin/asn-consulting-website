'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import SectionLabel from '@/app/components/SectionLabel';
import styles from '../login/page.module.css';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `https://www.asnconsulting.co/auth/callback?type=recovery`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.cardAccent} />
        <Image src="/logo.svg" alt="ASN Consulting" width={160} height={40} className={styles.logo} />
        <div className={styles.labelWrap}>
          <SectionLabel text="Password Reset" />
        </div>
        <h2 className={styles.heading}>Reset your password</h2>
        <p className={styles.sub}>Enter your email and we&apos;ll send you a reset link</p>

        {success ? (
          <div className={styles.successWrap}>
            <div className={styles.successIcon}>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="21" stroke="#C8963C" strokeWidth="1.5" />
                <path d="M13 22l6 6 12-12" stroke="#C8963C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className={styles.successHeading}>Check your email</h3>
            <p className={styles.successPara}>
              We sent a password reset link to <strong style={{ color: 'var(--cream-muted)' }}>{email}</strong>.
              Click the link in the email to set a new password.
            </p>
            <Link href="/login" className={styles.successBtn}>Back to Login</Link>
          </div>
        ) : (
          <>
            <form className={styles.form} onSubmit={handleSubmit}>
              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={styles.input}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>

            <div className={styles.footer}>
              <Link href="/login" className={styles.backLink}>← Back to login</Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
