'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  plan_tier: string | null;
  purchased_services: string[] | null;
  submission_limit_override: number | null;
  submissions_used: number;
  plan_purchased_at: string | null;
  hha_signed: boolean | null;
  hha_signed_at: string | null;
  hha_signature_name: string | null;
  hha_ip_address: string | null;
  case_status: string | null;
  dfy_services: string | null;
}

interface IntakeSubmission {
  id: string;
  client_email: string;
  photo_url: string | null;
  form_data: Record<string, string>;
  submitted_at: string;
}

const PLAN_TIERS = ['individual', 'partner', 'family', 'roe', 'dfy'];
const ALL_SERVICES = ['status_correction', 'roe', 'baby_deed', 'marriage_paperwork'];
const SUBMISSION_LIMITS: Record<string, number> = {
  individual: 1, partner: 2, family: 4, roe: 1,
};

interface CardState {
  submissionsInput: string;
  overrideInput: string;
  addServiceVal: string;
  planTierVal: string;
  saving: boolean;
  feedback: string;
  feedbackOk: boolean;
}

function makeCardState(u: UserProfile): CardState {
  return {
    submissionsInput: String(u.submissions_used ?? 0),
    overrideInput: u.submission_limit_override != null ? String(u.submission_limit_override) : '',
    addServiceVal: '',
    planTierVal: u.plan_tier ?? '',
    saving: false,
    feedback: '',
    feedbackOk: true,
  };
}

function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

function intakeLink(email: string): string {
  const base = typeof window !== 'undefined' ? window.location.origin : '';
  return `${base}/dfy-intake?email=${encodeURIComponent(email)}`;
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [gateError, setGateError] = useState('');
  const [gateLoading, setGateLoading] = useState(false);

  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  // Add client modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ full_name: '', email: '', services: '', send_email: true });
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState<{ intake_link: string } | null>(null);
  const [addCopied, setAddCopied] = useState(false);

  // Intake per-card state
  const [intakeData, setIntakeData] = useState<Record<string, IntakeSubmission | null | 'loading'>>({});
  const [intakeExpanded, setIntakeExpanded] = useState<Record<string, boolean>>({});

  // Copy intake link feedback per user
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setGateLoading(true);
    setGateError('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'x-admin-key': keyInput },
      });
      if (res.ok) {
        setAdminKey(keyInput);
      } else {
        setGateError('Incorrect password.');
      }
    } catch {
      setGateError('Network error — try again.');
    } finally {
      setGateLoading(false);
    }
  }

  async function fetchUsers(emailFilter = '') {
    setLoading(true);
    try {
      const url = emailFilter.length >= 2
        ? `/api/admin/users?email=${encodeURIComponent(emailFilter)}`
        : '/api/admin/users';
      const res = await fetch(url, { headers: { 'x-admin-key': adminKey } });
      const json = await res.json();
      const found: UserProfile[] = json.users ?? [];
      setAllUsers(found);
      setCardStates(prev => {
        const next = { ...prev };
        for (const u of found) {
          if (!next[u.id]) next[u.id] = makeCardState(u);
        }
        return next;
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!adminKey) return;
    fetchUsers();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminKey]);

  useEffect(() => {
    if (!adminKey) return;
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => fetchUsers(query), 300);
    return () => clearTimeout(searchTimer.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function setCardField(id: string, patch: Partial<CardState>) {
    setCardStates(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));
  }

  async function patch(userId: string, payload: Record<string, unknown>) {
    setCardField(userId, { saving: true, feedback: '' });
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setCardField(userId, { saving: false, feedback: json.error ?? 'Save failed', feedbackOk: false });
        return;
      }
      const updated: UserProfile = json.user;
      setAllUsers(prev => prev.map(u => u.id === userId ? updated : u));
      setCardStates(prev => ({
        ...prev,
        [userId]: { ...makeCardState(updated), saving: false, feedback: 'Saved.', feedbackOk: true },
      }));
    } catch {
      setCardField(userId, { saving: false, feedback: 'Network error', feedbackOk: false });
    }
  }

  async function handleAddClient(e: React.FormEvent) {
    e.preventDefault();
    setAddLoading(true);
    setAddError('');
    try {
      const res = await fetch('/api/admin/add-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify(addForm),
      });
      const json = await res.json();
      if (!res.ok) {
        setAddError(json.error ?? 'Failed to create client');
        return;
      }
      setAddSuccess({ intake_link: json.intake_link });
      setAddForm({ full_name: '', email: '', services: '', send_email: true });
      fetchUsers(query);
    } catch {
      setAddError('Network error — try again.');
    } finally {
      setAddLoading(false);
    }
  }

  function closeAddModal() {
    setShowAddModal(false);
    setAddSuccess(null);
    setAddError('');
    setAddCopied(false);
    setAddForm({ full_name: '', email: '', services: '', send_email: true });
  }

  async function loadIntake(userId: string, email: string) {
    if (intakeData[userId] !== undefined) {
      setIntakeExpanded(prev => ({ ...prev, [userId]: !prev[userId] }));
      return;
    }
    setIntakeExpanded(prev => ({ ...prev, [userId]: true }));
    setIntakeData(prev => ({ ...prev, [userId]: 'loading' }));
    try {
      const res = await fetch(`/api/admin/intake?email=${encodeURIComponent(email)}`, {
        headers: { 'x-admin-key': adminKey },
      });
      const json = await res.json();
      setIntakeData(prev => ({ ...prev, [userId]: json.intake ?? null }));
    } catch {
      setIntakeData(prev => ({ ...prev, [userId]: null }));
    }
  }

  function copyIntakeLink(email: string, userId: string) {
    navigator.clipboard.writeText(intakeLink(email)).catch(() => {});
    setCopiedId(userId);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function copyAllIntakeFields(intake: IntakeSubmission) {
    const lines = Object.entries(intake.form_data)
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    navigator.clipboard.writeText(lines).catch(() => {});
  }

  // ── Password gate ─────────────────────────────────────────────────────────
  if (!adminKey) {
    return (
      <div className={styles.page}>
        <div className={styles.warningBanner}>Admin Panel — Internal Use Only</div>
        <div className={styles.gate}>
          <form className={styles.gateCard} onSubmit={handlePasswordSubmit}>
            <h1 className={styles.gateHeading}>Admin Access</h1>
            <p className={styles.gateSub}>Enter the admin password to continue.</p>
            <input
              className={`${styles.gateInput}${gateError ? ` ${styles.error}` : ''}`}
              type="password"
              placeholder="Admin password"
              value={keyInput}
              onChange={e => { setKeyInput(e.target.value); setGateError(''); }}
              autoFocus
            />
            {gateError && <p className={styles.gateError}>{gateError}</p>}
            <button type="submit" className={styles.gateBtn} disabled={gateLoading || !keyInput}>
              {gateLoading ? 'Verifying…' : 'Enter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main UI ───────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.warningBanner}>Admin Panel — Internal Use Only</div>

      {/* ── Add Client Modal ── */}
      {showAddModal && (
        <div className={styles.modalBackdrop} onClick={closeAddModal}>
          <div className={styles.modalCard} onClick={e => e.stopPropagation()}>
            <div className={styles.modalAccent} />
            <button className={styles.modalClose} onClick={closeAddModal}>✕</button>

            <h2 className={styles.modalHeading}>Add New Client</h2>
            <p className={styles.modalSub}>
              Manually create a DFY client account. They&apos;ll get a link to sign their agreement and complete their intake form.
            </p>

            {!addSuccess ? (
              <form onSubmit={handleAddClient} className={styles.modalForm}>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Full Name <span className={styles.req}>*</span></label>
                  <input
                    className={styles.modalInput}
                    type="text"
                    required
                    value={addForm.full_name}
                    onChange={e => setAddForm(f => ({ ...f, full_name: e.target.value }))}
                  />
                </div>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Email <span className={styles.req}>*</span></label>
                  <input
                    className={styles.modalInput}
                    type="email"
                    required
                    value={addForm.email}
                    onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Services</label>
                  <input
                    className={styles.modalInput}
                    type="text"
                    placeholder="e.g. Status Correction, ROE"
                    value={addForm.services}
                    onChange={e => setAddForm(f => ({ ...f, services: e.target.value }))}
                  />
                </div>
                <label className={styles.modalCheckLabel}>
                  <input
                    type="checkbox"
                    checked={addForm.send_email}
                    onChange={e => setAddForm(f => ({ ...f, send_email: e.target.checked }))}
                  />
                  <span>Email the client their intake link now</span>
                </label>
                {addError && <p className={styles.modalError}>{addError}</p>}
                <button type="submit" className={styles.modalSubmit} disabled={addLoading}>
                  {addLoading ? 'Creating…' : 'Create Client & Send Link'}
                </button>
              </form>
            ) : (
              <div className={styles.addSuccessPanel}>
                <div className={styles.addSuccessBadge}>✓ Client Created</div>
                <p className={styles.addSuccessLabel}>Intake Link</p>
                <div className={styles.addLinkRow}>
                  <span className={styles.addLinkText}>{addSuccess.intake_link}</span>
                  <button
                    className={`${styles.btn} ${styles.btnGold}`}
                    onClick={() => {
                      navigator.clipboard.writeText(addSuccess!.intake_link).catch(() => {});
                      setAddCopied(true);
                      setTimeout(() => setAddCopied(false), 2000);
                    }}
                  >
                    {addCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <button className={styles.modalSubmit} onClick={closeAddModal}>Done</button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className={styles.main}>
        <div className={styles.topRow}>
          <div>
            <h1 className={styles.adminHeading}>User Management</h1>
            <p className={styles.adminSub}>{allUsers.length} user{allUsers.length !== 1 ? 's' : ''}</p>
          </div>
          <div className={styles.topRowRight}>
            <button className={styles.addClientBtn} onClick={() => setShowAddModal(true)}>
              + Add Client
            </button>
            <button
              className={styles.logoutBtn}
              onClick={() => { setAdminKey(''); setKeyInput(''); setAllUsers([]); setQuery(''); }}
            >
              Log Out
            </button>
          </div>
        </div>

        <div className={styles.searchRow}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Filter by email…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {loading && <span className={styles.searching}>Loading…</span>}
        </div>

        {/* Table header */}
        <div className={styles.tableHeader}>
          <span style={{ flex: '0 0 220px' }}>Email / Name</span>
          <span style={{ flex: '0 0 90px' }}>Plan</span>
          <span style={{ flex: '0 0 110px' }}>Submissions</span>
          <span style={{ flex: '0 0 90px' }}>HHA</span>
          <span style={{ flex: 1 }}>Services</span>
          <span style={{ width: 20 }} />
        </div>

        {allUsers.length === 0 && !loading && (
          <p className={styles.noResults}>No users found.</p>
        )}

        {allUsers.map(user => {
          const cs = cardStates[user.id];
          if (!cs) return null;
          const isOpen = expandedId === user.id;
          const effectiveLimit =
            user.submission_limit_override ??
            SUBMISSION_LIMITS[user.plan_tier ?? ''] ??
            1;
          const atLimit = user.submissions_used >= effectiveLimit;
          const showIntake = intakeExpanded[user.id];
          const intake = intakeData[user.id];

          return (
            <div key={user.id} className={`${styles.userRow}${isOpen ? ` ${styles.userRowOpen}` : ''}`}>

              {/* ── Summary row ── */}
              <div
                className={styles.rowSummary}
                onClick={() => setExpandedId(isOpen ? null : user.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setExpandedId(isOpen ? null : user.id)}
              >
                <div className={styles.colIdentity}>
                  <span className={styles.rowEmail}>{user.email}</span>
                  {user.full_name && <span className={styles.rowName}>{user.full_name}</span>}
                </div>

                <div className={styles.colPlan}>
                  {user.plan_tier
                    ? <span className={`${styles.badge} ${styles.badgePlan}`}>{user.plan_tier}</span>
                    : <span className={styles.rowMuted}>—</span>}
                </div>

                <div className={styles.colSubs}>
                  <span className={`${styles.subCount}${atLimit ? ` ${styles.subCountWarning}` : ''}`}>
                    {user.submissions_used} / {effectiveLimit}
                    {user.submission_limit_override != null && <span className={styles.overrideDot} title="Override active"> ●</span>}
                  </span>
                </div>

                <div className={styles.colHha}>
                  <span className={`${styles.badge} ${user.hha_signed ? styles.badgeHha : styles.badgeHhaNo}`}>
                    {user.hha_signed ? 'Signed' : 'Not signed'}
                  </span>
                </div>

                <div className={styles.colServices}>
                  {(user.purchased_services ?? []).length > 0
                    ? (user.purchased_services!.map(svc => (
                        <span key={svc} className={`${styles.badge} ${styles.badgeService}`}>{svc}</span>
                      )))
                    : <span className={styles.rowMuted}>None</span>}
                </div>

                <div className={`${styles.chevron}${isOpen ? ` ${styles.chevronOpen}` : ''}`}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* ── Expanded panel ── */}
              {isOpen && (
                <div className={styles.expandPanel}>

                  {/* Service badges with remove */}
                  {(user.purchased_services ?? []).length > 0 && (
                    <div className={styles.serviceBadges}>
                      {user.purchased_services!.map(svc => (
                        <span key={svc} className={`${styles.badge} ${styles.badgeService}`}>
                          {svc}
                          <button
                            className={styles.badgeRemoveBtn}
                            title={`Remove ${svc}`}
                            disabled={cs.saving}
                            onClick={() => patch(user.id, {
                              purchased_services: user.purchased_services!.filter(s => s !== svc),
                            })}
                          >×</button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className={styles.actions}>
                    <div className={styles.actionGroup}>
                      <button className={`${styles.btn} ${styles.btnRed}`} disabled={cs.saving}
                        onClick={() => patch(user.id, { submissions_used: 0 })}>
                        Reset Submissions
                      </button>
                    </div>

                    <div className={styles.actionGroup}>
                      <span className={styles.actionLabel}>Set Used</span>
                      <input className={styles.actionInput} type="number" min={0}
                        value={cs.submissionsInput}
                        onChange={e => setCardField(user.id, { submissionsInput: e.target.value })} />
                      <button className={`${styles.btn} ${styles.btnGold}`} disabled={cs.saving}
                        onClick={() => patch(user.id, { submissions_used: parseInt(cs.submissionsInput, 10) || 0 })}>
                        Set
                      </button>
                    </div>

                    <div className={styles.actionGroup}>
                      <span className={styles.actionLabel}>Override Limit</span>
                      <input className={styles.actionInput} type="number" min={0} placeholder="—"
                        value={cs.overrideInput}
                        onChange={e => setCardField(user.id, { overrideInput: e.target.value })} />
                      <button className={`${styles.btn} ${styles.btnGold}`} disabled={cs.saving}
                        onClick={() => patch(user.id, {
                          submission_limit_override: cs.overrideInput ? parseInt(cs.overrideInput, 10) : null,
                        })}>
                        Set
                      </button>
                    </div>

                    <div className={styles.actionGroup}>
                      <span className={styles.actionLabel}>Add Service</span>
                      <select className={styles.actionSelect} value={cs.addServiceVal}
                        onChange={e => setCardField(user.id, { addServiceVal: e.target.value })}>
                        <option value="">— pick —</option>
                        {ALL_SERVICES.filter(s => !(user.purchased_services ?? []).includes(s)).map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <button className={`${styles.btn} ${styles.btnGreen}`}
                        disabled={cs.saving || !cs.addServiceVal}
                        onClick={() => {
                          const current = user.purchased_services ?? [];
                          if (cs.addServiceVal && !current.includes(cs.addServiceVal)) {
                            patch(user.id, { purchased_services: [...current, cs.addServiceVal] });
                          }
                        }}>
                        Add
                      </button>
                    </div>

                    <div className={styles.actionGroup}>
                      <span className={styles.actionLabel}>Plan Tier</span>
                      <select className={styles.actionSelect} value={cs.planTierVal}
                        onChange={e => setCardField(user.id, { planTierVal: e.target.value })}>
                        <option value="">— pick —</option>
                        {PLAN_TIERS.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <button className={`${styles.btn} ${styles.btnGold}`}
                        disabled={cs.saving || !cs.planTierVal}
                        onClick={() => patch(user.id, { plan_tier: cs.planTierVal })}>
                        Set
                      </button>
                    </div>
                  </div>

                  {cs.feedback && (
                    <div className={`${styles.cardFeedback} ${cs.feedbackOk ? styles.feedbackOk : styles.feedbackErr}`}>
                      {cs.feedback}
                    </div>
                  )}

                  {/* ── HHA Status ── */}
                  <div className={styles.detailSection}>
                    <div className={styles.detailSectionHead}>
                      <span className={styles.detailSectionLabel}>Hold Harmless Agreement</span>
                      <button
                        className={styles.copyLinkBtn}
                        onClick={() => copyIntakeLink(user.email, user.id)}
                      >
                        {copiedId === user.id ? 'Copied!' : 'Copy Intake Link'}
                      </button>
                    </div>

                    {user.hha_signed ? (
                      <div className={styles.hhaSignedBlock}>
                        <span className={`${styles.badge} ${styles.badgeHha}`}>HHA Signed ✓</span>
                        <div className={styles.hhaDetails}>
                          <span>Signed by: <strong>{user.hha_signature_name ?? '—'}</strong></span>
                          <span>Date: <strong>{formatDate(user.hha_signed_at)}</strong></span>
                          <span>IP: <strong>{user.hha_ip_address ?? '—'}</strong></span>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.hhaUnsignedBlock}>
                        <span className={`${styles.badge} ${styles.badgeHhaNo}`}>HHA Not Signed</span>
                      </div>
                    )}
                  </div>

                  {/* ── Intake Form ── */}
                  <div className={styles.detailSection}>
                    <div className={styles.detailSectionHead}>
                      <span className={styles.detailSectionLabel}>Intake Form</span>
                      <button
                        className={`${styles.btn} ${styles.btnGold}`}
                        onClick={() => loadIntake(user.id, user.email)}
                      >
                        {showIntake ? 'Hide Intake' : 'View Intake Form'}
                      </button>
                    </div>

                    {showIntake && (
                      <div className={styles.intakePanel}>
                        {intake === 'loading' && (
                          <p className={styles.intakeEmpty}>Loading…</p>
                        )}

                        {intake === null && (
                          <div className={styles.intakeEmpty}>
                            No intake form submitted yet.
                          </div>
                        )}

                        {intake && intake !== 'loading' && (
                          <>
                            {intake.photo_url && (
                              <div className={styles.intakePhotoRow}>
                                <img
                                  src={intake.photo_url}
                                  alt="Client photo"
                                  className={styles.intakeThumb}
                                />
                                <a
                                  href={intake.photo_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className={styles.intakePhotoLink}
                                >
                                  View Full Size ↗
                                </a>
                              </div>
                            )}
                            <div className={styles.intakeGrid}>
                              {Object.entries(intake.form_data).map(([key, val]) => (
                                <div key={key} className={styles.intakeField}>
                                  <span className={styles.intakeKey}>{key.replace(/_/g, ' ')}</span>
                                  <span className={styles.intakeVal}>{val || '—'}</span>
                                </div>
                              ))}
                            </div>
                            <div className={styles.intakeFooter}>
                              <span className={styles.intakeDate}>
                                Submitted {formatDate(intake.submitted_at)}
                              </span>
                              <button
                                className={`${styles.btn} ${styles.btnGold}`}
                                onClick={() => copyAllIntakeFields(intake as IntakeSubmission)}
                              >
                                Copy All for Generator
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
