'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

interface FormData {
  // Personal
  first_name: string;
  middle_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  maiden_name: string;
  // Current address
  current_county: string;
  current_street: string;
  current_city: string;
  current_state: string;
  current_zip: string;
  // Birth info
  born_in_america: string;
  birth_county: string;
  birth_city: string;
  birth_state: string;
  foreign_birth_location: string;
  // Post office
  post_office_address: string;
  post_office_zip: string;
  // Parental
  father_name: string;
  mother_name_married: string;
  mother_maiden_name: string;
  parents_married: string;
  parents_wedding_date: string;
  parents_wedding_location: string;
  // Identity
  state_identity: string;
  ssn: string;
  // Document options
  include_roe: string;
  business_roe: string;
  has_political_status: string;
  // Photo (for ROE Testimony pages 14-15)
  photo_base64: string;
}

const EMPTY: FormData = {
  first_name: '', middle_name: '', last_name: '', date_of_birth: '',
  gender: '', maiden_name: '',
  current_county: '', current_street: '', current_city: '', current_state: '', current_zip: '',
  born_in_america: '', birth_county: '', birth_city: '', birth_state: '', foreign_birth_location: '',
  post_office_address: '', post_office_zip: '',
  father_name: '', mother_name_married: '', mother_maiden_name: '',
  parents_married: '', parents_wedding_date: '', parents_wedding_location: '',
  state_identity: '', ssn: '',
  include_roe: '', business_roe: 'No', has_political_status: 'Yes',
  photo_base64: '',
};

export default function GeneratePage() {
  const [form, setForm] = useState<FormData>(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [clientName, setClientName] = useState('');

  function set(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setForm(f => ({ ...f, photo_base64: reader.result as string }));
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form_data: form }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: 'Unknown error' }));
        setError(data.error ?? 'Generation failed');
        setLoading(false);
        return;
      }

      // Trigger ZIP download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const disposition = res.headers.get('content-disposition') ?? '';
      const match = disposition.match(/filename="(.+?)"/);
      a.download = match?.[1] ?? 'ASN Documents.zip';
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);

      setClientName(`${form.first_name} ${form.last_name}`.trim());
      setSuccess(true);
    } catch (err) {
      setError('Network error — please try again');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.successCard}>
          <div className={styles.successIcon}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <circle cx="26" cy="26" r="25" stroke="#6BC47E" strokeWidth="1.5" />
              <path d="M16 26l7 7 13-15" stroke="#6BC47E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h2 className={styles.successHeading}>Documents generated!</h2>
          <p className={styles.successBody}>
            Your ZIP file for <strong style={{ color: 'var(--cream-muted)' }}>{clientName}</strong> downloaded
            automatically. Check your Downloads folder.<br /><br />
            Your submission has been recorded.
          </p>
          <div className={styles.successActions}>
            <Link href="/dashboard/documents" className={styles.backBtn}>
              Back to Documents
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {loading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.spinner} />
          <p className={styles.loadingText}>
            Generating your documents…<br />
            <small>This may take 20–30 seconds.</small>
          </p>
        </div>
      )}

      <h1 className={styles.heading}>Document Generator</h1>
      <p className={styles.sub}>Fill out all required fields carefully. This uses one of your plan submissions.</p>

      {error && <div className={styles.errorBox}>{error}</div>}

      <form onSubmit={handleSubmit} noValidate>

        {/* ── Section 1: Personal ── */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionNum}>1</span>
            <span className={styles.sectionLabel}>Personal Information</span>
          </div>
          <div className={styles.grid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>First Name <span className={styles.req}>*</span></label>
              <input className={styles.input} type="text" required placeholder="e.g. John" value={form.first_name} onChange={set('first_name')} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Middle Name</label>
              <input className={styles.input} type="text" placeholder="e.g. Joseph" value={form.middle_name} onChange={set('middle_name')} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Last Name <span className={styles.req}>*</span></label>
              <input className={styles.input} type="text" required placeholder="e.g. Doe" value={form.last_name} onChange={set('last_name')} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Date of Birth <span className={styles.req}>*</span></label>
              <input className={styles.input} type="date" required value={form.date_of_birth} onChange={set('date_of_birth')} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Gender <span className={styles.req}>*</span></label>
              <select className={styles.select} required value={form.gender} onChange={set('gender')}>
                <option value="">— Select —</option>
                <option value="Man">Man</option>
                <option value="Woman">Woman</option>
              </select>
            </div>
            {form.gender === 'Woman' && (
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Maiden Name (Birth Last Name) <span className={styles.req}>*</span></label>
                <input className={styles.input} type="text" placeholder="e.g. Jenkins" value={form.maiden_name} onChange={set('maiden_name')} />
              </div>
            )}
          </div>
        </div>

        {/* ── Section 2: Current Address ── */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionNum}>2</span>
            <span className={styles.sectionLabel}>Current Address</span>
          </div>
          <div className={styles.grid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>County <span className={styles.req}>*</span></label>
              <input className={styles.input} type="text" required placeholder="e.g. Broward" value={form.current_county} onChange={set('current_county')} />
            </div>
            <div className={`${styles.fieldGroup} ${styles.gridFull}`}>
              <label className={styles.label}>Street Address <span className={styles.req}>*</span></label>
              <input className={styles.input} type="text" required placeholder="Spelled out, no abbreviations" value={form.current_street} onChange={set('current_street')} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>City <span className={styles.req}>*</span></label>
              <input className={styles.input} type="text" required placeholder="e.g. Miami" value={form.current_city} onChange={set('current_city')} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>State (Spelled Out) <span className={styles.req}>*</span></label>
              <input className={styles.input} type="text" required placeholder="e.g. California" value={form.current_state} onChange={set('current_state')} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Zip Code <span className={styles.req}>*</span></label>
              <input className={styles.input} type="text" required placeholder="e.g. 33101" maxLength={10} value={form.current_zip} onChange={set('current_zip')} />
            </div>
          </div>
        </div>

        {/* ── Section 3: Birth Info ── */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionNum}>3</span>
            <span className={styles.sectionLabel}>Birth Information</span>
          </div>
          <div className={styles.grid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Born in America? <span className={styles.req}>*</span></label>
              <select className={styles.select} required value={form.born_in_america} onChange={set('born_in_america')}>
                <option value="">— Select —</option>
                <option value="Yes">Yes</option>
                <option value="No">No (I&apos;m naturalized)</option>
              </select>
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Birth County <span className={styles.req}>*</span></label>
              <input className={styles.input} type="text" required placeholder="e.g. Hamilton" value={form.birth_county} onChange={set('birth_county')} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Birth City <span className={styles.req}>*</span></label>
              <input className={styles.input} type="text" required placeholder="e.g. Chicago" value={form.birth_city} onChange={set('birth_city')} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Birth State (or Naturalized State) <span className={styles.req}>*</span></label>
              <input className={styles.input} type="text" required placeholder="e.g. Tennessee" value={form.birth_state} onChange={set('birth_state')} />
            </div>
            {form.born_in_america === 'No' && (
              <div className={`${styles.fieldGroup} ${styles.gridFull}`}>
                <label className={styles.label}>Foreign Birth City and Country</label>
                <input className={styles.input} type="text" placeholder="e.g. Tokyo, Japan" value={form.foreign_birth_location} onChange={set('foreign_birth_location')} />
              </div>
            )}
          </div>
        </div>

        {/* ── Section 4: Post Office ── */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionNum}>4</span>
            <span className={styles.sectionLabel}>Post Office / Mailing Address</span>
          </div>
          <p className={styles.hint} style={{ marginBottom: '16px' }}>May differ from current residence — this appears on official documents.</p>
          <div className={styles.grid}>
            <div className={`${styles.fieldGroup} ${styles.gridFull}`}>
              <label className={styles.label}>Post Office Address <span className={styles.req}>*</span></label>
              <input className={styles.input} type="text" required placeholder="e.g. 123 Main Street, Hendersonville, Tennessee" value={form.post_office_address} onChange={set('post_office_address')} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Post Office Zip Code <span className={styles.req}>*</span></label>
              <input className={styles.input} type="text" required placeholder="e.g. 37075" maxLength={10} value={form.post_office_zip} onChange={set('post_office_zip')} />
            </div>
          </div>
        </div>

        {/* ── Section 5: Parental ── */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionNum}>5</span>
            <span className={styles.sectionLabel}>Parental Information</span>
          </div>
          <div className={styles.grid}>
            <div className={`${styles.fieldGroup} ${styles.gridFull}`}>
              <label className={styles.label}>Father&apos;s Full Name <span className={styles.req}>*</span></label>
              <input className={styles.input} type="text" required placeholder="First Middle Last" value={form.father_name} onChange={set('father_name')} />
            </div>
            <div className={`${styles.fieldGroup} ${styles.gridFull}`}>
              <label className={styles.label}>Mother&apos;s Full Name (Married) <span className={styles.req}>*</span></label>
              <input className={styles.input} type="text" required placeholder="First Middle Last as married" value={form.mother_name_married} onChange={set('mother_name_married')} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Mother&apos;s Maiden Name (Last Name Only) <span className={styles.req}>*</span></label>
              <input className={styles.input} type="text" required placeholder="e.g. Jackson" value={form.mother_maiden_name} onChange={set('mother_maiden_name')} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Were Parents Married at Birth? <span className={styles.req}>*</span></label>
              <select className={styles.select} required value={form.parents_married} onChange={set('parents_married')}>
                <option value="">— Select —</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            {form.parents_married === 'Yes' && (
              <>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Parents&apos; Wedding Date <span className={styles.req}>*</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. 9/15/1983" value={form.parents_wedding_date} onChange={set('parents_wedding_date')} />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Parents&apos; Wedding City and State <span className={styles.req}>*</span></label>
                  <input className={styles.input} type="text" placeholder="e.g. Chicago, Illinois" value={form.parents_wedding_location} onChange={set('parents_wedding_location')} />
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Section 6: Identity ── */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionNum}>6</span>
            <span className={styles.sectionLabel}>Identity &amp; Government</span>
          </div>
          <div className={styles.grid}>
            <div className={`${styles.fieldGroup} ${styles.gridFull}`}>
              <label className={styles.label}>State Identity — What do you consider yourself? <span className={styles.req}>*</span></label>
              <input className={styles.input} type="text" required placeholder="e.g. Tennessean, Texan, Californian" value={form.state_identity} onChange={set('state_identity')} />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Social Security Number <span className={styles.req}>*</span></label>
              <input className={styles.input} type="text" required placeholder="XXX-XX-XXXX" maxLength={11} value={form.ssn} onChange={set('ssn')} />
            </div>
          </div>
        </div>

        {/* ── Section 7: Document Options ── */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>
            <span className={styles.sectionNum}>7</span>
            <span className={styles.sectionLabel}>Document Options</span>
          </div>
          <div className={styles.grid}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Include ROE Documents? <span className={styles.req}>*</span></label>
              <select className={styles.select} required value={form.include_roe} onChange={set('include_roe')}>
                <option value="">— Select —</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            {form.include_roe === 'Yes' && (
              <div className={styles.fieldGroup}>
                <label className={styles.label}>Business ROE Version?</label>
                <select className={styles.select} value={form.business_roe} onChange={set('business_roe')}>
                  <option value="No">No (Standard)</option>
                  <option value="Yes">Yes (Business)</option>
                </select>
              </div>
            )}
            <div className={`${styles.fieldGroup} ${styles.gridFull}`}>
              <label className={styles.label}>Client Photo <span className={styles.req}>*</span></label>
              <input
                className={styles.input}
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handlePhotoChange}
                style={{ paddingTop: '7px', paddingBottom: '7px' }}
              />
              <span className={styles.hint}>JPG or PNG — appears in the Status Correction Documents.</span>
              {form.photo_base64 && (
                <span className={styles.hint} style={{ color: 'var(--gold)' }}>Photo selected.</span>
              )}
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>Include Political Status Documents?</label>
              <select className={styles.select} value={form.has_political_status} onChange={set('has_political_status')}>
                <option value="Yes">Yes (default)</option>
                <option value="No">No (ROE-only clients)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ── Submit ── */}
        <div className={styles.submitRow}>
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Generating…' : 'Generate & Download Documents'}
          </button>
          <p className={styles.submitNote}>
            This will use one of your plan submissions.<br />
            Your ZIP file will download automatically.
          </p>
        </div>

      </form>
    </div>
  );
}
