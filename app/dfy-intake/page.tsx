'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import shared from '../dfy-thank-you/page.module.css';
import styles from './page.module.css';

// ── Types ──────────────────────────────────────────────────────────────────

type PageState = 'loading' | 'hha' | 'intake' | 'complete' | 'already_done';

// ── Stepper ────────────────────────────────────────────────────────────────

function Stepper({ state }: { state: PageState }) {
  const step1Done = state === 'intake' || state === 'complete';
  const step2Done = state === 'complete';
  const step2Active = state === 'intake';

  return (
    <div className={shared.stepper}>
      <div className={`${shared.stepItem} ${!step1Done ? shared.stepActive : shared.stepDone}`}>
        <div className={shared.stepCircle}>
          {step1Done ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : '1'}
        </div>
        <span className={shared.stepLabel}>Hold Harmless Agreement</span>
      </div>

      <div className={`${shared.stepConnector} ${step1Done ? shared.connectorDone : ''}`} />

      <div className={`${shared.stepItem} ${step2Done ? shared.stepDone : step2Active ? shared.stepActive : shared.stepPending}`}>
        <div className={shared.stepCircle}>
          {step2Done ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : '2'}
        </div>
        <span className={shared.stepLabel}>Intake Form</span>
      </div>
    </div>
  );
}

// ── HHA Text ───────────────────────────────────────────────────────────────

function HHAText() {
  return (
    <div className={shared.hhaText}>
      <p className={shared.hhaTitle}>ASN Consulting Hold Harmless Agreement</p>
      <p className={shared.hhaPara}>The Purpose of this HOLD HARMLESS AGREEMENT is to promote Honesty and Responsibility for all involved in this private membership club. Acceptance of this Hold Harmless Agreement with a wet ink signature means both parties agree to uphold and protect the welfare of each other.</p>
      <p className={shared.hhaHeading}>ACCEPTANCE OF THIS HOLD HARMLESS AGREEMENT</p>
      <p className={shared.hhaPara}>This Hold Harmless Agreement (herein after called &ldquo;Agreement&rdquo;) is entered into by and between you and ASN Consulting, its trust, its partners, and affiliates. The terms of this Agreement govern your access and use of both [https://www.asnconsulting.co] and including any content, functionality, and services offered on or through [https://www.asnconsulting.co].</p>
      <p className={shared.hhaPara}>Please read this Hold Harmless Agreement carefully before you agree to become a client. By signing this Agreement you accept and agree to be bound and abide by this Agreement herein. If you do not want to agree to the terms of this Agreement, you must not sign up to become a member.</p>
      <p className={shared.hhaHeading}>ACCOUNT IS VOLUNTARY</p>
      <p className={shared.hhaPara}>In the same way your membership/account with ASN Consulting is voluntary and can be terminated at any time, ASN Consulting reserves the right to terminate your membership/account at any time, for any reason.</p>
      <p className={shared.hhaHeading}>EXCLUSIVE NATURE TO RECORD DOCUMENTS IN PUBLIC</p>
      <p className={shared.hhaPara}>ASN Consulting only serves as the intermediary for document publishing specifically for the purpose of being able to easily share that document with the appropriate person or entity. ASN Consulting is not responsible for the validity of any recorded documents nor is it responsible for notifying any person or entity of your posting. It is merely the intermediary for publishing your documents and providing a unique URL that can be shared or posted in/on places such as letters, emails, texts, newspapers, public library boards, social media, or other channels for posting documents.</p>
      <p className={shared.hhaHeading}>CONSENT TO PUBLISH RECORDED DOCUMENTS</p>
      <p className={shared.hhaPara}>The purpose of ASN Consulting is to be an intermediary where men and women can publish their documents in a format that can be viewed by the public. As a result, by accepting our Hold Harmless Agreement you agree that your published documents will be available online through the search feature on the public domain PublicRecordPosting.com and through the unique URL that is generated for each document and for your Profile. Further you agree to and allow ASN Consulting to agree to Public Record Posting&apos;s Hold Harmless Agreement on your behalf.</p>
      <p className={shared.hhaPara}>You further understand that by publishing your documents, you may be contacted directly by individuals or entities that wish to dispute your statements. In the event this happens you agree that you will not hold ASN Consulting liable for any disputes, claims, or legal issues that may arise from the information contained in your documents.</p>
      <p className={shared.hhaHeading}>RELEASE OF ASN CONSULTING</p>
      <p className={shared.hhaPara}><strong>Assumption of Responsibility:</strong> I am fully aware that by allowing ASN Consulting to create and publish my documents online may result in the public finding information about me and I hereby accept the consequences and take responsibility, having engaged with ASN Consulting voluntarily.</p>
      <p className={shared.hhaPara}><strong>Exemption from Liability:</strong> I hereby fully and forever discharge and release ASN Consulting from any and all liability, claims, demands, actions, and causes of action whatsoever arising out of any damages, both in law and equity, in any way resulting from legal, personal, physical, psychological or emotional injuries, distress, or death arising from or in any way related to the recording, publishing and sharing of my documents. This release from liability also includes loss, damage or injury resulting from the negligence of ASN Consulting from any other cause or causes.</p>
      <p className={shared.hhaPara}><strong>Covenant Not to Sue:</strong> I agree not to institute, initiate, or assist the prosecution of any suit, claim or action at law or equity, or otherwise, against ASN Consulting for damages which I or my heirs, executors, administrators, or assigns hereafter may have arising from or in any way related to the recording, publishing and sharing of my documents. This release from liability also includes loss, damage, or injury resulting from the negligence of ASN Consulting from any other cause or causes.</p>
      <p className={shared.hhaPara}><strong>Indemnity:</strong> I agree to indemnify and hold harmless ASN Consulting, its trust, its partners, and affiliates from any and all losses, claims, actions, or proceedings of any kind which may be initiated by me as a man or woman, and/or any other man, woman, person or organization on my behalf against ASN Consulting. This indemnification includes reimbursement by ASN Consulting for any and all legal costs and reasonable &ldquo;legal&rdquo; fees incurred as a result of such actions.</p>
      <p className={shared.hhaPara}><strong>Waiver of Punitive Damages:</strong> I understand and agree that I am waiving and forever abandoning any claims for punitive or exemplary damages against ASN Consulting. I voluntarily choose to give up this Right.</p>
      <p className={shared.hhaHeading}>ARBITRATION</p>
      <p className={shared.hhaPara}><strong>Arbitration:</strong> I agree that any controversy claim against ASN Consulting not released herein, arising out of or relating to my membership and/or the recording, publishing and sharing of my documents, shall be settled by private arbitration in accordance with the rules of the American Arbitration Association, and not by lawsuit or resort to court process (except as the law provides for judicial review of arbitration proceedings). This shall apply to all claims including allegations that there have been wrongful acts or omissions by ASN Consulting either intentionally or otherwise. The arbitrator&apos;s decisions may be entered in any court having competent jurisdiction. By signing this Agreement, I am agreeing that any issue or claim arising out of my use of ASN Consulting shall be decided by neutral private arbitration. I am giving up my Right to a trial by a Jury or Judge.</p>
      <p className={shared.hhaHeading}>MISCELLANEOUS</p>
      <p className={shared.hhaPara}><strong>Governing Law:</strong> I understand that this Agreement shall be construed and governed by the laws on Tennessee State, without the United States, and that it cannot be modified unless in writing and signed by both parties.</p>
      <p className={shared.hhaPara}><strong>Entire Agreement:</strong> I understand that this Agreement contains all the promises and agreements between parties with regard to the release of ASN Consulting and I acknowledge there are no oral or written promises or agreements outside of this Agreement regarding the release of ASN Consulting.</p>
      <p className={shared.hhaPara}><strong>Refund Policy:</strong> I understand that once I have paid for the services of ASN Consulting, I am not entitled to any refund without the written consent of the owner(s) of ASN Consulting.</p>
      <p className={shared.hhaPara}><strong>Binding:</strong> I hereby expressly recognize that this Agreement is binding, and I have released any and all claims against the indemnified parties resulting from my use of ASN Consulting, including any claims caused by the negligence of the indemnified parties.</p>
      <p className={shared.hhaPara}>With the use of ASN Consulting services and/or any donation you agree to the following: We are not lawyers nor will we offer legal advice. By use of ASN Consulting Services and website content, you hereby agree you are not a public official, agent or legal person of any government (STATE or FEDERAL) or public office. You agree that you have no oaths and hereby repudiate any allegiance you may have. You agree that the owner(s) of ASN Consulting is not responsible for any errors made in the creation of your documents or in the process of correcting your status. ASN Consulting is simply providing a service of putting the information you have provided into your documents and/or providing guidance of the process the way we see fit. You are fully responsible for your actions, choices, and results. Our consulting services are for informational and educational purposes only. We are not providing any tax, legal or financial advice.</p>
      <p className={`${shared.hhaPara} ${shared.hhaFinal}`}>I HAVE CAREFULLY READ THIS AGREEMENT AND UNDERSTAND ITS CONTENTS. BY SIGNING MY NAME, I AM AWARE AND CONSENT TO SIGNING THIS AGREEMENT OF MY OWN FREE WILL. I RESERVE ALL MY RIGHTS NOT WAIVED, WITHOUT PREJUDICE, AND AGREE TO THIS HOLD HARMLESS AGREEMENT, WITHOUT THE UNITED STATES.</p>
    </div>
  );
}

// ── Form state ─────────────────────────────────────────────────────────────

const emptyForm = {
  firstNames: '', middleNames: '', lastName: '',
  county: '', city: '', address: '', postOfficeAddress: '',
  birthdate: '', gender: '', maidenName: '',
  bornInAmerica: '', birthCounty: '', birthCity: '', birthState: '',
  birthCityCountry: '', naturalizedState: '',
  fatherName: '', motherName: '', motherMaidenName: '',
  parentsMarried: '', weddingDate: '', weddingLocation: '',
  stateDemonym: '', ssn: '', registeredToVote: '', voterRegistrationOffice: '',
  email: '',
};

// ── Main inner component (uses useSearchParams) ────────────────────────────

function DFYIntakeInner() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [pageState, setPageState] = useState<PageState>('loading');

  // HHA
  const [hhaName, setHhaName] = useState('');
  const [hhaAgreed, setHhaAgreed] = useState(false);
  const [hhaLoading, setHhaLoading] = useState(false);
  const [hhaError, setHhaError] = useState('');

  // Intake
  const [photo, setPhoto] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [form, setForm] = useState({ ...emptyForm, email: emailParam });
  const [intakeLoading, setIntakeLoading] = useState(false);
  const [intakeError, setIntakeError] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  const setField = (key: keyof typeof emptyForm, val: string) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  // ── Status check on mount ──────────────────────────────────────────────

  useEffect(() => {
    async function checkStatus() {
      if (!emailParam) {
        setPageState('hha');
        return;
      }
      try {
        const res = await fetch(`/api/dfy/intake-status?email=${encodeURIComponent(emailParam)}`);
        if (!res.ok) { setPageState('hha'); return; }
        const data = await res.json();
        if (data.intake_submitted) {
          setPageState('already_done');
        } else if (data.hha_signed) {
          setPageState('intake');
        } else {
          setPageState('hha');
        }
      } catch {
        setPageState('hha');
      }
    }
    checkStatus();
  }, [emailParam]);

  // ── HHA submit ─────────────────────────────────────────────────────────

  const handleHHASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hhaName.trim() || !hhaAgreed) return;
    setHhaLoading(true);
    setHhaError('');
    try {
      const res = await fetch('/api/dfy/sign-hha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: hhaName.trim(), agreed: true }),
      });
      const data = await res.json();
      if (data.success) {
        setPageState('intake');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setHhaError('Something went wrong. Please try again.');
        setHhaLoading(false);
      }
    } catch {
      setHhaError('Something went wrong. Please try again.');
      setHhaLoading(false);
    }
  };

  // ── Photo handlers ─────────────────────────────────────────────────────

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) setPhoto(file);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(file);
  };

  // ── Intake submit ──────────────────────────────────────────────────────

  const handleIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIntakeLoading(true);
    setIntakeError(false);
    try {
      const fd = new FormData();
      if (photo) fd.append('photo', photo);
      (Object.keys(form) as (keyof typeof emptyForm)[]).forEach((k) => {
        if (form[k]) fd.append(k, form[k]);
      });
      const res = await fetch('/api/dfy/submit-intake', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        setPageState('complete');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setIntakeError(true);
        setIntakeLoading(false);
      }
    } catch {
      setIntakeError(true);
      setIntakeLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className={shared.container}>

      {/* Loading */}
      {pageState === 'loading' && (
        <div className={styles.loadingState}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>Loading your enrollment status…</p>
        </div>
      )}

      {/* Stepper (shown for hha and intake states) */}
      {(pageState === 'hha' || pageState === 'intake') && (
        <Stepper state={pageState} />
      )}

      {/* Already done */}
      {pageState === 'already_done' && (
        <div className={shared.card}>
          <div className={shared.cardAccent} />
          <div className={styles.alreadyDone}>
            <div className={styles.alreadyDoneIcon}>
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2 className={styles.alreadyDoneH2}>You&apos;ve already submitted your intake form.</h2>
            <p className={styles.alreadyDonePara}>
              Our team is working on your documents. You will be contacted when they are ready
              for notarization — typically within 5–7 business days.
            </p>
            <p className={styles.alreadyDonePara}>
              Questions?{' '}
              <a href="mailto:support@asnconsulting.co" className={styles.alreadyDoneLink}>
                support@asnconsulting.co
              </a>
            </p>
          </div>
        </div>
      )}

      {/* HHA */}
      {pageState === 'hha' && (
        <div className={shared.card}>
          <div className={shared.cardAccent} />
          <div className={shared.stepTag}>Step 1 of 2</div>
          <h2 className={shared.cardH2}>Hold Harmless Agreement</h2>
          <p className={shared.cardSub}>Please read the agreement carefully and sign below to proceed.</p>

          <div className={shared.agreementBox}>
            <HHAText />
          </div>

          <form onSubmit={handleHHASubmit}>
            <div className={shared.fieldGroup}>
              <label className={shared.label} htmlFor="hha-name">Your Full Legal Name</label>
              <input
                id="hha-name"
                type="text"
                className={shared.input}
                placeholder="Type your full name as your signature"
                value={hhaName}
                onChange={(e) => setHhaName(e.target.value)}
                required
              />
            </div>

            <div className={shared.checkRow}>
              <input
                id="hha-agree"
                type="checkbox"
                checked={hhaAgreed}
                onChange={(e) => setHhaAgreed(e.target.checked)}
                style={{ accentColor: 'var(--gold)', marginTop: 2, flexShrink: 0 }}
              />
              <label htmlFor="hha-agree" className={shared.checkLabel}>
                I have read and agree to the Hold Harmless Agreement above. By typing my name
                and checking this box, I am providing my digital signature and agree to be
                bound by all terms herein.
              </label>
            </div>

            <p className={shared.timestampNote}>
              Your signature, IP address, and the date and time of signing will be recorded.
            </p>

            {hhaError && <p className={shared.errorMsg}>{hhaError}</p>}

            <button
              type="submit"
              className={shared.submitBtn}
              disabled={!hhaName.trim() || !hhaAgreed || hhaLoading}
            >
              {hhaLoading ? 'Recording…' : 'I Agree — Proceed to Intake Form →'}
            </button>
          </form>
        </div>
      )}

      {/* Intake form */}
      {pageState === 'intake' && (
        <div className={shared.card}>
          <div className={shared.cardAccent} />
          <div className={shared.stepTag}>Step 2 of 2</div>
          <h2 className={shared.cardH2}>Client Intake Form</h2>
          <p className={shared.cardSub}>
            Please complete all fields accurately. This information is used to prepare your
            documents. Double-check everything — especially names and dates.
          </p>

          <form onSubmit={handleIntakeSubmit}>

            {/* Photo */}
            <div className={shared.fieldGroup}>
              <label className={shared.label}>Passport-Style Photo</label>
              <p className={shared.helperText}>
                Upload a photo from the shoulders up — passport or driver&apos;s license style.
                A selfie against a plain wall or background is fine.
              </p>
              <input ref={photoInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
              <div
                className={`${shared.dropZone} ${isDragOver ? shared.dropZoneOver : ''}`}
                onClick={() => photoInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                onDragEnter={() => setIsDragOver(true)}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
              >
                {photo ? (
                  <div className={shared.dropZoneSelected}>
                    <span className={shared.dropFileName}>{photo.name}</span>
                    <button type="button" className={shared.removePhoto} onClick={(e) => { e.stopPropagation(); setPhoto(null); if (photoInputRef.current) photoInputRef.current.value = ''; }}>Remove</button>
                  </div>
                ) : (
                  <>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <p className={shared.dropText}>Click to upload or drag and drop</p>
                    <p className={shared.dropSub}>JPG, PNG or HEIC — max 10MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Name */}
            <div className={shared.sectionHeading}>Your Name Information</div>
            <div className={shared.fieldGroup}>
              <label className={shared.label} htmlFor="firstNames">Your First Name(s)</label>
              <p className={shared.helperText}>List all names separated by semi-colon with no spaces, starting with your current name. Example: Michael;Steven</p>
              <textarea id="firstNames" className={shared.textarea} rows={2} value={form.firstNames} onChange={(e) => setField('firstNames', e.target.value)} />
            </div>
            <div className={shared.fieldGroup}>
              <label className={shared.label} htmlFor="middleNames">Your Middle Name(s)</label>
              <p className={shared.helperText}>List all middle names starting with current, separated by semi-colons. Example: James;Robert</p>
              <input id="middleNames" type="text" className={shared.input} value={form.middleNames} onChange={(e) => setField('middleNames', e.target.value)} />
            </div>
            <div className={shared.fieldGroup}>
              <label className={shared.label} htmlFor="lastName">Current Last Name</label>
              <p className={shared.helperText}>Your current last name followed by any previous last names, separated by semi-colons. Example: Smith;Jones</p>
              <input id="lastName" type="text" className={shared.input} value={form.lastName} onChange={(e) => setField('lastName', e.target.value)} />
            </div>

            {/* Location */}
            <div className={shared.sectionHeading}>Where You Currently Live</div>
            <div className={shared.twoCol}>
              <div className={shared.fieldGroup}>
                <label className={shared.label} htmlFor="county">County You Currently Live In</label>
                <input id="county" type="text" className={shared.input} placeholder="ex. Bradley" value={form.county} onChange={(e) => setField('county', e.target.value)} />
              </div>
              <div className={shared.fieldGroup}>
                <label className={shared.label} htmlFor="city">City You Currently Live In</label>
                <input id="city" type="text" className={shared.input} placeholder="ex. Chattanooga" value={form.city} onChange={(e) => setField('city', e.target.value)} />
              </div>
            </div>
            <div className={shared.fieldGroup}>
              <label className={shared.label} htmlFor="address">Current Address with Zipcode</label>
              <input id="address" type="text" className={shared.input} placeholder="ex. 123 Pike Street, Chattanooga, Tennessee 37402" value={form.address} onChange={(e) => setField('address', e.target.value)} />
            </div>
            <div className={shared.fieldGroup}>
              <label className={shared.label} htmlFor="postOfficeAddress">Local Post Office Address</label>
              <input id="postOfficeAddress" type="text" className={shared.input} placeholder="ex. 123 Main Street, Hendersonville, Tennessee 39765" value={form.postOfficeAddress} onChange={(e) => setField('postOfficeAddress', e.target.value)} />
            </div>

            {/* Personal */}
            <div className={shared.sectionHeading}>Personal Details</div>
            <div className={shared.fieldGroup}>
              <label className={shared.label} htmlFor="birthdate">Your Birthdate</label>
              <input id="birthdate" type="date" className={shared.input} value={form.birthdate} onChange={(e) => setField('birthdate', e.target.value)} />
            </div>
            <div className={shared.fieldGroup}>
              <label className={shared.label}>Please provide your gender</label>
              <div className={shared.radioRow}>
                <label className={shared.radioLabel}><input type="radio" name="gender" value="Man" checked={form.gender === 'Man'} onChange={() => setField('gender', 'Man')} style={{ accentColor: 'var(--gold)' }} />Man</label>
                <label className={shared.radioLabel}><input type="radio" name="gender" value="Woman" checked={form.gender === 'Woman'} onChange={() => setField('gender', 'Woman')} style={{ accentColor: 'var(--gold)' }} />Woman</label>
              </div>
            </div>
            <div className={shared.fieldGroup}>
              <label className={shared.label} htmlFor="maidenName">Maiden Name</label>
              <p className={shared.helperText}>Leave blank if you are a man.</p>
              <input id="maidenName" type="text" className={shared.input} value={form.maidenName} onChange={(e) => setField('maidenName', e.target.value)} />
            </div>

            {/* Birth */}
            <div className={shared.sectionHeading}>Birth Information</div>
            <div className={shared.fieldGroup}>
              <label className={shared.label}>Were you born in America?</label>
              <div className={shared.radioRow}>
                <label className={shared.radioLabel}><input type="radio" name="bornInAmerica" value="yes" checked={form.bornInAmerica === 'yes'} onChange={() => setField('bornInAmerica', 'yes')} style={{ accentColor: 'var(--gold)' }} />Yes</label>
                <label className={shared.radioLabel}><input type="radio" name="bornInAmerica" value="no" checked={form.bornInAmerica === 'no'} onChange={() => setField('bornInAmerica', 'no')} style={{ accentColor: 'var(--gold)' }} />No, I&apos;m naturalized or green card holder</label>
              </div>
            </div>
            {form.bornInAmerica === 'yes' && (
              <>
                <div className={shared.twoCol}>
                  <div className={shared.fieldGroup}><label className={shared.label} htmlFor="birthCounty">Birth County</label><input id="birthCounty" type="text" className={shared.input} placeholder="ex. Bradley" value={form.birthCounty} onChange={(e) => setField('birthCounty', e.target.value)} /></div>
                  <div className={shared.fieldGroup}><label className={shared.label} htmlFor="birthCity">Birth City</label><input id="birthCity" type="text" className={shared.input} placeholder="ex. Atlanta" value={form.birthCity} onChange={(e) => setField('birthCity', e.target.value)} /></div>
                </div>
                <div className={shared.fieldGroup}><label className={shared.label} htmlFor="birthState">Birth State</label><input id="birthState" type="text" className={shared.input} placeholder="ex. Texas" value={form.birthState} onChange={(e) => setField('birthState', e.target.value)} /></div>
              </>
            )}
            {form.bornInAmerica === 'no' && (
              <>
                <div className={shared.fieldGroup}><label className={shared.label} htmlFor="birthCityCountry">City and Country Born In</label><input id="birthCityCountry" type="text" className={shared.input} placeholder="ex. Montreal, Canada" value={form.birthCityCountry} onChange={(e) => setField('birthCityCountry', e.target.value)} /></div>
                <div className={shared.fieldGroup}><label className={shared.label} htmlFor="naturalizedState">State You Were Naturalized In</label><input id="naturalizedState" type="text" className={shared.input} placeholder="ex. Texas" value={form.naturalizedState} onChange={(e) => setField('naturalizedState', e.target.value)} /></div>
              </>
            )}

            {/* Parents */}
            <div className={shared.sectionHeading}>Parents Information</div>
            <div className={shared.fieldGroup}>
              <label className={shared.label} htmlFor="fatherName">Your Father&apos;s First, Middle, and Last Names</label>
              <input id="fatherName" type="text" className={shared.input} placeholder="ex. John Michael Doe" value={form.fatherName} onChange={(e) => setField('fatherName', e.target.value)} />
            </div>
            <div className={shared.fieldGroup}>
              <label className={shared.label} htmlFor="motherName">Your Mother&apos;s Full Name When She Married Your Father</label>
              <p className={shared.helperText}>If your parents did not marry, provide her first, middle, and maiden name only.</p>
              <textarea id="motherName" className={shared.textarea} rows={2} placeholder="ex. Michelle Ann Doe" value={form.motherName} onChange={(e) => setField('motherName', e.target.value)} />
            </div>
            <div className={shared.fieldGroup}>
              <label className={shared.label} htmlFor="motherMaidenName">Your Mother&apos;s Maiden Name</label>
              <input id="motherMaidenName" type="text" className={shared.input} placeholder="ex. Jackson" value={form.motherMaidenName} onChange={(e) => setField('motherMaidenName', e.target.value)} />
            </div>
            <div className={shared.fieldGroup}>
              <label className={shared.label}>Were your parents married when you were born?</label>
              <div className={shared.radioRow}>
                <label className={shared.radioLabel}><input type="radio" name="parentsMarried" value="yes" checked={form.parentsMarried === 'yes'} onChange={() => setField('parentsMarried', 'yes')} style={{ accentColor: 'var(--gold)' }} />Yes</label>
                <label className={shared.radioLabel}><input type="radio" name="parentsMarried" value="no" checked={form.parentsMarried === 'no'} onChange={() => setField('parentsMarried', 'no')} style={{ accentColor: 'var(--gold)' }} />No</label>
              </div>
            </div>
            {form.parentsMarried === 'yes' && (
              <>
                <div className={shared.fieldGroup}><label className={shared.label} htmlFor="weddingDate">Parents&apos; Wedding Date</label><input id="weddingDate" type="date" className={shared.input} value={form.weddingDate} onChange={(e) => setField('weddingDate', e.target.value)} /></div>
                <div className={shared.fieldGroup}><label className={shared.label} htmlFor="weddingLocation">Parents&apos; Wedding City and State</label><input id="weddingLocation" type="text" className={shared.input} placeholder="ex. Chicago, Illinois" value={form.weddingLocation} onChange={(e) => setField('weddingLocation', e.target.value)} /></div>
              </>
            )}

            {/* Identity */}
            <div className={shared.sectionHeading}>Identity &amp; Records</div>
            <div className={shared.fieldGroup}>
              <label className={shared.label} htmlFor="stateDemonym">What Do You Consider Yourself Based on Your State?</label>
              <p className={shared.helperText}>If you live in Texas you are a Texan. In California, a Californian. In Tennessee, a Tennessean.</p>
              <input id="stateDemonym" type="text" className={shared.input} placeholder="ex. Tennessean" value={form.stateDemonym} onChange={(e) => setField('stateDemonym', e.target.value)} />
            </div>
            <div className={shared.fieldGroup}>
              <label className={shared.label} htmlFor="ssn">Social Security Number</label>
              <p className={shared.helperText}>This information is stored securely and used to prepare your documents.</p>
              <input id="ssn" type="text" className={shared.input} placeholder="111-22-3333" pattern="\d{3}-\d{2}-\d{4}" value={form.ssn} onChange={(e) => setField('ssn', e.target.value)} />
            </div>
            <div className={shared.fieldGroup}>
              <label className={shared.label}>Are you registered to vote?</label>
              <div className={shared.radioRow}>
                <label className={shared.radioLabel}><input type="radio" name="registeredToVote" value="yes" checked={form.registeredToVote === 'yes'} onChange={() => setField('registeredToVote', 'yes')} style={{ accentColor: 'var(--gold)' }} />Yes</label>
                <label className={shared.radioLabel}><input type="radio" name="registeredToVote" value="no" checked={form.registeredToVote === 'no'} onChange={() => setField('registeredToVote', 'no')} style={{ accentColor: 'var(--gold)' }} />No</label>
              </div>
            </div>
            {form.registeredToVote === 'yes' && (
              <div className={shared.fieldGroup}>
                <label className={shared.label} htmlFor="voterRegistrationOffice">Voter Registration Office — Name and Address</label>
                <p className={shared.helperText}>Provide the full name of the person in charge of your local voter registration office and their address.</p>
                <textarea id="voterRegistrationOffice" className={shared.textarea} rows={3} placeholder="ex. James Smith; 123 Main Street, Nashville, Tennessee 37489" value={form.voterRegistrationOffice} onChange={(e) => setField('voterRegistrationOffice', e.target.value)} />
              </div>
            )}
            <div className={shared.fieldGroup}>
              <label className={shared.label} htmlFor="email">Your Email Address</label>
              <p className={shared.helperText}>This is where we will send updates about your documents.</p>
              <input id="email" type="email" className={shared.input} value={form.email} onChange={(e) => setField('email', e.target.value)} required />
            </div>

            {intakeError && <p className={shared.errorMsg}>Something went wrong. Please try again.</p>}

            <button type="submit" className={shared.submitBtn} disabled={intakeLoading}>
              {intakeLoading ? 'Submitting…' : 'Submit Intake Form →'}
            </button>
          </form>
        </div>
      )}

      {/* Success */}
      {pageState === 'complete' && (
        <div className={`${shared.card} ${shared.successCard}`}>
          <div className={shared.cardAccent} />
          <div className={shared.successIcon}>
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2 className={shared.successH2}>You&apos;re all set.</h2>
          <p className={shared.successPara}>Thank you for completing your intake form. We have received everything we need to begin preparing your documents.</p>
          <p className={shared.successPara}>You will receive a confirmation email shortly. Our team will reach out if we need any clarification on your information.</p>
          <p className={shared.successPara}>Most clients receive their completed documents within 5–7 business days. Once your documents are ready we will contact you with next steps for notarization.</p>
          <a href="/" className={shared.successBtn}>Back to Home</a>
          <p className={shared.successNote}>Questions? Email support@asnconsulting.co</p>
        </div>
      )}

    </div>
  );
}

// ── Page export ────────────────────────────────────────────────────────────

export default function DFYIntakePage() {
  return (
    <>
      <Nav />
      <main className={shared.main}>
        <Suspense fallback={
          <div className={shared.container}>
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p className={styles.loadingText}>Loading…</p>
            </div>
          </div>
        }>
          <DFYIntakeInner />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
