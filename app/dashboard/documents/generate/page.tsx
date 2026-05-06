'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import styles from './page.module.css';

interface Profile {
  plan_tier: string;
  purchased_services: string[] | null;
  submissions_used: number;
  submission_limit_override: number | null;
}

const SUBMISSION_LIMITS: Record<string, number> = {
  individual: 1,
  partner: 2,
  family: 4,
  roe: 1,
};

const INITIAL_FORM = {
  first_name: '',
  middle_name: '',
  last_name: '',
  date_of_birth: '',
  gender: '',
  maiden_name: '',
  current_county: '',
  current_street: '',
  current_city: '',
  current_state: '',
  current_zip: '',
  born_in_america: '',
  birth_county: '',
  birth_city: '',
  birth_state: '',
  foreign_birth_location: '',
  post_office_address: '',
  post_office_zip: '',
  father_name: '',
  mother_name_married: '',
  mother_maiden_name: '',
  parents_married: '',
  parents_wedding_date: '',
  parents_wedding_location: '',
  state_identity: '',
  ssn: '',
  include_roe: 'No',
  business_roe: 'No',
  has_political_status: 'Yes',
  photo_base64: '',
};

export default function GeneratePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState(false);
  const [invalidFields, setInvalidFields] = useState<Set<string>>(new Set());
  const [formData, setFormData] = useState(INITIAL_FORM);

  useEffect(() => {
    async function loadProfile() {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data } = await supabase
          .from('profiles')
          .select('plan_tier, purchased_services, submissions_used, submission_limit_override')
          .eq('id', user.id)
          .single();
        if (data) setProfile(data as Profile);
      } finally {
        setProfileLoading(false);
      }
    }
    loadProfile();
  }, []);

  // Derived gating — recomputed on every render from profile
  const hasStatusCorrection = profile
    ? (profile.purchased_services?.includes('status_correction') ||
       ['individual', 'partner', 'family'].includes(profile.plan_tier))
    : false;

  const hasROE = profile
    ? (profile.purchased_services?.includes('roe') || profile.plan_tier === 'roe')
    : false;

  const submissionLimit =
    profile?.submission_limit_override ??
    SUBMISSION_LIMITS[profile?.plan_tier ?? ''] ??
    1;

  const submissionsRemaining = Math.max(
    0,
    submissionLimit - (profile?.submissions_used ?? 0)
  );

  // Sync plan-controlled defaults when profile first loads
  useEffect(() => {
    if (!profile) return;
    setFormData(prev => ({
      ...prev,
      include_roe: hasROE ? 'Yes' : 'No',
      has_political_status: hasStatusCorrection ? 'Yes' : 'No',
    }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (invalidFields.has(name)) {
      setInvalidFields(prev => {
        const s = new Set(prev);
        s.delete(name);
        return s;
      });
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      setFormData(prev => ({ ...prev, photo_base64: reader.result as string }));
    reader.readAsDataURL(file);
  };

  function getRequiredFields(): string[] {
    const fields: string[] = [
      'first_name', 'last_name', 'date_of_birth', 'gender',
      'current_county', 'current_street', 'current_city',
      'current_state', 'current_zip', 'state_identity',
    ];
    if (formData.gender === 'Woman') fields.push('maiden_name');
    if (hasStatusCorrection) {
      fields.push(
        'born_in_america', 'birth_state',
        'post_office_address', 'post_office_zip',
        'father_name', 'mother_name_married', 'mother_maiden_name',
        'parents_married',
      );
      if (formData.born_in_america === 'Yes') {
        fields.push('birth_county', 'birth_city');
      }
      if (formData.parents_married === 'Yes') {
        fields.push('parents_wedding_date', 'parents_wedding_location');
      }
    }
    if (hasROE) fields.push('ssn');
    return fields;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required = getRequiredFields();
    const empty = required.filter(
      f => !formData[f as keyof typeof formData]
    );
    if (empty.length > 0) {
      setValidationError(true);
      setInvalidFields(new Set(empty));
      const el = document.querySelector(`[name="${empty[0]}"]`) as HTMLElement;
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setValidationError(false);
    setInvalidFields(new Set());
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/dashboard/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_data: formData }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setError(err.error ?? 'Something went wrong. Please try again.');
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download =
        `ASN Documents - ${formData.first_name} ${formData.last_name}.zip`.trim();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccess(true);
      setProfile(prev =>
        prev
          ? { ...prev, submissions_used: (prev.submissions_used ?? 0) + 1 }
          : prev
      );
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  function inputClass(name: string) {
    return [styles.input, invalidFields.has(name) ? styles.invalid : '']
      .filter(Boolean)
      .join(' ');
  }

  function selectClass(name: string) {
    return [styles.select, invalidFields.has(name) ? styles.invalid : '']
      .filter(Boolean)
      .join(' ');
  }

  // ── Loading ────────────────────────────────────────────────────────────
  if (profileLoading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
      </div>
    );
  }

  // ── Submission limit reached ───────────────────────────────────────────
  if (submissionsRemaining <= 0) {
    return (
      <div className={styles.page}>
        <div className={styles.limitCard}>
          <div className={styles.limitIcon}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="1.5" />
              <rect x="13" y="19" width="14" height="10" rx="2"
                stroke="currentColor" strokeWidth="1.5" />
              <path d="M15 19v-4a5 5 0 0 1 10 0v4"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className={styles.limitHeading}>Submission Limit Reached</h2>
          <p className={styles.limitBody}>
            You have used all submissions included in your plan.
            Contact support@asnconsulting.co if you need assistance.
          </p>
          <a href="mailto:support@asnconsulting.co" className={styles.contactBtn}>
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  // ── Pill colour based on remaining count ──────────────────────────────
  const pillClass = submissionsRemaining === 1
    ? `${styles.submissionPill} ${styles.low}`
    : styles.submissionPill;

  // ── Determine section numbering based on plan ─────────────────────────
  let sectionNum = 1;
  const sNum = () => sectionNum++;

  return (
    <div className={styles.page}>

      {/* Breadcrumb */}
      <nav className={styles.breadcrumb}>
        <Link href="/dashboard">Dashboard</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <Link href="/dashboard/documents">My Documents</Link>
        <span className={styles.breadcrumbSep}>/</span>
        <span>Generate Documents</span>
      </nav>

      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.heading}>Document Generator</h1>
        <p className={styles.subtext}>
          Fill out the form below completely and accurately. Your documents will
          be generated and downloaded as a ZIP file.
        </p>
        <span className={pillClass}>
          {submissionsRemaining} submission{submissionsRemaining !== 1 ? 's' : ''} remaining
        </span>
      </div>

      {/* Plan banner */}
      <div className={styles.planBanner}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: 'var(--gold)' }}>
          <path d="M8 1L10.5 5.5H15L11.5 8.5L13 13L8 10L3 13L4.5 8.5L1 5.5H5.5L8 1Z"
            stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
        <span className={styles.planBannerLabel}>Your plan includes:</span>
        <div className={styles.planPills}>
          {hasStatusCorrection && (
            <span className={styles.servicePill}>Status Correction</span>
          )}
          {hasROE && (
            <span className={styles.servicePill}>Revocation of Election</span>
          )}
        </div>
      </div>

      {/* Error banners */}
      {validationError && (
        <div className={styles.errorBanner}>
          Please fill in all required fields before generating.
        </div>
      )}
      {error && (
        <div className={styles.errorBanner}>{error}</div>
      )}

      <form onSubmit={handleSubmit} noValidate>

        {/* ── Section 1: Personal Information ──────────────────── */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>{sNum()}</div>
            <span className={styles.sectionTitle}>Personal Information</span>
          </div>
          <div className={styles.grid}>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                First Name <span className={styles.req}>*</span>
              </label>
              <input
                className={inputClass('first_name')}
                type="text"
                name="first_name"
                required
                placeholder="e.g. John"
                value={formData.first_name}
                onChange={handleChange}
              />
              <span className={styles.hint}>
                If you have had name changes or nicknames, separate all names
                with a semicolon and no spaces. Example: John;Johnny
              </span>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>Middle Name</label>
              <input
                className={styles.input}
                type="text"
                name="middle_name"
                placeholder="e.g. Joseph"
                value={formData.middle_name}
                onChange={handleChange}
              />
              <span className={styles.hint}>
                Include all middle names separated by semicolons if multiple.
              </span>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Last Name <span className={styles.req}>*</span>
              </label>
              <input
                className={inputClass('last_name')}
                type="text"
                name="last_name"
                required
                placeholder="e.g. Doe"
                value={formData.last_name}
                onChange={handleChange}
              />
              <span className={styles.hint}>
                Include previous last names separated by semicolons if applicable.
              </span>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Date of Birth <span className={styles.req}>*</span>
              </label>
              <input
                className={inputClass('date_of_birth')}
                type="date"
                name="date_of_birth"
                required
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Gender <span className={styles.req}>*</span>
              </label>
              <select
                className={selectClass('gender')}
                name="gender"
                required
                value={formData.gender}
                onChange={handleChange}
              >
                <option value="">— Select —</option>
                <option value="Man">Man</option>
                <option value="Woman">Woman</option>
              </select>
            </div>

            {formData.gender === 'Woman' && (
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Maiden Name (Birth Last Name) <span className={styles.req}>*</span>
                </label>
                <input
                  className={inputClass('maiden_name')}
                  type="text"
                  name="maiden_name"
                  placeholder="e.g. Jenkins"
                  value={formData.maiden_name}
                  onChange={handleChange}
                />
              </div>
            )}

          </div>
        </div>

        {/* ── Section 2: Current Address ────────────────────────── */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>{sNum()}</div>
            <span className={styles.sectionTitle}>Current Address</span>
          </div>
          <div className={styles.grid}>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                County <span className={styles.req}>*</span>
              </label>
              <input
                className={inputClass('current_county')}
                type="text"
                name="current_county"
                required
                placeholder="e.g. Broward"
                value={formData.current_county}
                onChange={handleChange}
              />
            </div>

            <div className={`${styles.fieldGroup} ${styles.gridFull}`}>
              <label className={styles.label}>
                Street Address <span className={styles.req}>*</span>
              </label>
              <input
                className={inputClass('current_street')}
                type="text"
                name="current_street"
                required
                placeholder="Spelled out, no abbreviations — e.g. One Hundred Twenty Three Main Street"
                value={formData.current_street}
                onChange={handleChange}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                City <span className={styles.req}>*</span>
              </label>
              <input
                className={inputClass('current_city')}
                type="text"
                name="current_city"
                required
                placeholder="e.g. Miami"
                value={formData.current_city}
                onChange={handleChange}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                State — Spelled Out <span className={styles.req}>*</span>
              </label>
              <input
                className={inputClass('current_state')}
                type="text"
                name="current_state"
                required
                placeholder="e.g. California"
                value={formData.current_state}
                onChange={handleChange}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Zip Code <span className={styles.req}>*</span>
              </label>
              <input
                className={inputClass('current_zip')}
                type="text"
                name="current_zip"
                required
                placeholder="e.g. 33101"
                maxLength={10}
                value={formData.current_zip}
                onChange={handleChange}
              />
            </div>

          </div>
        </div>

        {/* ── Section 3: Birth Information (Status Correction only) ── */}
        {hasStatusCorrection && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>{sNum()}</div>
              <span className={styles.sectionTitle}>Birth Information</span>
            </div>
            <div className={styles.grid}>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Born in America? <span className={styles.req}>*</span>
                </label>
                <select
                  className={selectClass('born_in_america')}
                  name="born_in_america"
                  required
                  value={formData.born_in_america}
                  onChange={handleChange}
                >
                  <option value="">— Select —</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No — I&apos;m naturalized</option>
                </select>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Birth State or Naturalized State <span className={styles.req}>*</span>
                </label>
                <input
                  className={inputClass('birth_state')}
                  type="text"
                  name="birth_state"
                  required
                  placeholder="e.g. Tennessee"
                  value={formData.birth_state}
                  onChange={handleChange}
                />
              </div>

              {formData.born_in_america === 'Yes' && (
                <>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      Birth County <span className={styles.req}>*</span>
                    </label>
                    <input
                      className={inputClass('birth_county')}
                      type="text"
                      name="birth_county"
                      required
                      placeholder="e.g. Hamilton"
                      value={formData.birth_county}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      Birth City <span className={styles.req}>*</span>
                    </label>
                    <input
                      className={inputClass('birth_city')}
                      type="text"
                      name="birth_city"
                      required
                      placeholder="e.g. Chicago"
                      value={formData.birth_city}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {formData.born_in_america === 'No' && (
                <div className={`${styles.fieldGroup} ${styles.gridFull}`}>
                  <label className={styles.label}>
                    Foreign Birth City and Country
                  </label>
                  <input
                    className={styles.input}
                    type="text"
                    name="foreign_birth_location"
                    placeholder="e.g. Tokyo, Japan"
                    value={formData.foreign_birth_location}
                    onChange={handleChange}
                  />
                </div>
              )}

            </div>
          </div>
        )}

        {/* ── Section 4: Post Office (Status Correction only) ─── */}
        {hasStatusCorrection && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>{sNum()}</div>
              <span className={styles.sectionTitle}>Post Office / Mailing Address</span>
            </div>
            <p className={styles.sectionHint}>
              This is the mailing address that appears on official documents —
              may be different from your current residence.
            </p>
            <div className={styles.grid}>

              <div className={`${styles.fieldGroup} ${styles.gridFull}`}>
                <label className={styles.label}>
                  Post Office Address <span className={styles.req}>*</span>
                </label>
                <input
                  className={inputClass('post_office_address')}
                  type="text"
                  name="post_office_address"
                  required
                  placeholder="e.g. 123 Main Street, Hendersonville, Tennessee"
                  value={formData.post_office_address}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Post Office Zip Code <span className={styles.req}>*</span>
                </label>
                <input
                  className={inputClass('post_office_zip')}
                  type="text"
                  name="post_office_zip"
                  required
                  placeholder="e.g. 37075"
                  maxLength={10}
                  value={formData.post_office_zip}
                  onChange={handleChange}
                />
              </div>

            </div>
          </div>
        )}

        {/* ── Section 5: Parental Information (Status Correction only) ── */}
        {hasStatusCorrection && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionBadge}>{sNum()}</div>
              <span className={styles.sectionTitle}>Parental Information</span>
            </div>
            <div className={styles.grid}>

              <div className={`${styles.fieldGroup} ${styles.gridFull}`}>
                <label className={styles.label}>
                  Father&apos;s Full Name <span className={styles.req}>*</span>
                </label>
                <input
                  className={inputClass('father_name')}
                  type="text"
                  name="father_name"
                  required
                  placeholder="First Middle Last"
                  value={formData.father_name}
                  onChange={handleChange}
                />
              </div>

              <div className={`${styles.fieldGroup} ${styles.gridFull}`}>
                <label className={styles.label}>
                  Mother&apos;s Full Name (Married) <span className={styles.req}>*</span>
                </label>
                <input
                  className={inputClass('mother_name_married')}
                  type="text"
                  name="mother_name_married"
                  required
                  placeholder="First Middle Last as married"
                  value={formData.mother_name_married}
                  onChange={handleChange}
                />
                <span className={styles.hint}>
                  If parents were not married, enter her first, middle, and
                  maiden last name.
                </span>
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Mother&apos;s Maiden Name — Last Name Only{' '}
                  <span className={styles.req}>*</span>
                </label>
                <input
                  className={inputClass('mother_maiden_name')}
                  type="text"
                  name="mother_maiden_name"
                  required
                  placeholder="e.g. Jackson"
                  value={formData.mother_maiden_name}
                  onChange={handleChange}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Were Parents Married at Birth? <span className={styles.req}>*</span>
                </label>
                <select
                  className={selectClass('parents_married')}
                  name="parents_married"
                  required
                  value={formData.parents_married}
                  onChange={handleChange}
                >
                  <option value="">— Select —</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>

              {formData.parents_married === 'Yes' && (
                <>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      Parents&apos; Wedding Date <span className={styles.req}>*</span>
                    </label>
                    <input
                      className={inputClass('parents_wedding_date')}
                      type="text"
                      name="parents_wedding_date"
                      placeholder="e.g. 9/15/1983"
                      value={formData.parents_wedding_date}
                      onChange={handleChange}
                    />
                  </div>
                  <div className={styles.fieldGroup}>
                    <label className={styles.label}>
                      Parents&apos; Wedding City and State{' '}
                      <span className={styles.req}>*</span>
                    </label>
                    <input
                      className={inputClass('parents_wedding_location')}
                      type="text"
                      name="parents_wedding_location"
                      placeholder="e.g. Chicago, Illinois"
                      value={formData.parents_wedding_location}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

            </div>
          </div>
        )}

        {/* ── Section 6: Identity & Government ─────────────────── */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>{sNum()}</div>
            <span className={styles.sectionTitle}>Identity &amp; Government</span>
          </div>
          <div className={styles.grid}>

            <div className={`${styles.fieldGroup} ${styles.gridFull}`}>
              <label className={styles.label}>
                State Identity — What do you consider yourself?{' '}
                <span className={styles.req}>*</span>
              </label>
              <input
                className={inputClass('state_identity')}
                type="text"
                name="state_identity"
                required
                placeholder="e.g. Tennessean, Texan, Californian"
                value={formData.state_identity}
                onChange={handleChange}
              />
              <span className={styles.hint}>
                Based on the state you currently live in. If you live in Texas
                you are a Texan. In Tennessee, a Tennessean.
              </span>
            </div>

            {/* SSN — shown only for ROE users */}
            {hasROE ? (
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Social Security Number <span className={styles.req}>*</span>
                </label>
                <input
                  className={inputClass('ssn')}
                  type="text"
                  name="ssn"
                  required
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                  value={formData.ssn}
                  onChange={handleChange}
                />
              </div>
            ) : (
              <input type="hidden" name="ssn" value="" />
            )}

          </div>
        </div>

        {/* ── Section 7: Document Options ───────────────────────── */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionBadge}>{sNum()}</div>
            <span className={styles.sectionTitle}>
              {hasROE && !hasStatusCorrection
                ? 'ROE Document Options'
                : 'Document Options'}
            </span>
          </div>
          <div className={styles.grid}>

            {/* Hidden plan-controlled fields */}
            <input type="hidden" name="include_roe" value={hasROE ? 'Yes' : 'No'} />
            <input type="hidden" name="has_political_status" value={hasStatusCorrection ? 'Yes' : 'No'} />

            {/* ROE — locked for SC-only plans */}
            {hasStatusCorrection && !hasROE && (
              <div className={`${styles.fieldGroup} ${styles.gridFull}`}>
                <div className={styles.labelRow}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
                    className={styles.lockIcon}>
                    <rect x="3" y="6.5" width="8" height="6" rx="1.5"
                      stroke="currentColor" strokeWidth="1.2" />
                    <path d="M4.5 6.5V4.5a2.5 2.5 0 0 1 5 0v2"
                      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <span className={styles.label}>ROE Documents</span>
                </div>
                <input type="hidden" name="business_roe" value="No" />
                <div className={styles.lockedRow}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                    style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                    <rect x="2" y="5.5" width="8" height="5.5" rx="1.5"
                      stroke="currentColor" strokeWidth="1.2" />
                    <path d="M3.5 5.5V4a2.5 2.5 0 0 1 5 0v1.5"
                      stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <span className={styles.lockedText}>
                    ROE documents: Not included in your plan
                  </span>
                </div>
              </div>
            )}

            {/* Business ROE — shown when plan includes ROE */}
            {hasROE && (
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Business ROE Version?</label>
                <select
                  className={styles.select}
                  name="business_roe"
                  value={formData.business_roe}
                  onChange={handleChange}
                >
                  <option value="No">No — Standard</option>
                  <option value="Yes">Yes — Business Version</option>
                </select>
                <span className={styles.hint}>
                  Select &ldquo;Yes&rdquo; if you have a business and want the
                  business version of the ROE documents.
                </span>
              </div>
            )}

            {/* Client photo — Status Correction docs only */}
            {hasStatusCorrection && (
              <div className={`${styles.fieldGroup} ${styles.gridFull}`}>
                <label className={styles.label}>Client Photo</label>
                <input
                  className={styles.input}
                  type="file"
                  name="photo"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handlePhotoChange}
                />
                <span className={styles.hint}>
                  JPG or PNG — appears in the Status Correction Documents.
                </span>
                {formData.photo_base64 && (
                  <span className={styles.hintGold}>Photo selected.</span>
                )}
              </div>
            )}

          </div>
        </div>

        {/* ── Submit ─────────────────────────────────────────────── */}
        <div className={styles.submitArea}>
          <div className={styles.submitLeft}>
            <p className={styles.submitTitle}>Ready to generate your documents?</p>
            <p className={styles.submitSubtext}>
              This will use 1 of your {submissionsRemaining} remaining
              submission{submissionsRemaining !== 1 ? 's' : ''}.
            </p>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className={styles.submitBtn}
          >
            {submitting && <span className={styles.btnSpinner} />}
            {submitting ? 'Generating… Please wait' : 'Generate My Documents →'}
          </button>
        </div>

      </form>

      {/* Success banner */}
      {success && (
        <div className={styles.successBanner}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
            style={{ flexShrink: 0 }}>
            <circle cx="10" cy="10" r="9" stroke="#6BC47E" strokeWidth="1.5" />
            <path d="M6 10l3 3 5-6" stroke="#6BC47E" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={styles.successBannerText}>
            Your documents have been generated and downloaded. Check your
            Downloads folder for the ZIP file.
          </span>
          <button
            className={styles.successDismiss}
            onClick={() => setSuccess(false)}
            aria-label="Dismiss"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" />
            </svg>
          </button>
        </div>
      )}

    </div>
  );
}
