import Nav from './components/Nav';
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
