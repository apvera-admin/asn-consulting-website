'use client';
import { useEffect, useRef, useCallback } from 'react';
import styles from './HeroDocBuilder.module.css';

export default function HeroDocBuilder() {
  const f1Ref = useRef<HTMLSpanElement>(null);
  const f2Ref = useRef<HTMLSpanElement>(null);
  const f3Ref = useRef<HTMLSpanElement>(null);
  const c1Ref = useRef<HTMLSpanElement>(null);
  const c2Ref = useRef<HTMLSpanElement>(null);
  const c3Ref = useRef<HTMLSpanElement>(null);
  const progRef = useRef<HTMLDivElement>(null);
  const ch1Ref = useRef<HTMLDivElement>(null);
  const ch2Ref = useRef<HTMLDivElement>(null);
  const ch3Ref = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const loopTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const typeText = useCallback(
    (
      el: HTMLSpanElement,
      text: string,
      delay: number,
      cb?: () => void
    ) => {
      let i = 0;
      const start = () => {
        const iv = setInterval(() => {
          if (!el) { clearInterval(iv); return; }
          el.textContent += text[i];
          i++;
          if (i >= text.length) {
            clearInterval(iv);
            cb?.();
          }
        }, 55);
      };
      setTimeout(start, delay);
    },
    []
  );

  const startAnim = useCallback(() => {
    // Reset everything
    if (f1Ref.current) f1Ref.current.textContent = '';
    if (f2Ref.current) f2Ref.current.textContent = '';
    if (f3Ref.current) f3Ref.current.textContent = '';
    if (c1Ref.current) c1Ref.current.style.display = 'inline-block';
    if (c2Ref.current) c2Ref.current.style.display = 'none';
    if (c3Ref.current) c3Ref.current.style.display = 'none';
    if (ch1Ref.current) ch1Ref.current.classList.remove(styles.checkShow);
    if (ch2Ref.current) ch2Ref.current.classList.remove(styles.checkShow);
    if (ch3Ref.current) ch3Ref.current.classList.remove(styles.checkShow);
    if (stampRef.current) stampRef.current.classList.remove(styles.stampShow);
    if (progRef.current) {
      progRef.current.style.transition = 'none';
      progRef.current.style.width = '0%';
      void progRef.current.offsetWidth;
      progRef.current.style.transition = 'width 0.8s ease';
    }

    setTimeout(() => {
      if (progRef.current) progRef.current.style.width = '20%';
    }, 100);

    typeText(f1Ref.current!, 'John Henry Doe', 300, () => {
      if (c1Ref.current) c1Ref.current.style.display = 'none';
      if (c2Ref.current) c2Ref.current.style.display = 'inline-block';
      if (progRef.current) progRef.current.style.width = '50%';

      typeText(f2Ref.current!, 'Tennessee', 200, () => {
        if (c2Ref.current) c2Ref.current.style.display = 'none';
        if (c3Ref.current) c3Ref.current.style.display = 'inline-block';
        if (progRef.current) progRef.current.style.width = '75%';

        typeText(f3Ref.current!, 'Revocation of Election', 200, () => {
          if (c3Ref.current) c3Ref.current.style.display = 'none';
          if (progRef.current) progRef.current.style.width = '90%';

          setTimeout(() => { ch1Ref.current?.classList.add(styles.checkShow); }, 200);
          setTimeout(() => { ch2Ref.current?.classList.add(styles.checkShow); }, 600);
          setTimeout(() => { ch3Ref.current?.classList.add(styles.checkShow); }, 1000);

          setTimeout(() => {
            if (progRef.current) progRef.current.style.width = '100%';
            stampRef.current?.classList.add(styles.stampShow);
            loopTimer.current = setTimeout(startAnim, 5000);
          }, 1500);
        });
      });
    });
  }, [typeText]);

  useEffect(() => {
    startAnim();
    return () => {
      if (loopTimer.current) clearTimeout(loopTimer.current);
    };
  }, [startAnim]);

  return (
    <div className={styles.wrap} aria-hidden="true">
      {/* Title bar */}
      <div className={styles.titleBar}>
        <span className={styles.dot} style={{ background: '#E05A5A' }} />
        <span className={styles.dot} style={{ background: '#E0A030' }} />
        <span className={styles.dot} style={{ background: '#4CAF50' }} />
        <span className={styles.barLabel}>Status Correction Document</span>
      </div>

      {/* Doc body */}
      <div className={styles.body}>
        {/* Header */}
        <div className={styles.docHeader}>
          <div className={styles.seal}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
          <div className={styles.docTitle}>Notice of Status Correction</div>
          <div className={styles.docSub}>American State National</div>
        </div>

        {/* Progress */}
        <div className={styles.progTrack}>
          <div className={styles.progFill} ref={progRef} />
        </div>

        {/* Field — Given Name */}
        <div className={styles.fieldRow}>
          <div className={styles.fieldLabel}>Given Name</div>
          <div className={styles.fieldBox}>
            <span ref={f1Ref} />
            <span className={styles.cursor} ref={c1Ref} />
          </div>
        </div>

        {/* Two-column row */}
        <div className={styles.twoCol}>
          <div className={styles.fieldRow}>
            <div className={styles.fieldLabel}>State of Record</div>
            <div className={styles.fieldBox}>
              <span ref={f2Ref} />
              <span className={styles.cursor} ref={c2Ref} style={{ display: 'none' }} />
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.fieldLabel}>Document Type</div>
            <div className={styles.fieldBox}>
              <span ref={f3Ref} />
              <span className={styles.cursor} ref={c3Ref} style={{ display: 'none' }} />
            </div>
          </div>
        </div>

        {/* Check rows */}
        <div className={styles.checkRow} ref={ch1Ref}>
          <div className={styles.checkIcon}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none"
              stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <span className={styles.checkText}>Identity verified</span>
        </div>
        <div className={styles.checkRow} ref={ch2Ref}>
          <div className={styles.checkIcon}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none"
              stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <span className={styles.checkText}>ROE filing prepared</span>
        </div>
        <div className={styles.checkRow} ref={ch3Ref}>
          <div className={styles.checkIcon}>
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none"
              stroke="var(--gold)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <span className={styles.checkText}>Documents ready for notarization</span>
        </div>

        {/* Stamp */}
        <div className={styles.stampWrap}>
          <div className={styles.stamp} ref={stampRef}>
            <div className={styles.stampInner}>
              <div className={styles.stampText}>CERTIFIED</div>
              <div className={styles.stampSub}>ASN CONSULTING</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
