'use client';

import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import SectionLabel from '../components/SectionLabel';
import styles from './page.module.css';

// ── SVG atoms ─────────────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="var(--gold)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevronDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// ── Data ──────────────────────────────────────────────────────────────────────

const faqs = [
  {
    q: 'Is this legal? Are you helping people evade taxes?',
    a: 'No — tax evasion is illegal and we do not assist with it. Everything we do is grounded in established law. Lawful Money Redemption, for example, is based on federal law regarding the issuance and redemption of Federal Reserve Notes. We use the law as written — not loopholes or offshore schemes.',
  },
  {
    q: 'What is the difference between Lawful Money Redemption and the 1040-X?',
    a: 'They serve different goals. The 1040-X is for recovering taxes you have already paid in prior years. Lawful Money Redemption is about becoming non-obligated for income and capital gains taxes going forward. Many clients pursue both.',
  },
  {
    q: 'How far back can we go with 1040-X amendments?',
    a: 'Generally the IRS allows amended returns for up to 3 years from the original filing date or 2 years from the date the tax was paid, whichever is later. We assess your specific situation during the discovery process.',
  },
  {
    q: 'Do I qualify for Project 1040-X?',
    a: 'Project 1040-X is designed for individuals who have paid $20,000 or more in taxes for a given year. If you are below that threshold, Tax Issue Resolution or Lawful Money Redemption may be more appropriate for your situation.',
  },
  {
    q: "What does 'results-based pricing' mean for 1040-X?",
    a: 'The upfront fee covers our work — assessment, preparation, and filing. We additionally collect 32% of whatever refund you receive. If you receive nothing, we collect nothing on the contingency portion. It aligns our incentive with yours.',
  },
  {
    q: 'What do I need to provide to get started?',
    a: 'Fill out the inquiry form below with your tax situation details. Then send us your relevant tax documents — either digitally or by post. We do the rest.',
  },
];

const timelineSteps = [
  {
    num: '01',
    time: 'First',
    title: 'Submit Your Information',
    desc: 'Fill out the inquiry form below with your tax situation, the years involved, and the approximate amounts. The more detail you provide, the more accurately we can assess your case.',
  },
  {
    num: '02',
    time: 'Within 48 Hours',
    title: 'Send Your Documents',
    desc: 'Send us your tax documents for review — digitally via secure upload or through the Post Office. We review everything before recommending a service.',
  },
  {
    num: '03',
    time: 'After Review',
    title: 'Receive Your Strategy',
    desc: 'We assess your situation and present a clear plan of action — which service fits, what the process looks like, what it costs, and what you can expect to recover or save.',
  },
  {
    num: '04',
    time: 'Your Decision',
    title: 'Review, Accept & Sign',
    desc: 'You review the documents we prepare. Once you accept and sign, we handle the heavy lifting — filings, IRS correspondence, amendments, and follow-up.',
  },
  {
    num: '05',
    time: 'Completion',
    title: 'Results',
    desc: 'For 1040-X clients, your refund arrives via check or direct deposit. For Lawful Money and Resolution clients, your ongoing non-obligation or resolved situation is established and documented.',
  },
];

// ── Initial form state ────────────────────────────────────────────────────────

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  state: '',
  service: '',
  situation: '',
  years: '',
  amount: '',
  govEmployee: '',
  details: '',
  consent: false,
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TaxRemedyPage() {
  const [form, setForm] = useState(emptyForm);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          firstName: form.firstName,
          tagId: 12, // AC_TAGS.tax_lead
        }),
      });
    } catch {
      // Non-blocking — form submission already succeeded
    }
  }

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
              <a href="/services">Services</a>
              <span>/</span>
              <span>Tax Consulting</span>
            </div>
            <SectionLabel text="Tax Consulting" centered />
            <h1 className={styles.heroH1}>
              Tired of Paying Income Taxes?<br />
              There Is a <em className={styles.heroGold}>Lawful Way Out.</em>
            </h1>
            <p className={styles.heroSub}>
              We take innovative, lawful approaches to reduce and eliminate income tax liability —
              using established law, not loopholes. Whether you need to recover past overpayments
              or become non-obligated going forward, we have a solution for your situation.
            </p>
            <div className={styles.heroCTAs}>
              <a href="/services" className={styles.primaryBtn}>Book a Discovery Call</a>
              <a href="#services" className={styles.outlineBtn}>View Our Services</a>
            </div>
            <div className={styles.badges}>
              <div className={styles.badge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M12 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M3 17l4-4 4 4 7-7" />
                </svg>
                <span>Lawful &amp; Established</span>
              </div>
              <div className={styles.badge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <polyline points="9 12 11 14 15 10" />
                </svg>
                <span>Expert Tax Team</span>
              </div>
              <div className={styles.badge}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                </svg>
                <span>Results-Based Pricing</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. The Problem ── */}
        <section className={styles.problemSection}>
          <div className={styles.maxW}>
            <div className={styles.problemGrid}>
              <div className={styles.problemLeft}>
                <SectionLabel text="The Reality" />
                <h2 className={styles.problemH2}>
                  Most Americans are overpaying — or don&apos;t have to pay at all
                </h2>
                <p className={styles.bodyText}>
                  The tax code is extraordinarily complex — and that complexity almost always
                  benefits the system, not the individual. Most people pay far more than they
                  are legally obligated to, simply because they do not know the law.
                </p>
                <p className={styles.bodyText} style={{ marginTop: 14 }}>
                  Through lawful money redemption, proper status correction, and strategic use
                  of established law, many Americans can dramatically reduce or entirely eliminate
                  their income and capital gains tax obligations — without fraud, offshore schemes,
                  or illegal activity.
                </p>
                <p className={styles.bodyText} style={{ marginTop: 14 }}>
                  For those who have already overpaid, the IRS provides a mechanism to amend
                  prior returns and recover those funds. We have helped clients recover significant
                  refunds from previous tax years using this process.
                </p>
              </div>
              <div className={styles.problemRight}>
                <div className={styles.statCard}>
                  <div className={styles.statNum}>32%</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statLabel}>Contingency Only</div>
                    <div className={styles.statDesc}>For 1040-X refund recovery — we only collect when you do.</div>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNum}>$20K+</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statLabel}>Minimum Threshold</div>
                    <div className={styles.statDesc}>1040-X and Normie packages require $20,000+ in withholdings or tax obligations.</div>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statNum}>3</div>
                  <div className={styles.statInfo}>
                    <div className={styles.statLabel}>Distinct Solutions</div>
                    <div className={styles.statDesc}>Each designed for a different tax situation — from past overpayments to future non-obligation.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. Three Services ── */}
        <section className={styles.servicesSection} id="services">
          <div className={styles.maxW}>
            <div className={styles.sectionHeader}>
              <SectionLabel text="Our Services" centered />
              <h2 className={styles.sectionH2}>Three paths to tax relief</h2>
              <p className={styles.sectionSub}>
                Each service is built for a different situation. Choose the one that fits where
                you are — or book a call and we will help you figure it out.
              </p>
            </div>

            <div className={styles.servicesGrid}>

              {/* Card 1 — 1040-X */}
              <div className={`${styles.serviceCard} ${styles.serviceCardFeatured}`}>
                <span className={styles.featuredBadge}>Most Recovered</span>
                <div className={styles.iconBlock}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                    <polyline points="10 9 9 9 8 9" />
                  </svg>
                </div>
                <div className={styles.cardCategory}>Tax Amendments</div>
                <div className={styles.cardTitle}>Project 1040-X</div>
                <div className={styles.cardPrice}>$1,250 – $5,000+</div>
                <div className={styles.cardPriceSub}>+ 32% of refund recovered</div>
                <p className={styles.cardDesc}>
                  Recover taxes you&apos;ve already paid. We amend prior year returns and work
                  directly with the IRS to recover your overpayments.
                </p>
                <div className={styles.eligibilityPill}>
                  Requires $20,000+ paid in taxes for a given year
                </div>
                <hr className={styles.cardDivider} />
                <ul className={styles.featureList}>
                  {[
                    'Assessment of prior year returns',
                    'Tax return amendments prepared',
                    'We mail your amended returns to the correct IRS offices',
                    'Applicable law & how to use it',
                    '3 coaching calls with our tax team',
                    'IRS correspondence — Done For You',
                  ].map(f => (
                    <li key={f} className={styles.featureItem}>
                      <CheckIcon />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="/services" className={styles.cardCTAPrimary}>
                  Get Started — Book a Call
                </a>
              </div>

              {/* Card 2 — Lawful Money */}
              <div className={styles.serviceCard}>
                <div className={styles.iconBlock}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    <path d="M3 17l4-4 4 4 7-7" />
                  </svg>
                </div>
                <div className={styles.cardCategory}>Future Non-Obligation</div>
                <div className={styles.cardTitle}>Lawful Money Redemption</div>
                <div className={styles.cardPrice}>Custom Pricing</div>
                <div className={styles.cardPriceSub}>Book a call to discuss</div>
                <p className={styles.cardDesc}>
                  Become non-obligated for income and capital gains taxes going forward —
                  using established law and the proper redemption of lawful money.
                </p>
                <hr className={styles.cardDivider} />
                <ul className={styles.featureList}>
                  {[
                    'Lawful Money Game Plan',
                    'Lawful Money definitions & applicable law',
                    'Step-by-step guide',
                    'Video and audio tutorials',
                    'One-on-one expert coaching',
                    'How to eliminate VAT tax',
                    'How to navigate IRS correspondence',
                    'Complete checklist',
                    'Eliminate crypto tax liability',
                  ].map(f => (
                    <li key={f} className={styles.featureItem}>
                      <CheckIcon />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="/services" className={styles.cardCTAOutline}>
                  Schedule a Discovery Call
                </a>
              </div>

              {/* Card 3 — Normie */}
              <div className={styles.serviceCard}>
                <div className={styles.iconBlock}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                    stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" />
                    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
                  </svg>
                </div>
                <div className={styles.cardCategory}>Issue Resolution</div>
                <div className={styles.cardTitle}>Tax Issue Resolution</div>
                <div className={styles.cardSubtitle}>Formerly called &ldquo;Normie&rdquo; Tax Resolutions</div>
                <div className={styles.cardPrice}>Custom Pricing</div>
                <div className={styles.cardPriceSub}>Request a quote below</div>
                <p className={styles.cardDesc}>
                  One-on-one tax coaching and advocacy to resolve standing tax issues — IRS
                  notices, audits, amendments, and anything in between.
                </p>
                <div className={styles.eligibilityPill}>
                  Requires $20,000+ in withholdings or alleged tax obligation
                </div>
                <hr className={styles.cardDivider} />
                <ul className={styles.featureList}>
                  {[
                    'Evaluation of your full tax situation',
                    'Review of all IRS letters received',
                    'Custom strategy designed for your situation',
                    'Meetings with tax team on developments',
                    'Dedicated tax expert as your advocate',
                  ].map(f => (
                    <li key={f} className={styles.featureItem}>
                      <CheckIcon />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="#inquiry-form" className={styles.cardCTAOutline}>
                  Request a Quote
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* ── 4. How It Works ── */}
        <section className={styles.howSection}>
          <div className={styles.maxWNarrow}>
            <div className={styles.sectionHeader}>
              <SectionLabel text="The Process" centered />
              <h2 className={styles.sectionH2}>What working with us looks like</h2>
            </div>
            <div className={styles.timeline}>
              {timelineSteps.map((step, i) => (
                <div key={step.num} className={styles.timelineItem}>
                  <div className={styles.timelineLeft}>
                    <div className={styles.timelineNum}>{step.num}</div>
                    {i < timelineSteps.length - 1 && <div className={styles.timelineLine} />}
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

        {/* ── 5. Pricing Transparency ── */}
        <section className={styles.pricingSection}>
          <div className={styles.maxW}>
            <div className={styles.sectionHeader}>
              <SectionLabel text="Pricing" centered />
              <h2 className={styles.sectionH2}>No surprises — here is exactly how we charge</h2>
            </div>
            <div className={styles.pricingGrid}>

              {/* 1040-X Pricing */}
              <div className={`${styles.pricingCard} ${styles.pricingCardFeatured}`}>
                <div className={styles.pricingAmount}>$1,250 – $5,000+</div>
                <div className={styles.pricingAmountSub}>Upfront fee based on complexity</div>
                <hr className={styles.pricingDivider} />
                <ul className={styles.pricingFactors}>
                  <li>Filing status (Single, Married, Head of Household)</li>
                  <li>Number of states you worked and paid taxes in</li>
                  <li>Number of years to be filed and number of dependents</li>
                </ul>
                <div className={styles.pricingNote}>
                  ASN also collects 32% of your refund amount once you have received your check or direct deposit.
                </div>
              </div>

              {/* Lawful Money Pricing */}
              <div className={styles.pricingCard}>
                <div className={styles.pricingAmount}>Custom</div>
                <div className={styles.pricingAmountSub}>Determined after discovery call</div>
                <hr className={styles.pricingDivider} />
                <ul className={styles.pricingFactors}>
                  <li>Complexity of your financial situation</li>
                  <li>Assets and accounts to be covered</li>
                  <li>Ongoing coaching and support included</li>
                </ul>
                <div className={styles.pricingNote}>
                  Book a free 20-minute discovery call to discuss your situation and receive a quote.
                </div>
              </div>

              {/* Resolution Pricing */}
              <div className={styles.pricingCard}>
                <div className={styles.pricingAmount}>Custom</div>
                <div className={styles.pricingAmountSub}>Request a quote below</div>
                <hr className={styles.pricingDivider} />
                <ul className={styles.pricingFactors}>
                  <li>Nature and complexity of the IRS issue</li>
                  <li>Years involved and amounts alleged</li>
                  <li>Number of meetings and correspondence required</li>
                </ul>
                <div className={styles.pricingNote}>
                  Minimum $20,000 in withholdings or alleged tax obligation required to qualify.
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 6. FAQ ── */}
        <section className={styles.faqSection}>
          <div className={styles.maxWNarrow}>
            <div className={styles.sectionHeader}>
              <SectionLabel text="Common Questions" centered />
              <h2 className={styles.sectionH2}>Tax consulting FAQs</h2>
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

        {/* ── 7. Inquiry Form ── */}
        <section className={styles.formSection} id="inquiry-form">
          <div className={styles.formMaxW}>
            <div className={styles.sectionHeader}>
              <SectionLabel text="Get Started" centered />
              <h2 className={styles.sectionH2}>Tell us about your tax situation</h2>
              <p className={styles.formIntro}>
                Fill out the form below and our tax team will review your situation and reach
                out within 1–2 business days to discuss next steps.
              </p>
            </div>

            {submitted ? (
              <div className={styles.successState}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                  stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <h3 className={styles.successH3}>We received your inquiry</h3>
                <p className={styles.successText}>
                  Thank you for reaching out. Our tax team will review your situation and contact
                  you within 1–2 business days. If you have an urgent matter, you can also book
                  a call directly.
                </p>
                <a href="/services" className={styles.outlineBtn}>Book a Call Now</a>
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleSubmit} noValidate>

                {/* Name row */}
                <div className={styles.formRow}>
                  <div className={styles.formField}>
                    <label className={styles.fieldLabel} htmlFor="firstName">First Name</label>
                    <input
                      id="firstName" name="firstName" type="text" required
                      className={styles.fieldInput}
                      value={form.firstName} onChange={handleChange}
                    />
                  </div>
                  <div className={styles.formField}>
                    <label className={styles.fieldLabel} htmlFor="lastName">Last Name</label>
                    <input
                      id="lastName" name="lastName" type="text" required
                      className={styles.fieldInput}
                      value={form.lastName} onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Email */}
                <div className={styles.formField}>
                  <label className={styles.fieldLabel} htmlFor="email">Email</label>
                  <input
                    id="email" name="email" type="email" required
                    className={styles.fieldInput}
                    value={form.email} onChange={handleChange}
                  />
                </div>

                {/* Phone */}
                <div className={styles.formField}>
                  <label className={styles.fieldLabel} htmlFor="phone">Phone</label>
                  <input
                    id="phone" name="phone" type="tel" required
                    className={styles.fieldInput}
                    value={form.phone} onChange={handleChange}
                  />
                </div>

                {/* State */}
                <div className={styles.formField}>
                  <label className={styles.fieldLabel} htmlFor="state">State</label>
                  <input
                    id="state" name="state" type="text" required
                    placeholder="e.g. Tennessee"
                    className={styles.fieldInput}
                    value={form.state} onChange={handleChange}
                  />
                </div>

                {/* Service */}
                <div className={styles.formField}>
                  <label className={styles.fieldLabel} htmlFor="service">
                    Which service are you interested in?
                  </label>
                  <div className={styles.selectWrap}>
                    <select
                      id="service" name="service" required
                      className={styles.fieldSelect}
                      value={form.service} onChange={handleChange}
                    >
                      <option value="" disabled>Select a service…</option>
                      <option>Project 1040-X Amendments</option>
                      <option>Lawful Money Redemption</option>
                      <option>Tax Issue Resolution</option>
                      <option>Not Sure — Need Guidance</option>
                    </select>
                    <span className={styles.selectArrow}><ChevronDown /></span>
                  </div>
                </div>

                {/* Situation */}
                <div className={styles.formField}>
                  <label className={styles.fieldLabel} htmlFor="situation">
                    Which best describes your situation?
                  </label>
                  <div className={styles.selectWrap}>
                    <select
                      id="situation" name="situation" required
                      className={styles.fieldSelect}
                      value={form.situation} onChange={handleChange}
                    >
                      <option value="" disabled>Select…</option>
                      <option>IRS notice or audit</option>
                      <option>Tax return issue or amendment</option>
                      <option>Withholding problem</option>
                      <option>Business tax issue</option>
                      <option>General tax questions</option>
                      <option>Combination of the above</option>
                    </select>
                    <span className={styles.selectArrow}><ChevronDown /></span>
                  </div>
                </div>

                {/* Years */}
                <div className={styles.formField}>
                  <label className={styles.fieldLabel} htmlFor="years">
                    Which tax years are involved?
                  </label>
                  <div className={styles.selectWrap}>
                    <select
                      id="years" name="years" required
                      className={styles.fieldSelect}
                      value={form.years} onChange={handleChange}
                    >
                      <option value="" disabled>Select…</option>
                      <option>Current year only</option>
                      <option>1–2 past years</option>
                      <option>3–5 past years</option>
                      <option>6+ years</option>
                      <option>Not sure</option>
                    </select>
                    <span className={styles.selectArrow}><ChevronDown /></span>
                  </div>
                </div>

                {/* Amount */}
                <div className={styles.formField}>
                  <label className={styles.fieldLabel} htmlFor="amount">
                    Approximate amount involved
                  </label>
                  <div className={styles.selectWrap}>
                    <select
                      id="amount" name="amount" required
                      className={styles.fieldSelect}
                      value={form.amount} onChange={handleChange}
                    >
                      <option value="" disabled>Select a range…</option>
                      <option>Under $5,000</option>
                      <option>$5,000 – $20,000</option>
                      <option>$20,000 – $100,000</option>
                      <option>$100,000+</option>
                    </select>
                    <span className={styles.selectArrow}><ChevronDown /></span>
                  </div>
                </div>

                {/* Gov employee */}
                <div className={styles.formField}>
                  <label className={styles.fieldLabel} htmlFor="govEmployee">
                    Do you work directly for state or federal government?
                  </label>
                  <div className={styles.selectWrap}>
                    <select
                      id="govEmployee" name="govEmployee" required
                      className={styles.fieldSelect}
                      value={form.govEmployee} onChange={handleChange}
                    >
                      <option value="" disabled>Select…</option>
                      <option>No</option>
                      <option>Yes</option>
                    </select>
                    <span className={styles.selectArrow}><ChevronDown /></span>
                  </div>
                </div>

                {/* Details */}
                <div className={styles.formField}>
                  <label className={styles.fieldLabel} htmlFor="details">
                    Tell us about your situation
                  </label>
                  <textarea
                    id="details" name="details" rows={5} required
                    className={styles.fieldTextarea}
                    placeholder="Share any relevant details about your tax situation, what you have received from the IRS, what years are involved, and anything else you think is important."
                    value={form.details} onChange={handleChange}
                  />
                </div>

                {/* Consent */}
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox" name="consent"
                    className={styles.checkbox}
                    checked={form.consent} onChange={handleChange}
                  />
                  <span>I agree to receive educational and promotional emails from ASN Consulting.</span>
                </label>

                <button type="submit" className={styles.submitBtn}>
                  Submit Inquiry →
                </button>
              </form>
            )}
          </div>
        </section>

        {/* ── 8. Final CTA Banner ── */}
        <section className={styles.ctaBanner}>
          <div className={styles.ctaBannerInner}>
            <div className={styles.ctaLeft}>
              <div className={styles.ctaLabel}>Ready to Stop Overpaying?</div>
              <h3 className={styles.ctaH3}>Book a free 20-minute tax discovery call</h3>
              <p className={styles.ctaDesc}>
                We will review your situation, explain your options, and tell you which service
                is the right fit — no obligation.
              </p>
            </div>
            <div className={styles.ctaRight}>
              <a href="/services" className={styles.primaryBtn}>Book a Discovery Call</a>
              <a href="#inquiry-form" className={styles.outlineBtn}>Submit an Inquiry</a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
