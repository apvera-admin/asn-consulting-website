import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tax Consulting & Lawful Tax Relief | ASN Consulting',
  description:
    'Lawfully reduce or eliminate your income tax liability. Project 1040-X amendments to recover prior payments, Lawful Money Redemption for future non-obligation, and expert tax issue resolution. Chattanooga, Tennessee.',
};

export default function TaxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
