import { notFound } from 'next/navigation';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import SectionLabel from '../../components/SectionLabel';
import BlogCard from '../../components/BlogCard';
import { getPostBySlug, getAllSlugs, blogPosts } from '../../../lib/blog';
import styles from './page.module.css';

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return {
    title: post ? `${post.title} | ASN Consulting Blog` : 'Post Not Found',
    description: post?.excerpt ?? '',
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = blogPosts.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <Nav />
      <main>

        {/* ── Post header ── */}
        <section className={styles.postHeader}>
          <div className={styles.headerInner}>
            <div className={styles.breadcrumb}>
              <a href="/">Home</a>
              <span>/</span>
              <a href="/blog">Blog</a>
              <span>/</span>
              <span className={styles.breadcrumbCategory}>{post.category}</span>
            </div>
            <span className={styles.categoryPill}>{post.category}</span>
            <h1 className={styles.postH1}>{post.title}</h1>
            <div className={styles.postMeta}>
              <span>{post.author}</span>
              <span className={styles.metaDot}>·</span>
              <span>{post.date}</span>
              <span className={styles.metaDot}>·</span>
              <span>{post.readTime}</span>
            </div>
            <hr className={styles.headerRule} />
          </div>
        </section>

        {/* ── Post body ── */}
        <section className={styles.postBodySection}>
          <div className={styles.bodyInner}>
            <div
              className={styles.postBody}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </section>

        {/* ── Post footer ── */}
        <div className={styles.postFooter}>
          <div className={styles.footerInner}>
            <hr className={styles.footerRule} />
            <div className={styles.footerRow}>
              <span className={styles.shareLabel}>Share this article</span>
              <a href="/blog" className={styles.backLink}>← Back to Blog</a>
            </div>
          </div>
        </div>

        {/* ── Related posts ── */}
        {relatedPosts.length > 0 && (
          <section className={styles.relatedSection}>
            <div className={styles.relatedInner}>
              <div className={styles.relatedHeader}>
                <SectionLabel text="Keep Reading" centered />
                <h2 className={styles.relatedH2}>More from ASN Consulting</h2>
              </div>
              <div className={styles.relatedGrid}>
                {relatedPosts.map((p) => (
                  <BlogCard key={p.slug} post={p} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA Banner ── */}
        <section className={styles.ctaBanner}>
          <div className={styles.ctaInner}>
            <div className={styles.ctaLeft}>
              <div className={styles.ctaLabel}>Ready to take action?</div>
              <h3 className={styles.ctaH3}>Book a free strategy call with our team</h3>
            </div>
            <div className={styles.ctaRight}>
              <a href="/services" className={styles.primaryBtn}>Book a Call</a>
              <a href="/done-for-you-services" className={styles.outlineBtn}>View Services</a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
