import SectionLabel from './SectionLabel';
import HeroDocBuilder from './HeroDocBuilder';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.inner}>
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

        {/* Animated document builder */}
        <HeroDocBuilder />
      </div>
    </section>
  );
}
