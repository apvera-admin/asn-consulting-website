import Link from 'next/link';
import type { BlogPost } from '../../lib/blog';
import styles from './BlogCard.module.css';

function categoryGradient(category: string): string {
  switch (category) {
    case 'Tax Remedy':
      return 'linear-gradient(135deg, rgba(200,150,60,0.15), rgba(200,150,60,0.05))';
    case 'Correcting Status':
      return 'linear-gradient(135deg, rgba(100,150,200,0.15), rgba(100,150,200,0.05))';
    case 'Need To Know':
      return 'linear-gradient(135deg, rgba(150,200,100,0.15), rgba(150,200,100,0.05))';
    default:
      return 'linear-gradient(135deg, rgba(200,150,60,0.1), rgba(0,0,0,0))';
  }
}

export default function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className={styles.card}>
      <div
        className={styles.banner}
        style={{ background: categoryGradient(post.category) }}
      >
        <span className={styles.bannerPill}>{post.category}</span>
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.footer}>
          <span className={styles.author}>{post.author}</span>
          <span className={styles.meta}>
            {post.date}&nbsp;&middot;&nbsp;{post.readTime}
          </span>
        </div>
      </div>
    </Link>
  );
}
