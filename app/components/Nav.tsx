'use client';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import styles from './Nav.module.css';

const diyPlans = [
  { label: 'Individual Package', price: '$297', href: '/services/diy#individual' },
  { label: 'Partner Package',    price: '$597', href: '/services/diy#partner' },
  { label: 'Family Package',     price: '$997', href: '/services/diy#family' },
  { label: 'ROE Package',        price: '$397', href: '/services/diy#roe' },
];

const otherServices = [
  { label: 'Private Trusts',   href: '/private-trusts',       icon: '🛡' },
  { label: 'Tax Consulting',   href: '/tax-remedy-services',  icon: '💰' },
];

export default function Nav() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega  = () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); setMegaOpen(true); };
  const closeMega = () => { timeoutRef.current = setTimeout(() => setMegaOpen(false), 120); };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user);
    });
  }, []);

  return (
    <nav className={styles.nav} ref={navRef}>
      <div className={styles.inner}>

        {/* Logo */}
        <a href="/" className={styles.logo}>
          <Image src="/logo.svg" alt="ASN Consulting" width={280} height={70} priority />
        </a>

        {/* Desktop links */}
        <div className={styles.right}>
          <ul className={styles.links}>
            <li><a href="/about">About</a></li>

            {/* Services trigger */}
            <li
              className={styles.megaTrigger}
              onMouseEnter={openMega}
              onMouseLeave={closeMega}
            >
              <button
                className={`${styles.servicesBtn} ${megaOpen ? styles.servicesBtnActive : ''}`}
                onClick={() => setMegaOpen(v => !v)}
                aria-expanded={megaOpen}
              >
                Services
                <svg
                  className={`${styles.chevron} ${megaOpen ? styles.chevronOpen : ''}`}
                  width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                >
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>

              {/* ── Mega menu ── */}
              <div
                className={`${styles.mega} ${megaOpen ? styles.megaOpen : ''}`}
                onMouseEnter={openMega}
                onMouseLeave={closeMega}
              >
                <div className={styles.megaInner}>

                  {/* Column 1 — DIY */}
                  <div className={styles.megaCol}>
                    <div className={styles.megaColHead}>
                      <span className={styles.megaColLabel}>DIY Programs</span>
                      <a href="/services/diy" className={styles.megaColSeeAll}>View all plans →</a>
                    </div>
                    <ul className={styles.megaPlanList}>
                      {diyPlans.map(p => (
                        <li key={p.label}>
                          <a href={p.href} className={styles.megaPlanItem}>
                            <span className={styles.megaPlanDot} />
                            <span className={styles.megaPlanLabel}>{p.label}</span>
                            <span className={styles.megaPlanPrice}>{p.price}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Divider */}
                  <div className={styles.megaDivider} />

                  {/* Column 2 — DFY */}
                  <div className={styles.megaCol}>
                    <div className={styles.megaColHead}>
                      <span className={styles.megaColLabel}>Done For You</span>
                    </div>
                    <a href="/done-for-you-services" className={styles.megaFeatureCard}>
                      <div className={styles.megaFeatureIcon}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                          stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                          <path d="M16 3.13a4 4 0 010 7.75"/>
                        </svg>
                      </div>
                      <div>
                        <div className={styles.megaFeatureTitle}>DFY Status Correction</div>
                        <div className={styles.megaFeatureDesc}>Full white-glove service — we handle everything start to finish</div>
                      </div>
                    </a>
                  </div>

                  {/* Divider */}
                  <div className={styles.megaDivider} />

                  {/* Column 3 — Other + CTA */}
                  <div className={styles.megaCol}>
                    <div className={styles.megaColHead}>
                      <span className={styles.megaColLabel}>Other Services</span>
                    </div>
                    <ul className={styles.megaOtherList}>
                      {otherServices.map(s => (
                        <li key={s.label}>
                          <a href={s.href} className={styles.megaOtherItem}>
                            <span className={styles.megaOtherIcon}>{s.icon}</span>
                            <span>{s.label}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                    <div className={styles.megaCTAWrap}>
                      <p className={styles.megaCTAText}>Not sure which service fits you?</p>
                      <a href="/services" className={styles.megaCTA}>
                        Book a Free Call
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
                          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <line x1="5" y1="12" x2="19" y2="12"/>
                          <polyline points="12 5 19 12 12 19"/>
                        </svg>
                      </a>
                    </div>
                  </div>

                </div>
              </div>
            </li>

            <li><a href="/blog">Blog</a></li>
            <li><a href="/faqs">FAQs</a></li>
          </ul>

          {isLoggedIn ? (
            <a href="/dashboard" className={styles.dashboardLink}>My Dashboard</a>
          ) : (
            <a href="/login" className={styles.dashboardLink}>Member Login</a>
          )}
          <a href="/services" className={styles.cta}>Book a Call</a>

          {/* Mobile hamburger */}
          <button
            className={styles.hamburger}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span className={`${styles.bar} ${mobileOpen ? styles.barTop : ''}`} />
            <span className={`${styles.bar} ${mobileOpen ? styles.barMid : ''}`} />
            <span className={`${styles.bar} ${mobileOpen ? styles.barBot : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ''}`}>
        <a href="/about" className={styles.mobileLink}>About</a>
        <div className={styles.mobileSectionLabel}>DIY Programs</div>
        {diyPlans.map(p => (
          <a key={p.label} href={p.href} className={styles.mobilePlanLink}>
            <span>{p.label}</span>
            <span className={styles.mobilePlanPrice}>{p.price}</span>
          </a>
        ))}
        <div className={styles.mobileSectionLabel}>Done For You</div>
        <a href="/done-for-you-services" className={styles.mobileLink}>DFY Status Correction</a>
        <div className={styles.mobileSectionLabel}>Other Services</div>
        {otherServices.map(s => (
          <a key={s.label} href={s.href} className={styles.mobileLink}>{s.label}</a>
        ))}
        <a href="/blog" className={styles.mobileLink}>Blog</a>
        <a href="/faqs" className={styles.mobileLink}>FAQs</a>
        <a href="/services" className={styles.mobileCTA}>Book a Call</a>
        {isLoggedIn ? (
          <a href="/dashboard" className={styles.mobileDashboardLink}>My Dashboard →</a>
        ) : (
          <a href="/login" className={styles.mobileDashboardLink}>Member Login →</a>
        )}
      </div>
    </nav>
  );
}
