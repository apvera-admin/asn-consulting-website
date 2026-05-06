'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import SectionLabel from '@/app/components/SectionLabel';
import styles from '../login/page.module.css';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setPasswordError('');

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: `${firstName} ${lastName}`.trim() },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
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
          <SectionLabel text="Create Account" />
        </div>
        <h2 className={styles.heading}>Get started</h2>
        <p className={styles.sub}>Create your ASN Consulting member account</p>

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
              We sent a confirmation link to <strong style={{ color: 'var(--cream-muted)' }}>{email}</strong>.
              Click the link to activate your account and then sign in.
            </p>
            <Link href="/login" className={styles.successBtn}>Back to Login</Link>
          </div>
        ) : (
          <>
            <form className={styles.form} onSubmit={handleSubmit}>
              {error && <div className={styles.error}>{error}</div>}

              <div className={styles.twoCol}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="firstName">First Name</label>
                  <input
                    id="firstName"
                    type="text"
                    required
                    className={styles.input}
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label} htmlFor="lastName">Last Name</label>
                  <input
                    id="lastName"
                    type="text"
                    required
                    className={styles.input}
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                  />
                </div>
              </div>

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

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={styles.input}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  className={styles.input}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
                {passwordError && <p className={styles.fieldError}>{passwordError}</p>}
              </div>

              <button type="submit" disabled={loading} className={styles.submitBtn}>
                {loading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <div className={styles.footer}>
              <p className={styles.footerText}>
                Already have an account?{' '}
                <Link href="/login" className={styles.footerLink}>Sign in</Link>
              </p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
