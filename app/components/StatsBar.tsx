'use client';
import { useEffect, useRef } from 'react';
import styles from './StatsBar.module.css';

function countUp(el: HTMLElement, target: number, suffix: string) {
  const dur = 1600;
  const start = performance.now();
  const tick = (now: number) => {
    const p = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(ease * target) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export default function StatsBar() {
  const containerRef = useRef<HTMLDivElement>(null);
  const stat1Ref = useRef<HTMLSpanElement>(null);
  const stat3Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (stat1Ref.current) countUp(stat1Ref.current, 500, '+');
            if (stat3Ref.current) countUp(stat3Ref.current, 27, ' Days');
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.statsBar} ref={containerRef}>
      <div className={styles.stat}>
        <span className={styles.value} ref={stat1Ref}>500+</span>
        <span className={styles.label}>Clients Served</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={styles.value}>4-Step</span>
        <span className={styles.label}>Proven Process</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={styles.value} ref={stat3Ref}>27 Days</span>
        <span className={styles.label}>Free Email Course</span>
      </div>
      <div className={styles.divider} />
      <div className={styles.stat}>
        <span className={styles.value}>DFY+DIY</span>
        <span className={styles.label}>Options Available</span>
      </div>
    </div>
  );
}
