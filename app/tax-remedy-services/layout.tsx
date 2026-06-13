import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tax Consulting & Remedy Services',
  description: 'Lawful tax remedy strategies including Project 1040-X, lawful money redemption, and tax issue resolution. Reduce your tax liability through proven, lawful methods.',
  alternates: { canonical: 'https://www.asnconsulting.co/tax-remedy-services' },
};

export default function TaxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
