'use client';
import type { ReactNode } from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  variant: 'primary' | 'outline';
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
  fullWidth?: boolean;
  href?: string;
  type?: 'button' | 'submit';
};

export default function Button({
  variant,
  label,
  icon,
  onClick,
  fullWidth,
  href,
  type = 'button',
}: ButtonProps) {
  const cls = `${styles.btn} ${styles[variant]} ${fullWidth ? styles.fullWidth : ''}`;

  if (href) {
    return (
      <a href={href} className={cls}>
        {label}
        {icon && <span className={styles.icon}>{icon}</span>}
      </a>
    );
  }

  return (
    <button type={type} className={cls} onClick={onClick}>
      {label}
      {icon && <span className={styles.icon}>{icon}</span>}
    </button>
  );
}
