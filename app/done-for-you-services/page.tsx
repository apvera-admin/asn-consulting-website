import type { Metadata } from 'next';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import SectionLabel from '../components/SectionLabel';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Done For You Status Correction | ASN Consulting',
  description:
    'Our white-glove status correction service — every document prepared, filed, and recorded by an expert. You provide the information, we do the rest.',
};

const included = [
  'Deed of Reconveyance Document',
  'Act of Expatriation for each legal name (3 documents)',
  'Cancellation of all prior Powers of Attorney',
  'Declaration of Political Status',
  'Declaration of Political Status Letter to Secretary of State',
  'Certificate of Assumed Name',
  'Mandatory Notice — Foreign Sovereign Immunities Act',
  'Paramount Claim of Life',
  '2 Witness Testimonies',
  'Revocation of Election to Pay Taxes Cover Letters (NY & DC)',
  'Voter Registration Cancellation Letter',
  'Common Carry Declaration',
  'UCC-1 Financing Statement preparation',
  'Notarization guidance and step-by-step instructions',
  'Public record filing instructions by jurisdiction',
  'Certified mail templates for all required notices',
  'Ongoing support through the full process',
];

const steps = [
  {
    num: '01',
    title: 'Intake & Discovery',
    time: 'Day 1–2',
    desc: 'You complete our intake form with your legal names and relevant information. No guesswork — we tell you exactly what we need.',
  },
  {
    num: '02',
    title: 'Document Preparation',
    time: 'Day 3–5',
    desc: 'Our team prepares your complete document package — properly formatted, reviewed, and ready for your signature.',
  },
  {
    num: '03',
    title: 'Notarization',
    time: 'Day 6–8',
    desc: 'We walk you through notarization step by step. You execute the documents correctly the first time — no costly errors.',
  },
  {
    num: '04',
    title: 'Recording & Filing',
    time: 'Day 9–12',
    desc: 'Your documents are filed on the public record. We provide exact filing instructions for your county and jurisdiction.',
  },
  {
    num: '05',
    title: 'Notice & Completion',
    time: 'Day 13–16',
    desc: 'Certified mail templates sent to all appropriate parties. Your status correction is officially on the record.',
  },
];

const faqs = [
  {
    q: 'How long does the full process take?',
    a: 'Most clients complete their status correction within 14–21 days from intake. The timeline depends on how quickly documents are notarized and filed in your jurisdiction.',
  },
  {
    q: 'What do I actually have to do myself?',
    a: 'You fill out the intake form, sign and notarize your documents, and mail the certified letters. We prepare everything, review everything, and guide you through every step.',
  },
  {
    q: 'Is this legal?',
    a: 'Yes. Status correction is a lawful process grounded in established common law and UCC principles. We do not advise you to avoid any lawful obligation — we help you establish your correct legal standing.',
  },
  {
    q: 'Do I need a lawyer?',
    a: 'No. This is not a legal service and we are not attorneys. We are document preparation specialists. The process does not require legal representation.',
  },
  {
    q: 'What if I have multiple legal names?',
    a: 'We prepare documents for each name variation — this is why the Act of Expatriation covers up to 3 documents by default. Additional names can be accommodated.',
  },
  {
    q: 'What happens after I complete the process?',
    a: 'You will have your complete document package on the public record. We are available for follow-up questions and can assist with next steps such as Private Trusts or UCC filings.',
  },
];

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

export default function DFYPage() {
  return (
    <>
      <Nav />
      <main>

        {/* ── Page Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroBreadcrumb}>
              <a href="/">Home</a>
              <span>/</span>
              <span>Done For You</span>
            </div>
            <SectionLabel text="White Glove Service" />
            <h1 className={styles.heroH1}>
              We Handle Everything.<br />
              <em className={styles.heroGold}>You Just Sign.</em>
            </h1>
            <p className={styles.heroSub}>
              Our most popular service. Every document prepared, reviewed, and filed by an expert —
              so you complete your status correction correctly the first time.
            </p>
            <div className={styles.heroCTAs}>
              <a href="/services" className={styles.primaryBtn}>
                Book a Discovery Call
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>
              <a href="#whats-included" className={styles.outlineBtn}>See What&apos;s Included</a>
            </div>

            {/* Trust badges */}
            <div className={styles.badges}>
              <div className={styles.badge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
                <span>500+ Clients Served</span>
              </div>
              <div className={styles.badge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span>14–21 Day Process</span>
              </div>
              <div className={styles.badge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                  <path d="M16 3.13a4 4 0 010 7.75"/>
                </svg>
                <span>Expert-Led, Start to Finish</span>
              </div>
            </div>
          </div>

          {/* Side card */}
          <div className={styles.heroCard}>
            <div className={styles.heroCardLabel}>Done For You</div>
            <div className={styles.heroCardTitle}>DFY Status Correction</div>
            <div className={styles.heroCardPrice}>
              <span className={styles.priceNote}>Custom pricing — book a call to discuss</span>
            </div>
            <div className={styles.heroCardDivider} />
            <ul className={styles.heroCardFeatures}>
              {['Complete document preparation', 'Expert review & oversight', 'Notarization guidance', 'Filing & recording support', 'Certified mail templates', 'Post-completion support'].map(f => (
                <li key={f} className={styles.heroCardFeature}>
                  <CheckIcon />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <a href="/services" className={styles.heroCardBtn}>
              Get Started — Book a Call
            </a>
            <p className={styles.heroCardNote}>Free 20-minute discovery call. No commitment required.</p>
          </div>
        </section>

        {/* ── Problem / Why DFY ── */}
        <section className={styles.whySection}>
          <div className={styles.maxW}>
            <div className={styles.whyGrid}>
              <div>
                <SectionLabel text="The Problem" />
                <h2 className={styles.sectionH2}>
                  Going it alone is expensive — when you get it wrong
                </h2>
                <p className={styles.bodyText}>
                  Status correction documents must be executed precisely. A single error — a wrong
                  name format, a missed notarization step, an incorrect filing — can invalidate your
                  entire package and require you to start over.
                </p>
                <p className={styles.bodyText} style={{ marginTop: 14 }}>
                  Most people who struggle through the DIY process end up spending more time,
                  more money, and more frustration than if they had hired an expert from the start.
                </p>
              </div>
              <div className={styles.whyRight}>
                <div className={styles.whyCard}>
                  <div className={styles.whyCardIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <polyline points="9 12 11 14 15 10"/>
                    </svg>
                  </div>
                  <div className={styles.whyCardTitle}>Done Right, First Time</div>
                  <p className={styles.whyCardDesc}>
                    Every document reviewed before it leaves our hands. No rework, no do-overs.
                  </p>
                </div>
                <div className={styles.whyCard}>
                  <div className={styles.whyCardIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <div className={styles.whyCardTitle}>Save Months of Research</div>
                  <p className={styles.whyCardDesc}>
                    We have done this hundreds of times. You get years of experience on your side.
                  </p>
                </div>
                <div className={styles.whyCard}>
                  <div className={styles.whyCardIcon}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                      stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div className={styles.whyCardTitle}>Personal Guidance</div>
                  <p className={styles.whyCardDesc}>
                    You are not handed a template and left alone. We walk with you through every step.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── What's Included ── */}
        <section className={styles.includedSection} id="whats-included">
          <div className={styles.maxW}>
            <div className={styles.sectionHeader}>
              <SectionLabel text="Full Package" centered />
              <h2 className={styles.sectionH2Centered}>Everything included in your DFY package</h2>
              <p className={styles.sectionSubCentered}>
                Every document you need to establish your status as an American State National,
                prepared and guided by an expert.
              </p>
            </div>
            <div className={styles.includedGrid}>
              {included.map(item => (
                <div key={item} className={styles.includedItem}>
                  <div className={styles.includedCheck}><CheckIcon /></div>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Process / Timeline ── */}
        <section className={styles.processSection}>
          <div className={styles.maxW}>
            <div className={styles.sectionHeader}>
              <SectionLabel text="The Process" centered />
              <h2 className={styles.sectionH2Centered}>What happens after you book</h2>
            </div>
            <div className={styles.timeline}>
              {steps.map((step, i) => (
                <div key={step.num} className={styles.timelineItem}>
                  <div className={styles.timelineLeft}>
                    <div className={styles.timelineNum}>{step.num}</div>
                    {i < steps.length - 1 && <div className={styles.timelineLine} />}
                  </div>
                  <div className={styles.timelineContent}>
                    <div className={styles.timelineTime}>{step.time}</div>
                    <div className={styles.timelineTitle}>{step.title}</div>
                    <p className={styles.timelineDesc}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Testimonials ── */}
        <section className={styles.testimonialsSection}>
          <div className={styles.maxW}>
            <div className={styles.sectionHeader}>
              <SectionLabel text="Client Stories" centered />
              <h2 className={styles.sectionH2Centered}>What our DFY clients say</h2>
            </div>
            <div className={styles.testimonialsGrid}>
              {[
                { initials: 'AG', name: 'Andrew Gray', location: 'Michigan', quote: "If you're ready to walk in a straight and deliberate line towards freedom, there's really only one person to work with — and you've found him. Consider yourself fortunate." },
                { initials: 'JD', name: 'Jon Dowling', location: 'California', quote: 'Working with Titus was a seamless process — so fast and accurate. I loved having to do very little while he did all the heavy lifting. Highly recommend for expert guidance.' },
                { initials: 'MA', name: 'Mary Ann', location: 'Arizona', quote: "Excellent knowledge for people who don't have time to research themselves. This program gets you going quickly — and you can tell when someone has their heart in the right place." },
              ].map(t => (
                <div key={t.initials} className={styles.testimonialCard}>
                  <div className={styles.tStars}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="var(--gold)">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                    ))}
                  </div>
                  <p className={styles.tQuote}>&ldquo;{t.quote}&rdquo;</p>
                  <div className={styles.tAuthor}>
                    <div className={styles.tAvatar}>{t.initials}</div>
                    <div>
                      <div className={styles.tName}>{t.name}</div>
                      <div className={styles.tLocation}>{t.location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className={styles.faqSection}>
          <div className={styles.maxW}>
            <div className={styles.sectionHeader}>
              <SectionLabel text="Common Questions" centered />
              <h2 className={styles.sectionH2Centered}>Frequently asked questions</h2>
            </div>
            <div className={styles.faqGrid}>
              {faqs.map(faq => (
                <div key={faq.q} className={styles.faqItem}>
                  <div className={styles.faqQ}>{faq.q}</div>
                  <p className={styles.faqA}>{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ── */}
        <section className={styles.finalCTA}>
          <div className={styles.maxW}>
            <div className={styles.finalCTAInner}>
              <SectionLabel text="Get Started" centered />
              <h2 className={styles.finalCTAH2}>
                Ready to correct your status<br />
                <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>with expert guidance?</em>
              </h2>
              <p className={styles.finalCTASub}>
                Book a free 20-minute discovery call. We will review your situation,
                answer your questions, and tell you exactly what your process looks like.
              </p>
              <a href="/services" className={styles.primaryBtn} style={{ marginTop: 8 }}>
                Book Your Free Discovery Call
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="5" y1="12" x2="19" y2="12"/>
                  <polyline points="12 5 19 12 12 19"/>
                </svg>
              </a>
              <p className={styles.finalCTANote}>No obligation. No pressure. Just answers.</p>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
