import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Complete Your Enrollment | ASN Consulting',
  description:
    'Sign your Hold Harmless Agreement and complete your intake form to begin your DFY document preparation.',
};

export default function DFYIntakeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
