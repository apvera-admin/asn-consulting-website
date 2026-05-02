'use client';
import { useEffect, useState } from 'react';
import SectionLabel from './SectionLabel';
import styles from './EmailCTA.module.css';

export default function EmailCTA() {
  const [email, setEmail] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      }),
      { threshold: 0.07 }
    );
    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Phase 2: wire to Resend / ActiveCampaign
  };

  return (
    <section className={`${styles.section} reveal`}>
      <div className={styles.inner}>
        <SectionLabel text="Free 27-Day Course" centered />

        <div className={styles.iconCircle}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>

        <h2 className={styles.h2}>Awaken in 27 Days</h2>

        <p className={styles.body}>
          Join thousands of Americans enrolled in our free 27-day email course.
          Each day delivers one clear, actionable lesson on status correction,
          private trusts, and financial sovereignty.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="email"
            className={styles.input}
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className={styles.submitBtn}>
            Get Access
          </button>
        </form>
      </div>
    </section>
  );
}
