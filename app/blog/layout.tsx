import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | ASN Consulting',
  description:
    'Educational articles on status correction, private trusts, lawful tax strategies, and financial sovereignty. Learn how to reclaim your legal identity and protect your assets.',
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
