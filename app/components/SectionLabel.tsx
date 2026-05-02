import styles from './SectionLabel.module.css';

type SectionLabelProps = {
  text: string;
  centered?: boolean;
};

export default function SectionLabel({ text, centered = false }: SectionLabelProps) {
  return (
    <div className={`${styles.label} ${centered ? styles.centered : ''}`}>
      <span className={styles.line} />
      <span className={styles.text}>{text}</span>
      {centered && <span className={styles.line} />}
    </div>
  );
}
