import type { Metadata } from 'next';
import Nav from './components/Nav';

export const metadata: Metadata = {
  title: 'American State National Status Correction Services',
  description: 'ASN Consulting guides Americans through the complete status correction process. Reclaim your national standing, revoke your election, and establish true financial sovereignty. DFY and DIY options available.',
  alternates: { canonical: 'https://www.asnconsulting.co' },
};
import Hero from './components/Hero';
import StatsBar from './components/StatsBar';
import Services from './components/Services';
import HowItWorks from './components/HowItWorks';
import Testimonials from './components/Testimonials';
import EmailCTA from './components/EmailCTA';
import Footer from './components/Footer';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <StatsBar />
        <Services />
        <HowItWorks />
        <Testimonials />
        <EmailCTA />
      </main>
      <Footer />
    </>
  );
}
