'use client';
import { useEffect } from 'react';
import SectionLabel from './SectionLabel';
import styles from './Testimonials.module.css';

const StarIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--gold)" stroke="none">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const testimonials = [
  {
    initials: 'MA',
    name: 'Mary Ann',
    location: 'Arizona',
    quote:
      "Excellent knowledge for people who don't have time to research themselves. This program gets you going quickly — and you can tell when someone has their heart in the right place.",
    featured: false,
  },
  {
    initials: 'AG',
    name: 'Andrew Gray',
    location: 'Michigan',
    quote:
      "If you're ready to walk in a straight and deliberate line towards freedom, there's really only one person to work with — and you've found him. Consider yourself fortunate.",
    featured: true,
  },
  {
    initials: 'JD',
    name: 'Jon Dowling',
    location: 'California',
    quote:
      'Working with Titus was a seamless process — so fast and accurate. I loved having to do very little while he did all the heavy lifting. Highly recommend for expert guidance.',
    featured: false,
  },
];

export default function Testimonials() {
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
        <SectionLabel text="Client Stories" centered />
        <h2 className={styles.h2}>What our clients say</h2>
      </div>

      <div className={styles.grid}>
        {testimonials.map((t) => (
          <div
            key={t.initials}
            className={`${styles.card} ${t.featured ? styles.featured : ''}`}
          >
            <div className={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} />
              ))}
            </div>
            <p className={styles.quote}>"{t.quote}"</p>
            <div className={styles.divider} />
            <div className={styles.author}>
              <div className={styles.avatar}>{t.initials}</div>
              <div>
                <div className={styles.name}>{t.name}</div>
                <div className={styles.location}>{t.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
