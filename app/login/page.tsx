'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import SectionLabel from '@/app/components/SectionLabel';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <div className={styles.cardAccent} />
        <Image src="/logo.svg" alt="ASN Consulting" width={160} height={40} className={styles.logo} />
        <div className={styles.labelWrap}>
          <SectionLabel text="Member Login" />
        </div>
        <h2 className={styles.heading}>Welcome back</h2>
        <p className={styles.sub}>Sign in to access your DIY program</p>

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

          <div className={styles.fieldGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              className={styles.input}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <div className={styles.forgotRow}>
              <Link href="/reset-password" className={styles.forgotLink}>
                Forgot your password?
              </Link>
            </div>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.footer}>
          <p className={styles.footerText}>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className={styles.footerLink}>Sign up</Link>
          </p>
          <Link href="/" className={styles.backLink}>← Back to site</Link>
        </div>
      </div>
    </main>
  );
}
