'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import styles from './layout.module.css';

interface Props {
  userEmail: string;
}

const navItems = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: (
      <svg className={styles.navIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
        <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    href: '/dashboard/documents',
    label: 'My Documents',
    icon: (
      <svg className={styles.navIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M9 1H3a1 1 0 00-1 1v12a1 1 0 001 1h10a1 1 0 001-1V6L9 1z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M9 1v5h5" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M5 9h6M5 11.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: '/dashboard/videos',
    label: 'Instructional Videos',
    icon: (
      <svg className={styles.navIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.3" />
        <path d="M6.5 5.5l4 2.5-4 2.5V5.5z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: '/dashboard/account',
    label: 'My Account',
    icon: (
      <svg className={styles.navIcon} width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3" />
        <path d="M2 14c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function DashboardSidebar({ userEmail }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(false);

  function isActive(href: string) {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  }

  const sidebarContent = (
    <>
      <Link href="/dashboard" className={styles.sidebarLogo} onClick={() => setDrawerOpen(false)}>
        <Image src="/logo.svg" alt="ASN Consulting" width={140} height={35} />
      </Link>

      <nav className={styles.sidebarNav}>
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}
            onClick={() => setDrawerOpen(false)}
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>

      <div className={styles.sidebarBottom}>
        <span className={styles.userEmail}>{userEmail}</span>
        <button className={styles.signOutBtn} onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`${styles.sidebar} ${drawerOpen ? styles.drawerOpen : ''}`}>
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className={styles.mobileTopBar}>
        <Link href="/dashboard">
          <Image src="/logo.svg" alt="ASN Consulting" width={120} height={30} className={styles.mobileLogo} />
        </Link>
        <button className={styles.hamburger} onClick={() => setDrawerOpen(o => !o)} aria-label="Open menu">
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile overlay */}
      {drawerOpen && (
        <div className={styles.overlay} onClick={() => setDrawerOpen(false)} />
      )}
    </>
  );
}
