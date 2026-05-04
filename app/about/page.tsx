import type { Metadata } from 'next';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import SectionLabel from '../components/SectionLabel';
import ScrollReveal from '../components/ScrollReveal';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'About ASN Consulting | Status Correction & Sovereignty Experts',
  description:
    'Meet the team behind ASN Consulting — founded in 2022 in Chattanooga, Tennessee. Titus P. Osborne and Jenna D. Scott help Americans correct their status, establish private trusts, and achieve true legal and financial sovereignty.',
};

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="var(--gold)">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const testimonials = [
  {
    initials: 'AG',
    name: 'Andrew Gray',
    location: 'Michigan',
    featured: false,
    quote: "If you're ready to walk in a straight and deliberate line towards freedom, there's really only one person to work with — and you've found him. Consider yourself fortunate.",
  },
  {
    initials: 'JD',
    name: 'Jon Dowling',
    location: 'California',
    featured: true,
    quote: 'Working with Titus was a seamless process — so fast and accurate. I loved having to do very little while he did all the heavy lifting. Highly recommend for expert guidance.',
  },
  {
    initials: 'MA',
    name: 'Mary Ann',
    location: 'Arizona',
    featured: false,
    quote: "Excellent knowledge for people who don't have time to research themselves. This program gets you going quickly — and you can tell when someone has their heart in the right place.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>

        {/* ── 1. Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.breadcrumb}>
              <a href="/">Home</a>
              <span>/</span>
              <span>About</span>
            </div>
            <SectionLabel text="Our Story" centered />
            <h1 className={styles.heroH1}>
              We Help Americans Navigate<br />
              the Seas of <em className={styles.heroGold}>Commerce.</em>
            </h1>
            <p className={styles.heroSub}>
              ASN Consulting was founded in 2022 with a single purpose — to give everyday
              Americans the tools, knowledge, and expert guidance they need to reclaim their
              legal identity, protect their assets, and achieve true financial and personal
              sovereignty.
            </p>
            <div className={styles.heroStats}>
              <div className={styles.heroStat}>
                <div className={styles.heroStatNum}>500+</div>
                <div className={styles.heroStatLabel}>Clients Served</div>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <div className={styles.heroStatNum}>2022</div>
                <div className={styles.heroStatLabel}>Founded</div>
              </div>
              <div className={styles.heroStatDivider} />
              <div className={styles.heroStat}>
                <div className={styles.heroStatNum}>3</div>
                <div className={styles.heroStatLabel}>Expert Services</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Mission ── */}
        <section className={styles.missionSection}>
          <div className={styles.maxW}>
            <div className={styles.missionGrid}>
              <div className={styles.missionLeft}>
                <SectionLabel text="Our Mission" />
                <h2 className={styles.missionH2}>
                  Empowering you to come home to the land jurisdiction
                </h2>
                <p className={styles.bodyText}>
                  Most Americans have no idea they have been misidentified by the system their
                  entire lives — operating as corporate fictions in a sea jurisdiction that was
                  never designed to serve them. At ASN Consulting, we exist to change that.
                </p>
                <p className={styles.bodyText} style={{ marginTop: 16 }}>
                  Our goal is to help you understand how legal and financial systems actually
                  work — and then use that knowledge to correct your status, protect your
                  assets, and operate with confidence in both the public and private domains.
                  This is not rebellion. This is education, lawful process, and reclaimed
                  sovereignty.
                </p>
                <p className={styles.bodyText} style={{ marginTop: 16 }}>
                  Whether you are just beginning to wake up to these realities or you are ready
                  to take decisive action, we meet you where you are. Our team has guided over
                  500 clients through the status correction process, private trust formation,
                  and lawful tax strategies — and we are just getting started.
                </p>
              </div>
              <div className={styles.missionRight}>
                <div className={styles.quoteCard}>
                  <div className={styles.quoteAccent} />
                  <div className={styles.quoteMarks}>&ldquo;</div>
                  <p className={styles.quoteText}>
                    True freedom comes from understanding how legal and financial systems work —
                    and using that knowledge to protect your rights and assets.
                  </p>
                  <div className={styles.quoteAttribution}>— ASN Consulting Mission</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. What Sets Us Apart ── */}
        <ScrollReveal>
          <section className={styles.differSection}>
            <div className={styles.maxW}>
              <div className={styles.sectionHeader}>
                <SectionLabel text="Why ASN" centered />
                <h2 className={styles.sectionH2}>What makes us different</h2>
                <p className={styles.sectionSub}>
                  In a space full of misinformation and half-measures, we do the work correctly —
                  with real expertise, genuine care, and a track record that speaks for itself.
                </p>
              </div>
              <div className={styles.differGrid}>

                <div className={styles.differCard}>
                  <div className={styles.iconBlock}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                      stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </div>
                  <div className={styles.differTitle}>Real Expertise, Not Theory</div>
                  <p className={styles.differBody}>
                    Titus brings 10 years of public and corporate accounting experience to a field
                    that desperately needs financial literacy. We understand the system because we
                    studied it — deeply.
                  </p>
                </div>

                <div className={styles.differCard}>
                  <div className={styles.iconBlock}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                      stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 00-3-3.87" />
                      <path d="M16 3.13a4 4 0 010 7.75" />
                    </svg>
                  </div>
                  <div className={styles.differTitle}>Proven Track Record</div>
                  <p className={styles.differBody}>
                    Over 500 clients served since 2022. We have guided individuals across dozens of
                    states through status correction, private trust formation, and lawful tax strategy
                    — with a process that works.
                  </p>
                </div>

                <div className={styles.differCard}>
                  <div className={styles.iconBlock}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                      stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <polyline points="9 12 11 14 15 10" />
                    </svg>
                  </div>
                  <div className={styles.differTitle}>Done Right the First Time</div>
                  <p className={styles.differBody}>
                    Errors in status correction documents can invalidate your entire package. We
                    obsess over accuracy because we know what is at stake for each client who trusts
                    us with their legal identity.
                  </p>
                </div>

                <div className={styles.differCard}>
                  <div className={styles.iconBlock}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                      stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                    </svg>
                  </div>
                  <div className={styles.differTitle}>Genuinely Mission-Driven</div>
                  <p className={styles.differBody}>
                    We did not build ASN Consulting to sell documents. We built it because we believe
                    every American deserves to understand who they are and what protections are
                    available to them under the law.
                  </p>
                </div>

              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── 4. Meet the Team ── */}
        <ScrollReveal>
          <section className={styles.teamSection}>
            <div className={styles.maxW}>
              <div className={styles.sectionHeader}>
                <SectionLabel text="The Team" centered />
                <h2 className={styles.sectionH2}>The people behind ASN Consulting</h2>
                <p className={styles.sectionSub}>
                  A small, dedicated team with deep expertise and a shared commitment to helping
                  Americans reclaim what is rightfully theirs.
                </p>
              </div>

              <div className={styles.teamGrid}>

                {/* Titus */}
                <div className={styles.teamCard}>
                  <div className={styles.teamCardAccent} />
                  <div className={styles.teamAvatar}>TP</div>
                  <div className={styles.teamName}>Titus P. Osborne</div>
                  <div className={styles.teamTitle}>Founder &amp; Status Correction Specialist</div>
                  <div className={styles.teamRule} />
                  <p className={styles.teamBio}>
                    Titus holds a degree in accounting and spent 10 years in public and corporate
                    accounting before founding ASN Consulting in 2022. That financial foundation
                    gives him a perspective on the system that most in this space simply do not have.
                  </p>
                  <p className={styles.teamBio} style={{ marginTop: 12 }}>
                    A former collegiate golfer and lifelong truth-seeker, Titus always had an innate
                    sense that things were not quite as they seemed. That instinct led him down a path
                    of deep research into common law, legal identity, and the true nature of the
                    commercial system — and eventually to a calling to help others walk the same path.
                  </p>
                  <p className={styles.teamBio} style={{ marginTop: 12 }}>
                    Titus specializes in guiding clients through the status correction and Secured
                    Party Creditor processes — simplifying what most people find overwhelming into a
                    clear, step-by-step journey toward sovereignty.
                  </p>
                  <p className={styles.teamBio} style={{ marginTop: 12 }}>
                    His approach is rooted in education first. He believes that true freedom is not
                    just about the documents — it is about understanding what those documents mean
                    and why they matter.
                  </p>
                  <hr className={styles.teamDivider} />
                  <div className={styles.teamCTAs}>
                    <a href="/services" className={styles.primaryBtn}>Book a Call with Titus</a>
                    <a href="/done-for-you-services" className={styles.outlineBtn}>DFY Status Correction</a>
                  </div>
                </div>

                {/* Jenna */}
                <div className={styles.teamCard}>
                  <div className={styles.teamCardAccent} />
                  <div className={styles.teamAvatar}>JD</div>
                  <div className={styles.teamName}>Jenna D. Scott</div>
                  <div className={styles.teamTitle}>Partner &amp; Trust Specialist</div>
                  <div className={styles.teamRule} />
                  <p className={styles.teamBio}>
                    Jenna discovered her passion for preserving family legacies during the lockdowns
                    of 2020 — and the overflow of uncertainty that followed in 2021. What began as
                    personal research became an unwavering commitment to what she describes as an
                    ancient calling: ensuring that families have access to proper estate planning and
                    asset protection.
                  </p>
                  <p className={styles.teamBio} style={{ marginTop: 12 }}>
                    Her focus is on Private Irrevocable Express Trusts and lawful money redemption —
                    helping clients structure their assets in a way that operates entirely outside
                    the statutory commercial system and protects what they have built for the next
                    generation.
                  </p>
                  <p className={styles.teamBio} style={{ marginTop: 12 }}>
                    Outside of client work, Jenna practices Bikram yoga — which she credits with
                    cultivating the steady determination and resourcefulness her work demands. She is
                    also a stubborn advocate for the conservation and preservation of natural spaces,
                    driven by a belief that we are stewards for our posterity.
                  </p>
                  <p className={styles.teamBio} style={{ marginTop: 12 }}>
                    Securing property — land and other assets — one family at a time is her means
                    of making that vision real.
                  </p>
                  <hr className={styles.teamDivider} />
                  <div className={styles.teamCTAs}>
                    <a href="/services" className={styles.primaryBtn}>Book a Call with Jenna</a>
                    <a href="/private-trusts" className={styles.outlineBtn}>Private Trusts</a>
                  </div>
                </div>

              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── 5. Values ── */}
        <ScrollReveal>
          <section className={styles.valuesSection}>
            <div className={styles.maxW}>
              <div className={styles.sectionHeader}>
                <SectionLabel text="What We Believe" centered />
                <h2 className={styles.sectionH2}>The principles we operate by</h2>
              </div>
              <div className={styles.valuesGrid}>

                <div className={styles.valueItem}>
                  <div className={styles.valueBar} />
                  <div className={styles.valueTitle}>Education Over Sales</div>
                  <p className={styles.valueBody}>
                    We will never push you into a service you do not need. Our first obligation is
                    to make sure you understand your situation, your options, and your rights — then
                    let you decide how you want to proceed.
                  </p>
                </div>

                <div className={styles.valueItem}>
                  <div className={styles.valueBar} />
                  <div className={styles.valueTitle}>Precision Over Speed</div>
                  <p className={styles.valueBody}>
                    Status correction documents must be right. Private trusts must be properly
                    formed. We take the time to do the work correctly because the cost of getting
                    it wrong falls on you — and that is not acceptable to us.
                  </p>
                </div>

                <div className={styles.valueItem}>
                  <div className={styles.valueBar} />
                  <div className={styles.valueTitle}>Sovereignty Is For Everyone</div>
                  <p className={styles.valueBody}>
                    This is not just for the wealthy, the politically connected, or those already
                    deep in the movement. Any American who wants to understand their true legal
                    standing and protect what they have built deserves access to this knowledge.
                  </p>
                </div>

              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── 6. Social Proof ── */}
        <ScrollReveal>
          <section className={styles.proofSection}>
            <div className={styles.maxW}>
              <div className={styles.testimonialsGrid}>
                {testimonials.map(t => (
                  <div
                    key={t.initials}
                    className={`${styles.testimonialCard} ${t.featured ? styles.testimonialFeatured : ''}`}
                  >
                    <div className={styles.tStars}>
                      {Array.from({ length: 5 }).map((_, i) => <StarIcon key={i} />)}
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
              <div className={styles.proofMore}>
                <a href="/faqs" className={styles.proofMoreLink}>Read more client stories →</a>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ── 7. Location & Contact ── */}
        <section className={styles.locationSection}>
          <div className={styles.maxW}>
            <div className={styles.locationInner}>
              <div className={styles.locationLeft}>
                <div className={styles.locationLabel}>Based In</div>
                <div className={styles.locationCity}>Chattanooga, Tennessee</div>
                <a href="mailto:support@asnconsulting.co" className={styles.locationEmail}>
                  support@asnconsulting.co
                </a>
              </div>

              <div className={styles.locationSocial}>
                <a
                  href="https://www.instagram.com/asndocuments/"
                  className={styles.socialLink}
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/asndocuments/"
                  className={styles.socialLink}
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/user/Wix"
                  className={styles.socialLink}
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.54C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
                    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" />
                  </svg>
                </a>
              </div>

              <a href="/services" className={styles.primaryBtn}>Book a Free Strategy Call</a>
            </div>
          </div>
        </section>

        {/* ── 8. Final CTA Banner ── */}
        <section className={styles.ctaBanner}>
          <div className={styles.ctaBannerInner}>
            <div className={styles.ctaLeft}>
              <div className={styles.ctaLabel}>Ready to Get Started?</div>
              <h3 className={styles.ctaH3}>
                Take the first step toward reclaiming your sovereignty
              </h3>
              <p className={styles.ctaDesc}>
                Whether you are just learning about status correction or ready to move forward
                today, our team is here to guide you.
              </p>
            </div>
            <div className={styles.ctaRight}>
              <a href="/services" className={styles.primaryBtn}>Book a Free Strategy Call</a>
              <a href="/done-for-you-services" className={styles.outlineBtn}>View Our Services</a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
