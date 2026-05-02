'use client';
import { useEffect } from 'react';
import SectionLabel from './SectionLabel';
import styles from './Services.module.css';

const CheckIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
    stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const cards = [
  {
    id: 'dfy',
    featured: true,
    category: 'Done for You',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: 'DFY Status Correction',
    description:
      'Our team handles the complete status correction process — from document preparation to final recording. You provide the information; we do the heavy lifting.',
    features: [
      'Full document preparation & filing',
      'Notarization coordination included',
      'Expert guidance at every step',
    ],
    cta: 'Get Started',
    ctaVariant: 'primary' as const,
    href: '/done-for-you-services',
  },
  {
    id: 'diy',
    featured: false,
    category: 'Do It Yourself',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8L14 2z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="8" y1="13" x2="16" y2="13"/>
        <line x1="8" y1="17" x2="16" y2="17"/>
      </svg>
    ),
    title: 'DIY Status Correction',
    description:
      'Access our full library of templates, step-by-step guides, and educational resources to complete your own status correction at a fraction of the cost.',
    features: [
      'Step-by-step guided program',
      'All document templates included',
      '27-day email course support',
    ],
    cta: 'Explore Program',
    ctaVariant: 'outline' as const,
    href: '/plans-pricing',
  },
  {
    id: 'trusts',
    featured: false,
    category: 'Asset Protection',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
    title: 'Private Trusts',
    description:
      'Establish a private trust to protect your assets and operate outside the commercial banking system. We guide you through every step of the formation process.',
    features: [
      'Asset protection strategies',
      'Trust formation & filing',
      'Ongoing trust management',
    ],
    cta: 'Learn More',
    ctaVariant: 'outline' as const,
    href: '/private-trusts',
  },
  {
    id: 'tax',
    featured: false,
    category: 'Financial Strategy',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23"/>
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
      </svg>
    ),
    title: 'Tax Consulting',
    description:
      'Reduce your tax liability through lawful, proven strategies. We analyze your situation and provide a clear path to financial sovereignty.',
    features: [
      'Tax liability reduction',
      'IRS correspondence handling',
      'Strategic tax planning',
    ],
    cta: 'Learn More',
    ctaVariant: 'outline' as const,
    href: '/tax-remedy-services',
  },
];

export default function Services() {
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
    <section className={`${styles.services} reveal`}>
      <div className={styles.header}>
        <SectionLabel text="Our Services" centered />
        <h2 className={styles.h2}>Choose the path that works for you</h2>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`${styles.card} ${card.featured ? styles.featured : ''}`}
          >
            {card.featured && (
              <span className={styles.badge}>Most Popular</span>
            )}
            <div className={styles.iconBlock}>{card.icon}</div>
            <span className={styles.category}>{card.category}</span>
            <h3 className={styles.cardTitle}>{card.title}</h3>
            <p className={styles.description}>{card.description}</p>
            <ul className={styles.features}>
              {card.features.map((f) => (
                <li key={f} className={styles.featureItem}>
                  <CheckIcon />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a
              href={card.href}
              className={`${styles.ctaBtn} ${card.ctaVariant === 'primary' ? styles.ctaPrimary : styles.ctaOutline}`}
            >
              {card.cta}
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
