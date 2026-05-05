'use client';

import { useState } from 'react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SectionLabel from '../../components/SectionLabel';
import styles from './page.module.css';

// ── SVG helpers ──────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const DocIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const ActivityIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

// ── Data ─────────────────────────────────────────────────────────────────────

const individualFeatures = [
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
  'Access to additional documents & learning materials',
  'How-To instructional videos',
  'Passport process instructions',
];

const partnerFeatures = [
  'Everything in Individual Package ×2 (named for each person)',
  '1 phone call (30 minutes) to ask your questions',
  'Access to additional documents & learning materials',
  'Email support',
  'How-To instructional videos',
  'Passport process instructions',
  'Marriage Paperwork Form',
];

const familyFeatures = [
  'Up to 4 complete sets of documents',
  '1 phone call (30 minutes) to ask your questions',
  'Access to additional documents & learning materials',
  'Email support',
  'How-To instructional videos',
  'Passport process instructions',
  'Marriage Document Form',
  'Access to Baby Deed Form for all kids under 18',
];

const roeFeatures = [
  'Document Generator Form',
  'Instructional Videos (note: must be purchased separately)',
];

const plans = [
  {
    id: 'individual',
    category: 'For One Person',
    name: 'Individual Package',
    price: '297',
    tagline: 'Solo made simple — every tool you need, self-guided.',
    features: individualFeatures,
    href: 'https://buy.stripe.com/00wdR9f2e49bfFg7df97G0t',
    popular: false,
  },
  {
    id: 'partner',
    category: 'For Two People',
    name: 'Partner Package',
    price: '597',
    tagline: 'Complete tools for two, plus email/text support and a guiding phone call.',
    features: partnerFeatures,
    href: 'https://buy.stripe.com/8x28wPdYacFH50CeFH97G0u',
    popular: true,
  },
  {
    id: 'family',
    category: 'For Up to 4 People',
    name: 'Family Package',
    price: '997',
    tagline: 'Tools for the whole family — videos, unlimited support, and phone call included.',
    features: familyFeatures,
    href: 'https://buy.stripe.com/fZudR99HU7lnct4apr97G0v',
    popular: false,
  },
  {
    id: 'roe',
    category: 'Standalone Filing',
    name: 'Revocation of Election',
    price: '397',
    tagline: 'ROE document generator — instructional videos available separately.',
    features: roeFeatures,
    href: 'https://buy.stripe.com/8wMeYM7m68P28F2aEH',
    popular: false,
  },
];

// All unique features for the comparison table, in display order
const allCompareFeatures = [
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
  'Access to additional documents & learning materials',
  'How-To instructional videos',
  'Passport process instructions',
  'Everything in Individual Package ×2 (named for each person)',
  '1 phone call (30 minutes) to ask your questions',
  'Email support',
  'Marriage Paperwork / Document Form',
  'Access to Baby Deed Form for all kids under 18',
  'Document Generator Form',
  'Instructional Videos (sold separately for ROE)',
];

// For each compare feature, which plans include it?
const compareMatrix: Record<string, boolean[]> = {
  'Deed of Reconveyance Document':                                 [true,  true,  true,  false],
  'Act of Expatriation for each legal name (3 documents)':         [true,  true,  true,  false],
  'Cancellation of all prior Powers of Attorney':                  [true,  true,  true,  false],
  'Declaration of Political Status':                               [true,  true,  true,  false],
  'Declaration of Political Status Letter to Secretary of State':  [true,  true,  true,  false],
  'Certificate of Assumed Name':                                   [true,  true,  true,  false],
  'Mandatory Notice — Foreign Sovereign Immunities Act':           [true,  true,  true,  false],
  'Paramount Claim of Life':                                       [true,  true,  true,  false],
  '2 Witness Testimonies':                                         [true,  true,  true,  false],
  'Revocation of Election to Pay Taxes Cover Letters (NY & DC)':   [true,  true,  true,  false],
  'Voter Registration Cancellation Letter':                        [true,  true,  true,  false],
  'Common Carry Declaration':                                      [true,  true,  true,  false],
  'Access to additional documents & learning materials':           [true,  true,  true,  false],
  'How-To instructional videos':                                   [true,  true,  true,  false],
  'Passport process instructions':                                 [true,  true,  true,  false],
  'Everything in Individual Package ×2 (named for each person)':  [false, true,  false, false],
  '1 phone call (30 minutes) to ask your questions':               [false, true,  true,  false],
  'Email support':                                                 [false, true,  true,  false],
  'Marriage Paperwork / Document Form':                            [false, true,  true,  false],
  'Access to Baby Deed Form for all kids under 18':                [false, false, true,  false],
  'Document Generator Form':                                       [false, false, false, true ],
  'Instructional Videos (sold separately for ROE)':                [false, false, false, true ],
};

const faqs = [
  {
    q: 'What do I actually receive after purchasing?',
    a: 'You get immediate access to your document package through your account. Fill in your details using our guided forms and your documents are generated instantly — ready to print, sign, and notarize.',
  },
  {
    q: 'Is there support if I get stuck?',
    a: 'The Individual plan is self-guided with no direct support. The Partner and Family plans include email support and a 30-minute phone call. For full hand-holding, consider our Done For You service.',
  },
  {
    q: 'How is this different from the DFY service?',
    a: 'With DIY, you follow our step-by-step system and complete the process yourself. With DFY, our team prepares everything and guides you personally through each step. DIY costs less; DFY saves time and eliminates errors.',
  },
  {
    q: 'Can I upgrade my plan later?',
    a: 'Yes. If you start with the Individual plan and later need the Partner or Family package, contact us and we will credit your original purchase toward the upgrade.',
  },
  {
    q: 'What if I have more than 4 people in my family?',
    a: 'The Family plan covers up to 4 people. For larger families, contact us directly to discuss a custom arrangement.',
  },
  {
    q: 'Do I need the instructional videos?',
    a: 'The videos are highly recommended but sold separately for the ROE package. All other plans include access to How-To instructional videos covering notarization, filing, and certified mail.',
  },
];

// ── Page Component ────────────────────────────────────────────────────────────

export default function DIYPageClient() {
  const [view, setView] = useState<'cards' | 'compare'>('cards');

  return (
    <>
      <Nav />
      <main>

        {/* ── 1. Page Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.breadcrumb}>
              <a href="/">Home</a>
              <span>/</span>
              <a href="/services">Services</a>
              <span>/</span>
              <span>DIY Programs</span>
            </div>
            <SectionLabel text="Do It Yourself" />
            <h1 className={styles.heroH1}>
              Your Status Correction.<br />
              <em className={styles.heroGold}>Your Pace.</em>
            </h1>
            <p className={styles.heroSub}>
              Complete document packages with everything you need to correct your status as an
              American State National — on your own schedule.
            </p>
            <div className={styles.heroCTAs}>
              <a href="#plans" className={styles.primaryBtn}>View All Plans</a>
              <a href="#compare" className={styles.outlineBtn}>Compare Plans</a>
            </div>
          </div>
        </section>

        {/* ── 2. What You Get ── */}
        <section className={styles.featuresSection}>
          <div className={styles.maxW}>
            <div className={styles.featuresGrid}>

              <div className={styles.featureCard}>
                <div className={styles.iconBlock}>
                  <DocIcon />
                </div>
                <div className={styles.featureTitle}>Instant Document Generation</div>
                <p className={styles.featureDesc}>
                  Fill in your details and your complete document package is generated immediately.
                  No waiting, no guesswork.
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.iconBlock}>
                  <ShieldCheckIcon />
                </div>
                <div className={styles.featureTitle}>Step-by-Step Guidance</div>
                <p className={styles.featureDesc}>
                  Every plan includes detailed instructions for notarization, filing, and mailing —
                  so you do it right the first time.
                </p>
              </div>

              <div className={styles.featureCard}>
                <div className={styles.iconBlock}>
                  <ActivityIcon />
                </div>
                <div className={styles.featureTitle}>Lifetime Access</div>
                <p className={styles.featureDesc}>
                  Once you purchase, your documents and materials are yours. Return anytime to
                  download, reference, or update.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ── 3. Plans ── */}
        <section className={styles.plansSection} id="plans">
          <div className={styles.maxW}>
            <div className={styles.sectionHeader}>
              <SectionLabel text="Choose Your Plan" centered />
              <h2 className={styles.sectionH2}>Select the package that fits your situation</h2>
            </div>

            {/* View toggle */}
            <div className={styles.viewToggle}>
              <button
                className={`${styles.toggleBtn} ${view === 'cards' ? styles.toggleActive : ''}`}
                onClick={() => setView('cards')}
              >
                Cards View
              </button>
              <button
                className={`${styles.toggleBtn} ${view === 'compare' ? styles.toggleActive : ''}`}
                onClick={() => setView('compare')}
              >
                Compare Plans
              </button>
            </div>

            {/* Cards view */}
            {view === 'cards' && (
              <div className={styles.plansGrid}>
                {plans.map(plan => (
                  <div
                    key={plan.id}
                    className={`${styles.planCard} ${plan.popular ? styles.planCardPopular : ''}`}
                  >
                    {plan.popular && (
                      <span className={styles.popularBadge}>Most Popular</span>
                    )}
                    <div className={styles.planCategory}>{plan.category}</div>
                    <div className={styles.planName}>{plan.name}</div>
                    <div className={styles.planPrice}>
                      <sup className={styles.priceDollar}>$</sup>
                      <span className={styles.priceAmount}>{plan.price}</span>
                    </div>
                    <p className={styles.planTagline}>{plan.tagline}</p>
                    <hr className={styles.planDivider} />
                    <ul className={styles.planFeatures}>
                      {plan.features.map(f => (
                        <li key={f} className={styles.planFeatureItem}>
                          <CheckIcon />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a href={plan.href} className={styles.planCTA}>
                      Get Started — ${plan.price}
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Compare table */}
            {view === 'compare' && (
              <div className={styles.tableWrapper} id="compare">
                <table className={styles.compareTable}>
                  <thead>
                    <tr>
                      <th className={styles.thFeature}></th>
                      {plans.map(plan => (
                        <th
                          key={plan.id}
                          className={`${styles.thPlan} ${plan.popular ? styles.thPopular : ''}`}
                        >
                          <div className={styles.thPlanName}>{plan.name}</div>
                          <div className={styles.thPlanPrice}>${plan.price}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allCompareFeatures.map((feat, i) => (
                      <tr key={feat} className={i % 2 === 0 ? styles.rowOdd : styles.rowEven}>
                        <td className={styles.tdFeature}>{feat}</td>
                        {plans.map(plan => (
                          <td key={plan.id} className={styles.tdCell}>
                            {compareMatrix[feat]?.[plans.indexOf(plan)] ? (
                              <CheckIcon />
                            ) : (
                              <span className={styles.dash}>—</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr className={styles.ctaRow}>
                      <td></td>
                      {plans.map(plan => (
                        <td key={plan.id} className={styles.ctaCell}>
                          <a href={plan.href} className={styles.tableBtn}>
                            Get Started
                          </a>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* ── 4. FAQ Strip ── */}
        <section className={styles.faqSection}>
          <div className={styles.maxW}>
            <div className={styles.sectionHeader}>
              <SectionLabel text="Common Questions" centered />
              <h2 className={styles.sectionH2}>Frequently asked questions</h2>
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

        {/* ── 5. DFY Upsell Banner ── */}
        <section className={styles.upsellBanner}>
          <div className={styles.maxW}>
            <div className={styles.upsellInner}>
              <div className={styles.upsellLeft}>
                <div className={styles.upsellLabel}>Not sure about DIY?</div>
                <h3 className={styles.upsellH3}>Let us handle everything for you</h3>
                <p className={styles.upsellDesc}>
                  Our Done For You service includes expert document preparation, personal
                  guidance, and support through every step.
                </p>
              </div>
              <div className={styles.upsellRight}>
                <a href="/done-for-you-services" className={styles.primaryBtn}>
                  Learn About DFY
                </a>
                <a href="/services" className={styles.outlineBtn}>
                  Book a Free Call
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. Final CTA ── */}
        <section className={styles.finalCTA}>
          <div className={styles.maxW}>
            <div className={styles.finalCTAInner}>
              <SectionLabel text="Get Started Today" centered />
              <h2 className={styles.finalH2}>
                Ready to take control of your legal identity?
              </h2>
              <p className={styles.finalSub}>
                Choose your plan above or book a free call if you have questions.
              </p>
              <a href="#plans" className={styles.primaryBtn}>View Plans</a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
