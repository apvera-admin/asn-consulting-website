'use client';

import { useState } from 'react';
import SectionLabel from './SectionLabel';
import styles from './DFYCalculator.module.css';

const PRICES = {
  statusCorrection: 1000,
  roe: 700,
  babyDeed: 150,
  marriagePaperwork: 200,
};

type QtyKey = 'statusCorrection' | 'roe' | 'babyDeed';

function Counter({
  value,
  min = 1,
  max = 10,
  onChange,
}: {
  value: number;
  min?: number;
  max?: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className={styles.counter}>
      <button
        type="button"
        className={styles.counterBtn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease"
      >
        −
      </button>
      <span className={styles.counterNum}>{value}</span>
      <button
        type="button"
        className={styles.counterBtn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase"
      >
        +
      </button>
    </div>
  );
}

export default function DFYCalculator() {
  const [services, setServices] = useState({
    statusCorrection: false,
    roe: false,
    babyDeed: false,
    marriagePaperwork: false,
  });

  const [quantities, setQuantities] = useState({
    statusCorrection: 1,
    roe: 1,
    babyDeed: 1,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleService = (key: keyof typeof services) => {
    setServices((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setQty = (key: QtyKey, val: number) => {
    setQuantities((prev) => ({ ...prev, [key]: val }));
  };

  const total =
    (services.statusCorrection ? PRICES.statusCorrection * quantities.statusCorrection : 0) +
    (services.roe ? PRICES.roe * quantities.roe : 0) +
    (services.babyDeed ? PRICES.babyDeed * quantities.babyDeed : 0) +
    (services.marriagePaperwork ? PRICES.marriagePaperwork : 0);

  const anySelected = Object.values(services).some(Boolean);

  const buildLineItems = () => {
    const items: { name: string; amount: number; quantity: number }[] = [];
    if (services.statusCorrection) {
      items.push({ name: 'DFY Status Correction', amount: PRICES.statusCorrection, quantity: quantities.statusCorrection });
    }
    if (services.roe) {
      items.push({ name: 'Revocation of Election (ROE)', amount: PRICES.roe, quantity: quantities.roe });
    }
    if (services.babyDeed) {
      items.push({ name: 'Baby Deed', amount: PRICES.babyDeed, quantity: quantities.babyDeed });
    }
    if (services.marriagePaperwork) {
      items.push({ name: 'Marriage Paperwork', amount: PRICES.marriagePaperwork, quantity: 1 });
    }
    return items;
  };

  const handlePayNow = async () => {
    if (!anySelected || loading) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/stripe/create-dfy-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: buildLineItems() }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError('Something went wrong. Please try again.');
        setLoading(false);
      }
    } catch {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const fmt = (n: number) => `$${n.toLocaleString()}`;

  return (
    <section className={styles.section} id="calculator">
      <div className={styles.inner}>
        <SectionLabel text="Estimate Your Investment" centered />
        <h2 className={styles.h2}>Build your custom DFY package</h2>
        <p className={styles.sub}>
          Select the services you need and adjust quantities below. Your total updates instantly.
          Pay securely online and skip the discovery call entirely.
        </p>

        <div className={styles.card}>
          <div className={styles.goldAccent} />
          <div className={styles.cols}>

            {/* ── Left: service selector ── */}
            <div className={styles.colLeft}>

              <div className={styles.row}>
                <label className={styles.rowLabel}>
                  <input
                    type="checkbox"
                    checked={services.statusCorrection}
                    onChange={() => toggleService('statusCorrection')}
                    className={styles.checkbox}
                  />
                  <div className={styles.rowInfo}>
                    <span className={styles.rowName}>Status Correction</span>
                    <span className={styles.rowSub}>Per person — $1,000 each</span>
                  </div>
                </label>
                {services.statusCorrection && (
                  <Counter
                    value={quantities.statusCorrection}
                    onChange={(v) => setQty('statusCorrection', v)}
                  />
                )}
              </div>

              <div className={styles.row}>
                <label className={styles.rowLabel}>
                  <input
                    type="checkbox"
                    checked={services.roe}
                    onChange={() => toggleService('roe')}
                    className={styles.checkbox}
                  />
                  <div className={styles.rowInfo}>
                    <span className={styles.rowName}>Revocation of Election (ROE)</span>
                    <span className={styles.rowSub}>$700 per person</span>
                  </div>
                </label>
                {services.roe && (
                  <Counter
                    value={quantities.roe}
                    onChange={(v) => setQty('roe', v)}
                  />
                )}
              </div>

              <div className={styles.row}>
                <label className={styles.rowLabel}>
                  <input
                    type="checkbox"
                    checked={services.babyDeed}
                    onChange={() => toggleService('babyDeed')}
                    className={styles.checkbox}
                  />
                  <div className={styles.rowInfo}>
                    <span className={styles.rowName}>Baby Deed(s)</span>
                    <span className={styles.rowSub}>$150 per child</span>
                  </div>
                </label>
                {services.babyDeed && (
                  <Counter
                    value={quantities.babyDeed}
                    max={20}
                    onChange={(v) => setQty('babyDeed', v)}
                  />
                )}
              </div>

              <div className={`${styles.row} ${styles.rowLast}`}>
                <label className={styles.rowLabel}>
                  <input
                    type="checkbox"
                    checked={services.marriagePaperwork}
                    onChange={() => toggleService('marriagePaperwork')}
                    className={styles.checkbox}
                  />
                  <div className={styles.rowInfo}>
                    <span className={styles.rowName}>Marriage Paperwork</span>
                    <span className={styles.rowSub}>$200 — one time flat fee</span>
                  </div>
                </label>
              </div>

            </div>

            {/* ── Right: live quote ── */}
            <div className={styles.colRight}>
              <div className={styles.quoteCard}>
                <div className={styles.quoteLabel}>Your Quote</div>

                {anySelected ? (
                  <ul className={styles.lineItems}>
                    {services.statusCorrection && (
                      <li className={styles.lineItem}>
                        <span>
                          Status Correction
                          {quantities.statusCorrection > 1 ? ` × ${quantities.statusCorrection}` : ''}
                        </span>
                        <span className={styles.linePrice}>
                          {fmt(PRICES.statusCorrection * quantities.statusCorrection)}
                        </span>
                      </li>
                    )}
                    {services.roe && (
                      <li className={styles.lineItem}>
                        <span>
                          ROE{quantities.roe > 1 ? ` × ${quantities.roe}` : ''}
                        </span>
                        <span className={styles.linePrice}>
                          {fmt(PRICES.roe * quantities.roe)}
                        </span>
                      </li>
                    )}
                    {services.babyDeed && (
                      <li className={styles.lineItem}>
                        <span>
                          Baby Deed{quantities.babyDeed > 1 ? ` × ${quantities.babyDeed}` : ''}
                        </span>
                        <span className={styles.linePrice}>
                          {fmt(PRICES.babyDeed * quantities.babyDeed)}
                        </span>
                      </li>
                    )}
                    {services.marriagePaperwork && (
                      <li className={styles.lineItem}>
                        <span>Marriage Paperwork</span>
                        <span className={styles.linePrice}>{fmt(PRICES.marriagePaperwork)}</span>
                      </li>
                    )}
                  </ul>
                ) : (
                  <p className={styles.quotePlaceholder}>Select services to see your quote</p>
                )}

                <div className={styles.quoteDivider} />

                <div className={styles.totalRow}>
                  <span className={styles.totalLabel}>Total</span>
                  <span className={styles.totalAmount}>{fmt(total)}</span>
                </div>

                <div className={styles.btns}>
                  <button
                    type="button"
                    className={styles.payBtn}
                    onClick={handlePayNow}
                    disabled={!anySelected || loading}
                    style={{ opacity: !anySelected || loading ? 0.4 : 1, cursor: !anySelected || loading ? 'not-allowed' : 'pointer' }}
                  >
                    {loading ? 'Processing...' : 'Pay Now & Get Started'}
                  </button>
                  <a href="/services" className={styles.callBtn}>
                    Book a Call Instead
                  </a>
                </div>

                {error && <p className={styles.errorMsg}>{error}</p>}

                <p className={styles.quoteNote}>
                  Payment is collected in full upfront. After payment you will complete a Hold
                  Harmless Agreement and intake form to begin your documents.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
