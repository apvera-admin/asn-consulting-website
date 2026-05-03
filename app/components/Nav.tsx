import styles from './Nav.module.css';

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
          <span className={styles.logoAsn}>ASN</span>
          <span className={styles.logoDivider}>|</span>
          <span className={styles.logoConsulting}>Consulting</span>
        </a>

        <div className={styles.right}>
          <ul className={styles.links}>
            <li><a href="/about">About</a></li>
            <li><a href="/services">Services</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/faqs">FAQs</a></li>
          </ul>
          <a href="/services" className={styles.cta}>Book a Call</a>
        </div>
      </div>
    </nav>
  );
}
