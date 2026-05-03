import Image from 'next/image';
import styles from './Nav.module.css';

export default function Nav() {
  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <a href="/" className={styles.logo}>
          <Image src="/logo.svg" alt="ASN Consulting" width={100} height={40} priority />
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
