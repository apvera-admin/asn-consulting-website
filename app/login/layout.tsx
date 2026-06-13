import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Member Login',
  description: 'Log in to your ASN Consulting member dashboard to access your status correction documents, track your case, and manage your account.',
  alternates: { canonical: 'https://www.asnconsulting.co/login' },
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
