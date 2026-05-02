'use client';
import { useEffect } from 'react';
import SectionLabel from './SectionLabel';
import styles from './HowItWorks.module.css';

const steps = [
  {
    label: 'Step 01',
    title: 'Prepare Documents',
    description: 'Gather your identification documents and complete our intake form. We provide a clear checklist of everything you need.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8L14 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="16" y2="17"/>
      </svg>
    ),
  },
  {
    label: 'Step 02',
    title: 'Notarize Documents',
    description: 'Have your completed documents witnessed and notarized. We provide a locator tool and a step-by-step notarization checklist.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
  },
  {
    label: 'Step 03',
    title: 'Record Documents',
    description: "File your documents with the appropriate county recorder's office. We provide exact filing instructions for your jurisdiction.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
  },
  {
    label: 'Step 04',
    title: 'Mail Your Letters',
    description: 'Send certified mail to the relevant agencies. We provide pre-addressed templates and certified mail tracking guidance.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="22" y1="2" x2="11" y2="13"/>
        <polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
    ),
  },
];

export default function HowItWorks() {
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

  return (
    <section className={`${styles.section} reveal`}>
      <div className={styles.header}>
        <SectionLabel text="Our Process" centered />
        <h2 className={styles.h2}>A simple 4-step process</h2>
      </div>

      <div className={styles.grid}>
        <div className={styles.connectingLine} aria-hidden="true" />
        {steps.map((step) => (
          <div key={step.label} className={styles.step}>
            <div className={styles.iconCircle}>{step.icon}</div>
            <span className={styles.stepLabel}>{step.label}</span>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDesc}>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
