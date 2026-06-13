import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.asnconsulting.co'),
  title: {
    default: 'ASN Consulting — American State National Status Correction Services',
    template: '%s | ASN Consulting',
  },
  description: 'Expert guidance through the status correction process. We help Americans reclaim their national standing, revoke their election, establish private trusts, and achieve financial sovereignty.',
  keywords: ['status correction', 'American State National', 'revocation of election', 'become a state national', 'private trust', 'national standing', 'sovereignty consulting', 'state national status'],
  icons: { icon: '/favicon.ico' },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.asnconsulting.co',
    siteName: 'ASN Consulting',
    title: 'ASN Consulting — American State National Status Correction',
    description: 'Expert guidance through the status correction process. Reclaim your national standing and achieve financial sovereignty.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'ASN Consulting' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ASN Consulting — Status Correction Services',
    description: 'Expert guidance through the status correction process for American State Nationals.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
