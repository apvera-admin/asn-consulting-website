import SectionLabel from './SectionLabel';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <div className={styles.labelRow} style={{ animation: 'fadeUp 0.8s 0.05s both' }}>
          <SectionLabel text="American State National Consulting" />
        </div>

        <h1 className={styles.h1} style={{ animation: 'fadeUp 0.8s 0.22s both' }}>
          Take Control of Your<br />
          <em className={styles.h1Gold}>Legal Identity</em>
          {' '}and Financial Future
        </h1>

        <p className={styles.sub} style={{ animation: 'fadeUp 0.8s 0.38s both' }}>
          We guide Americans through the status correction process — helping you
          reclaim your national standing, establish private trusts, and achieve
          true financial sovereignty.
        </p>

        <div className={styles.ctas} style={{ animation: 'fadeUp 0.8s 0.54s both' }}>
          <a href="/services" className={styles.primaryCta}>
            Get Started Today
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </a>
          <a href="/blueprint" className={styles.secondaryCta}>
            Download Free SPC Guide
          </a>
        </div>
      </div>

      {/* Decorative rings */}
      <div className={styles.rings} aria-hidden="true">
        <svg width="320" height="320" viewBox="0 0 320 320" className={styles.outerRing}>
          <circle cx="160" cy="160" r="154" fill="none"
            stroke="rgba(200,150,60,0.12)" strokeWidth="1" strokeDasharray="4 7"/>
        </svg>
        <svg width="252" height="252" viewBox="0 0 252 252" className={styles.middleRing}>
          <circle cx="126" cy="126" r="120" fill="none"
            stroke="rgba(200,150,60,0.10)" strokeWidth="1" strokeDasharray="3 6"/>
        </svg>
        <div className={styles.innerCircle}>
          <svg width="62" height="62" viewBox="0 0 24 24" fill="none"
            stroke="rgba(200,150,60,0.38)" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
