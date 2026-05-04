import type { Metadata } from 'next';
import DIYPageClient from './DIYPageClient';

export const metadata: Metadata = {
  title: 'DIY Status Correction Programs | ASN Consulting',
  description:
    'Choose from four DIY status correction packages. Complete document generation, step-by-step guidance, and everything you need to correct your status as an American State National.',
};

export default function DIYPage() {
  return <DIYPageClient />;
}
