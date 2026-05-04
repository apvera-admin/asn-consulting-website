import type { Metadata } from 'next';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import SectionLabel from '../components/SectionLabel';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Private Irrevocable Express Trusts | ASN Consulting',
  description:
    'Establish a Private Irrevocable Express Trust under common law. Protect your assets, avoid probate, and operate outside the statutory commercial system. Schedule a call with our Trust Expert, Jenna.',
};

// ── Inline SVG atoms ──────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

// ── Data ─────────────────────────────────────────────────────────────────────

const assetCards = [
  {
    title: 'Real Property',
    desc: 'Your home, land, rental properties, and any real estate holdings.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    title: 'Vehicles',
    desc: 'Automobiles, boats, RVs, motorcycles, and other titled vehicles.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    title: 'Financial Accounts',
    desc: 'Bank accounts, investment accounts, and other monetary assets.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
  },
  {
    title: 'Business Interests',
    desc: 'Ownership stakes, business assets, intellectual property, and contracts.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </svg>
    ),
  },
  {
    title: 'Family Inheritance',
    desc: 'Assets designated for your heirs — bypassing probate entirely.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    title: 'Personal Property',
    desc: 'Jewelry, collectibles, artwork, and other valuables.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
      </svg>
    ),
  },
];

const benefits = [
  {
    title: 'Creditor Protection',
    body: 'Because you do not hold legal title to trust assets, personal judgment liens and creditors cannot attach to them. What is not yours cannot be taken from you.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: 'Avoids Probate',
    body: 'Trust assets pass directly to your Beneficiaries without going through the probate court system — privately, quickly, and without the costs of estate administration.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      </svg>
    ),
  },
  {
    title: 'Privacy',
    body: 'A Private Irrevocable Express Trust is not registered with any government agency and does not appear in public records. Your asset ownership remains private.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </svg>
    ),
  },
  {
    title: 'Tax Advantages',
    body: 'Properly structured trusts can reduce or eliminate certain tax liabilities. The trust operates outside the commercial system that creates many tax obligations in the first place.',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
        stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="23" y1="6" x2="11" y2="18" />
        <path d="M23 6H16V13" />
        <line x1="1" y1="18" x2="6" y2="13" />
        <path d="M1 18H8V11" />
      </svg>
    ),
  },
];

const misconceptions = [
  {
    myth: 'A private trust is just a living trust or revocable trust.',
    truth: 'A revocable living trust offers almost no asset protection because the Grantor retains control and can dissolve it. A Private Irrevocable Express Trust is fundamentally different — once established, the terms are fixed and the protection is real.',
  },
  {
    myth: 'I will lose control of my assets.',
    truth: 'The Trustee — who can be someone you designate and trust — manages the assets according to the trust agreement, which you help craft. You retain the benefit of the assets while the trust holds legal title.',
  },
  {
    myth: 'This is a tax shelter scheme or illegal.',
    truth: 'Private Irrevocable Express Trusts have existed in common law for centuries. When properly established, they are entirely lawful. They are not tax evasion — they are lawful structuring of ownership.',
  },
  {
    myth: 'This only matters for wealthy people.',
    truth: 'Anyone with a home, a vehicle, a bank account, or a family to protect can benefit from a trust. The cost of not protecting your assets often far exceeds the cost of establishing a trust.',
  },
];

const faqs = [
  {
    q: 'How is this different from a living trust or family trust?',
    a: 'Most living trusts and family trusts are statutory — created under state law, subject to probate, and visible to the commercial court system. A Private Irrevocable Express Trust operates under common law and is not registered with any government agency, which is what gives it its protective properties.',
  },
  {
    q: 'Do I need to have completed status correction first?',
    a: 'Status correction is not a prerequisite for establishing a trust, but many clients do both together. A trust can hold assets for any Grantor — your status correction and your trust work together to give you a more complete picture of sovereignty.',
  },
  {
    q: 'Can a trust own my home?',
    a: 'Yes. Real property is one of the most common assets placed into a Private Irrevocable Express Trust. The deed is retitled into the trust\'s name, which removes it from your personal estate and protects it from judgment liens and probate.',
  },
  {
    q: 'How long does it take to establish a trust?',
    a: 'Once we have your information and your goals are clear, most trust formations are completed within 2–4 weeks. The timeline depends on the complexity of your assets and how quickly documents are signed and executed.',
  },
  {
    q: 'Is this the same as an offshore trust?',
    a: 'No. This is a domestic, common-law trust established in the land jurisdiction of this country — not in a foreign jurisdiction. It is based on centuries of established common law, not offshore tax strategy.',
  },
  {
    q: "What does Jenna's consultation include?",
    a: "Your initial call with Jenna is a discovery conversation. She will learn about your assets, your goals, and your family situation — then explain exactly what kind of trust structure makes sense for you and what the process looks like. There is no obligation to proceed.",
  },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function PrivateTrustsPage() {
  return (
    <>
      <Nav />
      <main>

        {/* ── 1. Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroLeft}>
            <div className={styles.breadcrumb}>
              <a href="/">Home</a>
              <span>/</span>
              <a href="/services">Services</a>
              <span>/</span>
              <span>Private Trusts</span>
            </div>
            <SectionLabel text="Asset Protection" />
            <h1 className={styles.heroH1}>
              Protect What&apos;s Yours Under<br />
              <em className={styles.heroGold}>Common Law.</em>
            </h1>
            <p className={styles.heroSub}>
              A Private Irrevocable Express Trust is one of the most powerful tools available
              for protecting your assets, your family, and your estate — operating entirely
              outside the statutory commercial system.
            </p>
            <div className={styles.heroCTAs}>
              <a href="/services" className={styles.primaryBtn}>Schedule a Call with Jenna</a>
              <a href="#how-it-works" className={styles.outlineBtn}>Learn How It Works</a>
            </div>
            <div className={styles.badges}>
              <div className={styles.badge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <span>Common Law Based</span>
              </div>
              <div className={styles.badge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M12 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <line x1="9" y1="15" x2="15" y2="9" />
                  <path d="M15 9h-4m4 0v4" />
                </svg>
                <span>Not a Statutory Trust</span>
              </div>
              <div className={styles.badge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <span>Immediate Asset Protection</span>
              </div>
            </div>
          </div>

          {/* Decorative rings */}
          <div className={styles.heroRight}>
            <div className={styles.ringsWrap}>
              {/* Outer dashed ring */}
              <svg className={styles.ringOuter} width="280" height="280" viewBox="0 0 280 280" fill="none">
                <circle cx="140" cy="140" r="136" stroke="rgba(200,150,60,0.08)"
                  strokeWidth="1" strokeDasharray="6 5" />
              </svg>
              {/* Middle ring */}
              <svg className={styles.ringMiddle} width="210" height="210" viewBox="0 0 210 210" fill="none">
                <circle cx="105" cy="105" r="101" stroke="rgba(200,150,60,0.12)"
                  strokeWidth="1" strokeDasharray="4 6" />
              </svg>
              {/* Inner circle */}
              <div className={styles.ringInner}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none"
                  stroke="rgba(200,150,60,0.45)" strokeWidth="1" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. What Is a Private Trust ── */}
        <section className={styles.whatSection}>
          <div className={styles.maxW}>
            <SectionLabel text="The Foundation" />
            <h2 className={styles.whatH2}>What is a Private Irrevocable Express Trust?</h2>
            <div className={styles.whatGrid}>
              <div className={styles.whatLeft}>
                <p className={styles.bodyText}>
                  A Private Irrevocable Express Trust is a common-law arrangement in which a
                  Grantor transfers legal title of assets to a Trustee, who holds and manages
                  those assets for the benefit of named Beneficiaries. Once established, the
                  trust is irrevocable — meaning the terms cannot be altered — which is
                  precisely what gives it its protective power.
                </p>
                <p className={styles.bodyText}>
                  Unlike statutory trusts created under state law, a Private Irrevocable
                  Express Trust operates in the land jurisdiction under the common law of
                  the people — not in the sea jurisdiction of the Uniform Commercial Code
                  or statutory commercial law. It is not registered with any government
                  agency. It is not subject to probate. It is not a corporate fiction.
                </p>
                <p className={styles.bodyText}>
                  The trust itself becomes the lawful owner of the assets placed within it.
                  Because you no longer hold legal title to those assets, they are shielded
                  from judgment liens, creditors, and the probate process — while still being
                  managed for your benefit and the benefit of your family.
                </p>
              </div>
              <div className={styles.whatRight}>
                <div className={styles.callout}>
                  <div className={styles.calloutLabel}>Key Distinction</div>
                  <h3 className={styles.calloutH3}>Common Law vs. Statutory</h3>

                  <div className={styles.comparisonRow}>
                    <div className={styles.compPill} data-type="statutory">Statutory Trust</div>
                    <p className={styles.compDesc} data-type="statutory">
                      Created under state statute. Registered with government. Subject to UCC
                      commercial law. Visible to courts and creditors.
                    </p>
                  </div>

                  <div className={styles.calloutDivider} />

                  <div className={styles.comparisonRow}>
                    <div className={styles.compPill} data-type="common">Common Law Trust</div>
                    <p className={styles.compDesc} data-type="common">
                      Created under the common law of the land. No government registration.
                      Outside the sea jurisdiction. Private and non-statutory.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. How It Works ── */}
        <section className={styles.howSection} id="how-it-works">
          <div className={styles.maxW}>
            <div className={styles.sectionHeader}>
              <SectionLabel text="The Structure" centered />
              <h2 className={styles.sectionH2}>How a Private Express Trust is structured</h2>
            </div>

            <div className={styles.rolesGrid}>

              <div className={styles.roleCard}>
                <div className={styles.iconBlock}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div className={styles.roleLabel}>The Grantor</div>
                <p className={styles.roleDesc}>
                  The individual who creates the trust and transfers assets into it. Once the
                  transfer is made, the Grantor no longer holds legal title — the trust does.
                  This separation is the source of the protection.
                </p>
                <p className={styles.roleNote}>Also called the Settlor or Trustor.</p>
              </div>

              <div className={styles.roleCard}>
                <div className={styles.iconBlock}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className={styles.roleLabel}>The Trustee</div>
                <p className={styles.roleDesc}>
                  The individual or entity that holds legal title to the trust assets and
                  manages them according to the trust agreement. The Trustee has a fiduciary
                  duty to the Beneficiaries and must act in their best interests at all times.
                </p>
                <p className={styles.roleNote}>The Grantor may serve as Trustee in certain structures.</p>
              </div>

              <div className={styles.roleCard}>
                <div className={styles.iconBlock}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 00-3-3.87" />
                    <path d="M16 3.13a4 4 0 010 7.75" />
                  </svg>
                </div>
                <div className={styles.roleLabel}>The Beneficiary</div>
                <p className={styles.roleDesc}>
                  The person or persons for whose benefit the trust is managed. Beneficiaries
                  receive the use and enjoyment of trust assets without holding legal title —
                  keeping those assets beyond the reach of personal creditors.
                </p>
                <p className={styles.roleNote}>Can include family members, heirs, or other designated parties.</p>
              </div>

            </div>

            {/* Flow diagram */}
            <div className={styles.flowDiagram}>
              <span className={styles.flowNode}>Grantor transfers assets</span>
              <ArrowRight />
              <span className={styles.flowNode}>Trust holds title</span>
              <ArrowRight />
              <span className={styles.flowNode}>Trustee manages</span>
              <ArrowRight />
              <span className={styles.flowNode}>Beneficiaries receive benefit</span>
            </div>
          </div>
        </section>

        {/* ── 4. What a Trust Protects ── */}
        <section className={styles.protectsSection}>
          <div className={styles.maxW}>
            <div className={styles.sectionHeader}>
              <SectionLabel text="Asset Protection" centered />
              <h2 className={styles.sectionH2}>What you can protect with a Private Trust</h2>
              <p className={styles.sectionSub}>
                Almost any asset can be placed into a Private Irrevocable Express Trust —
                immediately upon establishment. The trust becomes the lawful owner and the
                asset is no longer yours to lose.
              </p>
            </div>
            <div className={styles.assetsGrid}>
              {assetCards.map(card => (
                <div key={card.title} className={styles.assetCard}>
                  <div className={styles.assetIconBlock}>{card.icon}</div>
                  <div className={styles.assetTitle}>{card.title}</div>
                  <p className={styles.assetDesc}>{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. Key Benefits ── */}
        <section className={styles.benefitsSection}>
          <div className={styles.maxW}>
            <div className={styles.sectionHeader}>
              <SectionLabel text="Why It Matters" centered />
              <h2 className={styles.sectionH2}>The benefits of operating under common law</h2>
            </div>
            <div className={styles.benefitsGrid}>
              {benefits.map(b => (
                <div key={b.title} className={styles.benefitItem}>
                  <div className={styles.benefitIconBlock}>{b.icon}</div>
                  <div className={styles.benefitTitle}>{b.title}</div>
                  <p className={styles.benefitBody}>{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 6. Common Misconceptions ── */}
        <section className={styles.mythSection}>
          <div className={styles.maxWNarrow}>
            <div className={styles.sectionHeader}>
              <SectionLabel text="Setting the Record Straight" centered />
              <h2 className={styles.sectionH2}>Common misconceptions about private trusts</h2>
            </div>
            <div className={styles.mythStack}>
              {misconceptions.map(m => (
                <div key={m.myth} className={styles.mythCard}>
                  <div className={styles.mythLeft}>
                    <span className={styles.mythPill}>Myth</span>
                    <p className={styles.mythText}>{m.myth}</p>
                  </div>
                  <div className={styles.mythDivider} />
                  <div className={styles.mythRight}>
                    <span className={styles.truthPill}>Truth</span>
                    <p className={styles.truthText}>{m.truth}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. Meet Jenna ── */}
        <section className={styles.jennaSection}>
          <div className={styles.maxW}>
            <div className={styles.jennaGrid}>
              <div className={styles.jennaLeft}>
                <SectionLabel text="Your Trust Expert" />
                <h2 className={styles.jennaH2}>Meet Jenna</h2>
                <p className={styles.bodyText}>
                  Jenna is ASN Consulting&apos;s dedicated Private Trust specialist. She works
                  personally with each client to understand their assets, their goals, and their
                  family situation — then structures a Private Irrevocable Express Trust
                  tailored to their needs.
                </p>
                <p className={styles.bodyText} style={{ marginTop: 14 }}>
                  Whether you are protecting a single property, building a family estate plan,
                  or looking to operate entirely outside the commercial system, Jenna will walk
                  you through the process step by step.
                </p>
                <div className={styles.jennaCTAs}>
                  <a href="/services" className={styles.primaryBtn}>Schedule a Call with Jenna</a>
                  <a href="#trust-faq" className={styles.outlineBtn}>Read the FAQs</a>
                </div>
              </div>

              <div className={styles.jennaCard}>
                <div className={styles.jennaCardAccent} />
                <div className={styles.jennaAvatar}>J</div>
                <div className={styles.jennaName}>Jenna</div>
                <div className={styles.jennaTitle}>Private Trust Specialist</div>
                <blockquote className={styles.jennaQuote}>
                  &ldquo;My goal is to make sure every client fully understands their trust before
                  we finalize anything. This is your protection — you should know exactly how
                  it works.&rdquo;
                </blockquote>
                <div className={styles.jennaStats}>
                  <div className={styles.jennaStat}>100+ Trusts Formed</div>
                  <div className={styles.jennaStatDivider} />
                  <div className={styles.jennaStat}>Common Law Expert</div>
                  <div className={styles.jennaStatDivider} />
                  <div className={styles.jennaStat}>Private Consultations</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. FAQ ── */}
        <section className={styles.faqSection} id="trust-faq">
          <div className={styles.maxWNarrow}>
            <div className={styles.sectionHeader}>
              <SectionLabel text="Common Questions" centered />
              <h2 className={styles.sectionH2}>Trust FAQs</h2>
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

        {/* ── 9. Final CTA Banner ── */}
        <section className={styles.ctaBanner}>
          <div className={styles.ctaBannerInner}>
            <div className={styles.ctaLeft}>
              <div className={styles.ctaLabel}>Private Irrevocable Express Trusts</div>
              <h3 className={styles.ctaH3}>Ready to protect your assets under common law?</h3>
            </div>
            <div className={styles.ctaRight}>
              <a href="/services" className={styles.primaryBtn}>Schedule a Call with Jenna</a>
              <a href="/services/diy" className={styles.outlineBtn}>View All Services</a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
