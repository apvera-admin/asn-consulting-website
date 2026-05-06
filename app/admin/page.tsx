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
}

const PLAN_TIERS = ['individual', 'partner', 'family', 'roe'];
const ALL_SERVICES = ['status_correction', 'roe', 'baby_deed', 'marriage_paperwork'];
const SUBMISSION_LIMITS: Record<string, number> = {
  individual: 1, partner: 2, family: 4, roe: 1,
};

// ── Per-card state ──────────────────────────────────────────────────────────
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
    overrideInput: u.submission_limit_override != null
      ? String(u.submission_limit_override)
      : '',
    addServiceVal: '',
    planTierVal: u.plan_tier ?? '',
    saving: false,
    feedback: '',
    feedbackOk: true,
  };
}

// ── Admin page ──────────────────────────────────────────────────────────────
export default function AdminPage() {
  // Password gate
  const [adminKey, setAdminKey] = useState('');
  const [keyInput, setKeyInput] = useState('');
  const [gateError, setGateError] = useState('');
  const [gateLoading, setGateLoading] = useState(false);

  // Search
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [cardStates, setCardStates] = useState<Record<string, CardState>>({});
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

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

  // Search with debounce
  useEffect(() => {
    if (!adminKey) return;
    clearTimeout(searchTimer.current);
    if (query.length < 2) {
      setUsers([]);
      return;
    }
    setSearching(true);
    searchTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/admin/users?email=${encodeURIComponent(query)}`,
          { headers: { 'x-admin-key': adminKey } }
        );
        const json = await res.json();
        const found: UserProfile[] = json.users ?? [];
        setUsers(found);
        setCardStates(prev => {
          const next = { ...prev };
          for (const u of found) {
            if (!next[u.id]) next[u.id] = makeCardState(u);
          }
          return next;
        });
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(searchTimer.current);
  }, [query, adminKey]);

  function setCardField(id: string, patch: Partial<CardState>) {
    setCardStates(prev => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));
  }

  async function patch(
    userId: string,
    payload: Record<string, unknown>,
    optimisticUpdate?: (u: UserProfile) => UserProfile
  ) {
    setCardField(userId, { saving: true, feedback: '' });
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey,
        },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setCardField(userId, {
          saving: false,
          feedback: json.error ?? 'Save failed',
          feedbackOk: false,
        });
        return;
      }
      // Update local user data from server response
      const updated: UserProfile = json.user;
      setUsers(prev => prev.map(u => u.id === userId ? updated : u));
      setCardStates(prev => ({
        ...prev,
        [userId]: {
          ...makeCardState(updated),
          saving: false,
          feedback: 'Saved.',
          feedbackOk: true,
        },
      }));
    } catch {
      setCardField(userId, {
        saving: false,
        feedback: 'Network error',
        feedbackOk: false,
      });
    }
  }

  // ── Password gate ─────────────────────────────────────────────────────────
  if (!adminKey) {
    return (
      <div className={styles.page}>
        <div className={styles.warningBanner}>
          Admin Panel — Internal Use Only
        </div>
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
            {gateError && (
              <p className={styles.gateError}>{gateError}</p>
            )}
            <button
              type="submit"
              className={styles.gateBtn}
              disabled={gateLoading || !keyInput}
            >
              {gateLoading ? 'Verifying…' : 'Enter'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Main admin UI ─────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>
      <div className={styles.warningBanner}>
        Admin Panel — Internal Use Only
      </div>

      <div className={styles.main}>
        <div className={styles.topRow}>
          <h1 className={styles.adminHeading}>User Management</h1>
          <button
            className={styles.logoutBtn}
            onClick={() => { setAdminKey(''); setKeyInput(''); setUsers([]); setQuery(''); }}
          >
            Log Out
          </button>
        </div>

        {/* Search */}
        <div className={styles.searchRow}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search by email address…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {searching && <p className={styles.searching}>Searching…</p>}

        {!searching && query.length >= 2 && users.length === 0 && (
          <p className={styles.noResults}>No users found matching &ldquo;{query}&rdquo;</p>
        )}

        {/* User cards */}
        {users.map(user => {
          const cs = cardStates[user.id];
          if (!cs) return null;

          const effectiveLimit =
            user.submission_limit_override ??
            SUBMISSION_LIMITS[user.plan_tier ?? ''] ??
            1;
          const atLimit = user.submissions_used >= effectiveLimit;

          return (
            <div key={user.id} className={styles.userCard}>
              {/* Top row: email + meta badges */}
              <div className={styles.cardTop}>
                <div>
                  <div className={styles.cardEmail}>{user.email}</div>
                  {user.full_name && (
                    <div className={styles.cardName}>{user.full_name}</div>
                  )}
                </div>
                <div className={styles.cardMeta}>
                  {user.plan_tier && (
                    <span className={`${styles.badge} ${styles.badgePlan}`}>
                      {user.plan_tier}
                    </span>
                  )}
                  <span
                    className={`${styles.subCount}${atLimit ? ` ${styles.subCountWarning}` : ''}`}
                  >
                    {user.submissions_used} / {effectiveLimit} submissions
                    {user.submission_limit_override != null && ' (override)'}
                  </span>
                  <span
                    className={`${styles.badge} ${user.hha_signed ? styles.badgeHha : styles.badgeHhaNo}`}
                  >
                    HHA {user.hha_signed ? 'signed' : 'not signed'}
                  </span>
                  {user.plan_purchased_at && (
                    <span className={styles.purchasedDate}>
                      Purchased{' '}
                      {new Date(user.plan_purchased_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Purchased services badges */}
              {(user.purchased_services?.length ?? 0) > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {user.purchased_services!.map(svc => (
                    <span key={svc} className={`${styles.badge} ${styles.badgeService}`}>
                      {svc}
                      <button
                        className={styles.badgeRemoveBtn}
                        title={`Remove ${svc}`}
                        disabled={cs.saving}
                        onClick={() =>
                          patch(user.id, {
                            purchased_services: user.purchased_services!.filter(
                              s => s !== svc
                            ),
                          })
                        }
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}

              <hr className={styles.divider} />

              {/* Actions */}
              <div className={styles.actions}>

                {/* Reset submissions */}
                <div className={styles.actionGroup}>
                  <button
                    className={`${styles.btn} ${styles.btnRed}`}
                    disabled={cs.saving}
                    onClick={() => patch(user.id, { submissions_used: 0 })}
                  >
                    Reset Submissions
                  </button>
                </div>

                {/* Set submissions used */}
                <div className={styles.actionGroup}>
                  <span className={styles.actionLabel}>Set Used</span>
                  <input
                    className={styles.actionInput}
                    type="number"
                    min={0}
                    value={cs.submissionsInput}
                    onChange={e =>
                      setCardField(user.id, { submissionsInput: e.target.value })
                    }
                  />
                  <button
                    className={`${styles.btn} ${styles.btnGold}`}
                    disabled={cs.saving}
                    onClick={() =>
                      patch(user.id, {
                        submissions_used: parseInt(cs.submissionsInput, 10) || 0,
                      })
                    }
                  >
                    Set
                  </button>
                </div>

                {/* Override limit */}
                <div className={styles.actionGroup}>
                  <span className={styles.actionLabel}>Override Limit</span>
                  <input
                    className={styles.actionInput}
                    type="number"
                    min={0}
                    placeholder="—"
                    value={cs.overrideInput}
                    onChange={e =>
                      setCardField(user.id, { overrideInput: e.target.value })
                    }
                  />
                  <button
                    className={`${styles.btn} ${styles.btnGold}`}
                    disabled={cs.saving}
                    onClick={() =>
                      patch(user.id, {
                        submission_limit_override: cs.overrideInput
                          ? parseInt(cs.overrideInput, 10)
                          : null,
                      })
                    }
                  >
                    Set
                  </button>
                </div>

                {/* Add service */}
                <div className={styles.actionGroup}>
                  <span className={styles.actionLabel}>Add Service</span>
                  <select
                    className={styles.actionSelect}
                    value={cs.addServiceVal}
                    onChange={e =>
                      setCardField(user.id, { addServiceVal: e.target.value })
                    }
                  >
                    <option value="">— pick —</option>
                    {ALL_SERVICES.filter(
                      s => !(user.purchased_services ?? []).includes(s)
                    ).map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <button
                    className={`${styles.btn} ${styles.btnGreen}`}
                    disabled={cs.saving || !cs.addServiceVal}
                    onClick={() => {
                      const current = user.purchased_services ?? [];
                      if (cs.addServiceVal && !current.includes(cs.addServiceVal)) {
                        patch(user.id, {
                          purchased_services: [...current, cs.addServiceVal],
                        });
                      }
                    }}
                  >
                    Add
                  </button>
                </div>

                {/* Set plan tier */}
                <div className={styles.actionGroup}>
                  <span className={styles.actionLabel}>Plan Tier</span>
                  <select
                    className={styles.actionSelect}
                    value={cs.planTierVal}
                    onChange={e =>
                      setCardField(user.id, { planTierVal: e.target.value })
                    }
                  >
                    <option value="">— pick —</option>
                    {PLAN_TIERS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <button
                    className={`${styles.btn} ${styles.btnGold}`}
                    disabled={cs.saving || !cs.planTierVal}
                    onClick={() =>
                      patch(user.id, { plan_tier: cs.planTierVal })
                    }
                  >
                    Set
                  </button>
                </div>

              </div>

              {/* Per-card feedback */}
              {cs.feedback && (
                <div
                  className={`${styles.cardFeedback} ${
                    cs.feedbackOk ? styles.feedbackOk : styles.feedbackErr
                  }`}
                >
                  {cs.feedback}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
