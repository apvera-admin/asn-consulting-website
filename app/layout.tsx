import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ASN Consulting — Status Correction & Private Trusts',
  description:
    'Expert guidance on American State National status correction, private trust formation, and tax consulting. Chattanooga, Tennessee.',
    icons: {
       icon: '/favicon.ico',
 },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
