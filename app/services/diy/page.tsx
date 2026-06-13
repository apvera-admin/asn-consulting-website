import type { Metadata } from 'next';
import DIYPageClient from './DIYPageClient';

export const metadata: Metadata = {
  title: 'DIY Status Correction Program — Templates & Guidance',
  description: 'Complete your own status correction with our full library of document templates, step-by-step guides, and a 27-day email course. Affordable self-guided path to American State National status.',
  alternates: { canonical: 'https://www.asnconsulting.co/services/diy' },
};

export default function DIYPage() {
  return <DIYPageClient />;
}
