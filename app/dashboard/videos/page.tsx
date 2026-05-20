import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import styles from './page.module.css';
import Script from 'next/script';

const VIDEOS = [
  {
    step: 1,
    vimeoId: '995124465',
    title: 'Preparing Your Documents',
    desc: 'Learn how to correctly complete and organize your document package before notarization.',
    duration: '~15 min',
    link: null,
  },
  {
    step: 2,
    vimeoId: '762744851',
    title: 'Notarizing Your Documents',
    desc: 'Step-by-step guidance on getting your documents properly notarized — what to bring, what to say, and what to watch for.',
    duration: '~15 min',
    link: null,
  },
  {
    step: 3,
    vimeoId: '1162836571',
    title: 'Recording Your Documents',
    desc: 'How to file your documents on the public record using SovereignLedger.co. This step officially establishes your status.',
    duration: '~15 min',
    link: { href: 'https://sovereignledger.co', label: 'Visit SovereignLedger.co →' },
  },
  {
    step: 4,
    vimeoId: '766672933',
    title: 'Mailing Your Letters',
    desc: 'How to send certified mail to all appropriate parties, what tracking to keep, and how to confirm receipt.',
    duration: '~15 min',
    link: null,
  },
];

export default async function VideosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Instructional Videos</h1>
      <p className={styles.sub}>
        Watch all four videos before beginning your process. Each video corresponds to one
        step of your status correction journey.
      </p>

      <div className={styles.videoList}>
        {VIDEOS.map(v => (
          <div key={v.step} className={styles.videoCard}>
            <div className={styles.videoEmbed}>
<iframe
  src={`https://player.vimeo.com/video/${v.vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
  referrerPolicy="strict-origin-when-cross-origin"
  allowFullScreen
  frameBorder="0"
  title={v.title}
/>
            </div>
            <div className={styles.videoInfo}>
              <p className={styles.stepLabel}>Step 0{v.step}</p>
              <h2 className={styles.videoTitle}>{v.title}</h2>
              <p className={styles.videoDesc}>{v.desc}</p>
              {v.link && (
                <a
                  href={v.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.videoLink}
                >
                  {v.link.label}
                </a>
              )}
              <span className={styles.durationBadge}>{v.duration}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.callout}>
        <p className={styles.calloutText}>
          Ready to begin? Once you have watched the videos, head to the Document Generator
          to create your package.
        </p>
        <Link href="/dashboard/documents" className={styles.calloutBtn}>
          Go to Document Generator →
        </Link>
      </div>
      <Script src="https://player.vimeo.com/api/player.js" />
    </div>
  );
}
