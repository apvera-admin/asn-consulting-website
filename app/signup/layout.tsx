import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Your Account',
  description: 'Create your ASN Consulting member account to access your status correction documents and member dashboard.',
  alternates: { canonical: 'https://www.asnconsulting.co/signup' },
  robots: { index: false, follow: false },
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
