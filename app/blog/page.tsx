'use client';

import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import SectionLabel from '../components/SectionLabel';
import BlogCard from '../components/BlogCard';
import { blogPosts, categories } from '../../lib/blog';
import styles from './page.module.css';

export default function BlogIndexPage() {
  const [activeCategory, setActiveCategory] = useState('All Posts');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filteredPosts =
    activeCategory === 'All Posts'
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim()) setSubscribed(true);
  }

  return (
    <>
      <Nav />
      <main>

        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.breadcrumb}>
              <a href="/">Home</a>
              <span>/</span>
              <span>Blog</span>
            </div>
            <SectionLabel text="Education &amp; Insights" centered />
            <h1 className={styles.heroH1}>
              The ASN Consulting<br />Blog
            </h1>
            <p className={styles.heroSub}>
              Educational articles on status correction, private trusts, lawful tax strategy,
              and financial sovereignty. The more you understand the system, the better
              equipped you are to navigate it.
            </p>
          </div>
        </section>

        {/* ── Category filter ── */}
        <div className={styles.filterBar}>
          <div className={styles.filterInner}>
            {categories.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterPill} ${activeCategory === cat ? styles.filterPillActive : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Posts grid ── */}
        <section className={styles.postsSection}>
          <div className={styles.postsInner}>
            <div className={styles.postCount}>
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            </div>

            {filteredPosts.length > 0 ? (
              <div className={styles.postsGrid}>
                {filteredPosts.map((post) => (
                  <BlogCard key={post.slug} post={post} />
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <p className={styles.emptyText}>No posts in this category yet.</p>
                <button
                  className={styles.emptyBtn}
                  onClick={() => setActiveCategory('All Posts')}
                >
                  View All Posts
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ── Newsletter CTA ── */}
        <section className={styles.newsletter}>
          <div className={styles.newsletterInner}>
            <SectionLabel text="Stay Informed" centered />
            <h2 className={styles.newsletterH2}>Get new articles delivered to your inbox</h2>
            <p className={styles.newsletterSub}>
              Educational content on status correction, trusts, and tax strategy — no spam,
              just substance.
            </p>
            {subscribed ? (
              <p className={styles.subscribedMsg}>
                You&apos;re subscribed. Welcome to the movement.
              </p>
            ) : (
              <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  className={styles.emailInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit" className={styles.subscribeBtn}>Subscribe</button>
              </form>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
