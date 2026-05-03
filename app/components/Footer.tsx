import Image from 'next/image';
import styles from './Footer.module.css';

const footerLinks = {
  services: [
    { label: 'DFY Status Correction', href: '/done-for-you-services' },
    { label: 'DIY Programs', href: '/plans-pricing' },
    { label: 'Private Trusts', href: '/private-trusts' },
    { label: 'Tax Consulting', href: '/tax-remedy-services' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'FAQs', href: '/faqs' },
    { label: 'Book a Call', href: '/services' },
  ],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>
              <Image src="/logo.svg" alt="ASN Consulting" width={220} height={55} />
            </div>
            <p className={styles.desc}>
              Expert status correction and private trust services.
              Chattanooga, Tennessee.
            </p>
            <a href="mailto:support@asnconsulting.co" className={styles.email}>
              support@asnconsulting.co
            </a>
          </div>

          <div className={styles.cols}>
            <div className={styles.col}>
              <h4 className={styles.colHeading}>Services</h4>
              <ul className={styles.colLinks}>
                {footerLinks.services.map((l) => (
                  <li key={l.label}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.col}>
              <h4 className={styles.colHeading}>Company</h4>
              <ul className={styles.colLinks}>
                {footerLinks.company.map((l) => (
                  <li key={l.label}>
                    <a href={l.href}>{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <span>© 2025 ASN Consulting. All rights reserved, without prejudice.</span>
          <div className={styles.bottomLinks}>
            <a href="/terms">Terms &amp; Conditions</a>
            <a href="/privacy">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
