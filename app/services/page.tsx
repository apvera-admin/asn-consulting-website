import type { Metadata } from 'next';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import SectionLabel from '../components/SectionLabel';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Book a Consultation | ASN Consulting',
  description:
    'Schedule a strategy call with Titus or Jenna. Free discovery calls and paid consulting sessions available for status correction, private trusts, and tax remedy.',
};

const titusCards = [
  {
    badge: 'Free',
    title: 'Status Correction Strategy Call',
    description:
      'A complimentary introductory call to discuss your situation, learn about the status correction process, and find out if our services are the right fit for you.',
    duration: '15 min',
    price: 'Free',
    link: 'https://cal.com/titus-osborne-glolma/status-correction-call',
  },
  {
    badge: 'Paid',
    title: 'Educational Consulting',
    description:
      'A deep-dive session with Titus covering the legal foundations of status correction, sovereignty principles, and how to apply them to your specific circumstances.',
    duration: '30 min',
    price: '$75',
    link: 'https://cal.com/titus-osborne-glolma/educational-consulting',
  },
];

const jennaCards = [
  {
    badge: 'Free',
    title: 'Tax Discovery Call',
    description:
      'A complimentary call with Jenna to assess your tax situation, review your eligibility for our tax remedy programs, and answer your initial questions.',
    duration: '20 min',
    price: 'Free',
    link: 'https://cal.com/asn-consulting/tax-discovery',
  },
  {
    badge: 'Paid',
    title: '1 hr Private Trust &/or Tax Consult Call',
    description:
      'A comprehensive one-hour session covering private trust formation, lawful money redemption, tax strategy, or any combination of these topics.',
    duration: '60 min',
    price: '$350',
    link: 'https://cal.com/asn-consulting/trust-tax-consult',
  },
  {
    badge: 'Paid',
    title: 'Email — 1 hr Additional Support Q&A',
    description:
      'Continued email-based support for existing clients. Submit your questions and receive a detailed written response with references and next steps.',
    duration: '1 hr support',
    price: '$295',
    link: 'https://cal.com/asn-consulting/email-support-1hr',
  },
  {
    badge: 'Paid',
    title: 'Email — 30 min Quick Questions',
    description:
      'A focused email exchange for quick clarifications, follow-up questions, or brief guidance on a specific topic — without booking a full call.',
    duration: '30 min support',
    price: '$195',
    link: 'https://cal.com/asn-consulting/email-quick',
  },
];

const steps = [
  {
    num: '01',
    title: 'Choose Your Consultant',
    desc: 'Select Titus for status correction guidance or Jenna for tax and trust consulting.',
  },
  {
    num: '02',
    title: 'Pick Your Session',
    desc: 'Start with a free discovery call, or book a paid session if you already know what you need.',
  },
  {
    num: '03',
    title: 'Book Online',
    desc: 'Select a date and time that works for you. You\'ll receive a confirmation and calendar invite immediately.',
  },
  {
    num: '04',
    title: 'Show Up Ready',
    desc: 'Bring any documents, questions, or background that will help us make the most of your time together.',
  },
];

const faqs = [
  {
    q: 'What is the difference between Titus and Jenna?',
    a: 'Titus specializes in status correction — the legal process of correcting your political standing. Jenna focuses on private trusts and lawful tax remedy strategies.',
  },
  {
    q: 'Do I need to book a free call first?',
    a: 'We strongly recommend starting with a free discovery call if you are new to our services. It helps us understand your situation and point you in the right direction.',
  },
  {
    q: 'What happens if I need to reschedule?',
    a: 'You can reschedule or cancel up to 24 hours before your session through the confirmation email you receive after booking.',
  },
  {
    q: 'Are paid sessions refundable?',
    a: 'Paid sessions are non-refundable if cancelled within 24 hours of the call. Rescheduling is always available outside of that window.',
  },
];

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main>

        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <SectionLabel text="Consultations" centered />
            <h1 className={styles.heroH1}>
              Book a Call With<br />
              <em className={styles.heroEm}>Our Team.</em>
            </h1>
            <p className={styles.heroSub}>
              Whether you are just getting started or ready to take the next step, our consultants
              are here to guide you through every part of your sovereignty journey.
            </p>
            <div className={styles.trustBadges}>
              <span className={styles.badge}>Free Discovery Calls Available</span>
              <span className={styles.badgeDot} />
              <span className={styles.badge}>No Obligation</span>
              <span className={styles.badgeDot} />
              <span className={styles.badge}>Secure Booking</span>
            </div>
          </div>
        </section>

        {/* ── Titus Section ── */}
        <section className={styles.consultantSection} data-bg="secondary">
          <div className={styles.consultantInner}>
            <div className={styles.consultantHeader}>
              <div className={styles.avatarRing}>
                <div className={styles.avatarInitials}>TP</div>
              </div>
              <div className={styles.consultantInfo}>
                <div className={styles.consultantName}>Titus P. Osborne</div>
                <div className={styles.consultantRole}>Status Correction Specialist</div>
                <p className={styles.consultantBio}>
                  Titus has guided hundreds of Americans through the process of correcting their
                  political status and reclaiming their sovereignty. He specializes in foundational
                  law, status correction paperwork, and the legal principles that underpin every
                  ASN program.
                </p>
              </div>
            </div>
            <div className={styles.cardsGrid}>
              {titusCards.map((card) => (
                <div key={card.title} className={styles.bookingCard}>
                  <div className={styles.cardLeft}>
                    <span
                      className={styles.cardBadge}
                      data-type={card.badge === 'Free' ? 'free' : 'paid'}
                    >
                      {card.badge}
                    </span>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardDesc}>{card.description}</p>
                  </div>
                  <div className={styles.cardRight}>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardDuration}>{card.duration}</span>
                      <span className={styles.cardPrice}>{card.price}</span>
                    </div>
                    <a href={card.link} className={styles.bookBtn} target="_blank" rel="noopener noreferrer">
                      Book Now →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Jenna Section ── */}
        <section className={styles.consultantSection} data-bg="primary">
          <div className={styles.consultantInner}>
            <div className={styles.consultantHeader}>
              <div className={styles.avatarRing} data-consultant="jenna">
                <div className={styles.avatarInitials}>JD</div>
              </div>
              <div className={styles.consultantInfo}>
                <div className={styles.consultantName}>Jenna D. Scott</div>
                <div className={styles.consultantRole}>Private Trust &amp; Tax Consultant</div>
                <p className={styles.consultantBio}>
                  Jenna is ASN Consulting&apos;s lead expert on private trusts and lawful tax strategies.
                  She helps clients understand their rights regarding income tax, guides them through
                  lawful money redemption, and assists with the formation and management of private
                  trust structures.
                </p>
              </div>
            </div>
            <div className={styles.cardsGrid}>
              {jennaCards.map((card) => (
                <div key={card.title} className={styles.bookingCard}>
                  <div className={styles.cardLeft}>
                    <span
                      className={styles.cardBadge}
                      data-type={card.badge === 'Free' ? 'free' : 'paid'}
                    >
                      {card.badge}
                    </span>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    <p className={styles.cardDesc}>{card.description}</p>
                  </div>
                  <div className={styles.cardRight}>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardDuration}>{card.duration}</span>
                      <span className={styles.cardPrice}>{card.price}</span>
                    </div>
                    <a href={card.link} className={styles.bookBtn} target="_blank" rel="noopener noreferrer">
                      Book Now →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Not Sure Strip ── */}
        <div className={styles.notSureStrip}>
          <div className={styles.notSureInner}>
            <span className={styles.notSureText}>Not sure where to start?</span>
            <a
              href="https://cal.com/asn-consulting/status-correction-strategy"
              className={styles.notSureLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              Book a free 15-minute strategy call →
            </a>
          </div>
        </div>

        {/* ── How It Works ── */}
        <section className={styles.howSection}>
          <div className={styles.howInner}>
            <div className={styles.howHeader}>
              <SectionLabel text="The Process" centered />
              <h2 className={styles.howH2}>How It Works</h2>
            </div>
            <div className={styles.stepsGrid}>
              {steps.map((step, i) => (
                <div key={step.num} className={styles.step}>
                  <div className={styles.stepTop}>
                    <div className={styles.stepNum}>{step.num}</div>
                    {i < steps.length - 1 && <div className={styles.stepLine} />}
                  </div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className={styles.faqSection}>
          <div className={styles.faqInner}>
            <div className={styles.faqHeader}>
              <SectionLabel text="Questions" centered />
              <h2 className={styles.faqH2}>Frequently Asked Questions</h2>
            </div>
            <div className={styles.faqGrid}>
              {faqs.map((faq) => (
                <div key={faq.q} className={styles.faqItem}>
                  <h4 className={styles.faqQ}>{faq.q}</h4>
                  <p className={styles.faqA}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Banner ── */}
        <section className={styles.ctaBanner}>
          <div className={styles.ctaInner}>
            <div className={styles.ctaLeft}>
              <div className={styles.ctaLabel}>Ready to begin?</div>
              <h3 className={styles.ctaH3}>Your path to sovereignty starts with a single call</h3>
            </div>
            <div className={styles.ctaRight}>
              <a
                href="https://cal.com/asn-consulting/status-correction-strategy"
                className={styles.primaryBtn}
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Free Call
              </a>
              <a href="/done-for-you-services" className={styles.outlineBtn}>
                View All Services
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
