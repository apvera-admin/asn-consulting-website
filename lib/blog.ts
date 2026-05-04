/**
 * HOW TO ADD FULL BLOG CONTENT:
 *
 * 1. Open lib/blog.ts
 * 2. Find the post by its slug
 * 3. Replace the content field placeholder with the full HTML content
 * 4. Format the content as an HTML string using these tags:
 *    - Paragraphs:   <p>Text here</p>
 *    - Headings:     <h2>Section Title</h2> or <h3>Subheading</h3>
 *    - Bold:         <strong>bold text</strong>
 *    - Italic/gold:  <em>italic text</em>
 *    - Lists:        <ul><li>Item</li></ul> or <ol><li>Item</li></ol>
 *    - Quotes:       <blockquote>Quote text</blockquote>
 *    - Links:        <a href="/url">link text</a>
 *    - Divider:      <hr />
 * 5. Save the file — Vercel will auto-deploy
 *
 * EXAMPLE:
 * content: `
 *   <p>First paragraph here.</p>
 *   <h2>Section One</h2>
 *   <p>More content here.</p>
 *   <ul>
 *     <li>List item one</li>
 *     <li>List item two</li>
 *   </ul>
 * `,
 */

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  author: string;
  content: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'introducing-the-american-federation-dollar',
    title: 'Introducing the American Federation Dollar (AFD): A Gold-Backed Digital Currency Transforming Global Finance',
    excerpt: 'The American Federation Treasury proudly announces the official launch of the American Federation Dollar (AFD), a groundbreaking gold-backed digital currency engineered to provide a stable, secure, and transparent alternative to traditional fiat currencies.',
    date: 'February 26, 2025',
    readTime: '3 min read',
    category: 'Need To Know',
    author: 'ASN Consulting',
    content: `
      <p>The American Federation Treasury proudly announces the official launch of the American Federation Dollar (AFD), a groundbreaking gold-backed digital currency engineered to provide a stable, secure, and transparent alternative to traditional fiat currencies.</p>
      <h2>What Is the American Federation Dollar?</h2>
      <p>The AFD is a digital currency backed by physical gold reserves — meaning every unit in circulation corresponds to a tangible store of value. Unlike Federal Reserve Notes, which are debt instruments issued by a private central bank, the AFD is designed to operate outside the fractional reserve banking system.</p>
      <h2>Why This Matters</h2>
      <p>For decades, Americans have watched the purchasing power of the dollar erode through inflation, monetary expansion, and systemic debt. The AFD represents a lawful alternative — a medium of exchange grounded in real value rather than government decree.</p>
      <blockquote>A currency backed by gold is a currency backed by honest labor and real production — not promises and debt.</blockquote>
      <h2>How to Learn More</h2>
      <p>Full details on the AFD — including how to acquire it, how it is backed, and how it fits into a broader sovereignty strategy — will be covered in upcoming articles and webinars. Stay tuned to the ASN Consulting blog for updates.</p>
      <p>If you have questions about how lawful money and currency alternatives relate to your personal financial strategy, book a discovery call with our team.</p>
    `,
  },
  {
    slug: 'introducing-project-1040-x',
    title: 'Introducing Project 1040-X: Futuristic Tax Filing is Now',
    excerpt: 'ASN Consulting has a new tax service offering in the pike just in time for Tax Season — discover how Project 1040-X can help you recover taxes you have already paid.',
    date: 'February 24, 2025',
    readTime: '5 min read',
    category: 'Tax Remedy',
    author: 'ASN Consulting',
    content: `
      <p>ASN Consulting is proud to introduce <strong>Project 1040-X</strong> — a specialized tax amendment service designed to help qualifying Americans recover income taxes they have already paid to the IRS.</p>
      <h2>What Is a 1040-X?</h2>
      <p>A Form 1040-X is the IRS's own mechanism for amending a previously filed tax return. When properly prepared and filed, it can result in a refund of taxes paid in prior years — along with applicable interest.</p>
      <p>Most tax professionals either do not know this process exists or do not know how to apply it using established law. We do.</p>
      <h2>Who Qualifies?</h2>
      <p>Project 1040-X is designed for individuals who:</p>
      <ul>
        <li>Have paid <strong>$20,000 or more</strong> in income taxes for a given year</li>
        <li>Have filed tax returns for one or more years they wish to amend</li>
        <li>Are willing to provide their tax documents for review</li>
      </ul>
      <h2>How the Pricing Works</h2>
      <p>We charge an upfront fee of <strong>$1,250 – $5,000+</strong> based on complexity (filing status, number of states, years involved). We also collect <strong>32% of whatever refund you receive</strong>. If you receive nothing, we collect nothing on the contingency portion.</p>
      <blockquote>We only win when you win. That is how we like it.</blockquote>
      <h2>What We Do For You</h2>
      <ul>
        <li>Assessment of your prior year returns</li>
        <li>Preparation of all amended returns</li>
        <li>We mail your amended returns to the correct IRS offices on your behalf</li>
        <li>Three coaching calls with our tax team</li>
        <li>IRS correspondence — completely handled for you</li>
      </ul>
      <h2>Get Started</h2>
      <p>Book a discovery call or fill out our inquiry form on the <a href="/tax-remedy-services">Tax Consulting page</a> to get started. Our team will review your situation and let you know if you qualify within 1–2 business days.</p>
    `,
  },
  {
    slug: '10-little-known-income-tax-secrets',
    title: '10 Little-Known Income Tax Secrets That Could Save You Big!',
    excerpt: 'Every year, millions of Americans file tax returns and give a portion of their hard-earned income to the government — often more than they are legally obligated to. Today, we demystify the often-confusing world of taxation.',
    date: 'February 24, 2025',
    readTime: '3 min read',
    category: 'Tax Remedy',
    author: 'ASN Consulting',
    content: `
      <p>Every year, millions of Americans file tax returns and hand over a portion of their hard-earned income to the government — often far more than they are legally obligated to pay. The tax code is not designed to be simple. It is designed to be navigated by those who know it.</p>
      <p>Today, we pull back the curtain on ten things the system would rather you not know.</p>
      <h2>1. The IRS Is a Collection Agency, Not a Court</h2>
      <p>The IRS has no judicial authority. It cannot issue binding legal orders — it can only send notices and attempt to collect. Understanding this distinction changes how you interact with correspondence.</p>
      <h2>2. Most Income Tax Is Voluntary</h2>
      <p>The word "voluntary" appears throughout the Internal Revenue Code and IRS publications. This does not mean you can simply stop filing — it means the system was designed around voluntary compliance, which has specific legal implications.</p>
      <h2>3. Federal Reserve Notes Are Not Lawful Money</h2>
      <p>Under 12 U.S.C. § 411, Federal Reserve Notes are <em>obligations of the United States</em> — not lawful money as defined by Article I of the Constitution. This distinction forms the legal basis for Lawful Money Redemption.</p>
      <h2>4. You Can Amend Returns for Up to Three Years Back</h2>
      <p>The IRS allows amended returns via Form 1040-X for up to three years from the original filing date (or two years from the date the tax was paid). This means overpayments from prior years are potentially recoverable.</p>
      <h2>5. Withholding Is Not the Same as Tax Liability</h2>
      <p>Your employer withholds money from your paycheck — but withholding is not synonymous with owing tax. Many people overpay through withholding and never reclaim the difference.</p>
      <h2>6. The W-4 Is a Voluntary Contract</h2>
      <p>The W-4 form — which determines how much your employer withholds — is a voluntary election. Understanding what you are agreeing to when you sign it is essential.</p>
      <h2>7. Capital Gains Tax Is Also Subject to Lawful Money Principles</h2>
      <p>The same legal principles that apply to income tax under Lawful Money Redemption also apply to capital gains. This includes cryptocurrency transactions.</p>
      <h2>8. You Do Not Need a Lawyer to Respond to IRS Notices</h2>
      <p>Most IRS notices are form letters generated automatically. Many can be responded to directly with proper knowledge — no attorney required.</p>
      <h2>9. The IRC Defines "Income" Very Specifically</h2>
      <p>The Internal Revenue Code has a specific legal definition of "income" that differs from the common-sense understanding of the word. Understanding the legal definition is the foundation of any lawful tax strategy.</p>
      <h2>10. There Is a Lawful Path to Non-Obligation</h2>
      <p>Through proper use of established law — specifically the redemption of lawful money under 12 U.S.C. § 411 — it is possible to become legally non-obligated for income and capital gains taxes on a going-forward basis. This is not a loophole. It is the law.</p>
      <hr />
      <p>Want to learn how these principles apply to your specific situation? <a href="/tax-remedy-services">Explore our tax consulting services</a> or book a discovery call with our team.</p>
    `,
  },
  {
    slug: 'revocation-of-election-to-pay-taxes',
    title: 'Revocation Of Election To Pay Taxes',
    excerpt: 'Why Our Revocation of Election Packet is So Powerful: Reclaim Your Rights as a Living Man or Woman when it comes to breaking free from the tax system.',
    date: 'July 13, 2022',
    readTime: '4 min read',
    category: 'Tax Remedy',
    author: 'ASN Consulting',
    content: `
      <p>One of the most powerful tools in our tax remedy arsenal is the <strong>Revocation of Election to Pay Taxes</strong> — a document-based process that formally withdraws a prior election to be subject to income tax under the Internal Revenue Code.</p>
      <h2>What Is a Revocation of Election?</h2>
      <p>Under the Internal Revenue Code, certain tax obligations arise from an <em>election</em> — a voluntary choice made by the taxpayer. If an election was made, it can, in certain circumstances, be revoked. The Revocation of Election (ROE) is the formal mechanism for doing so.</p>
      <p>This is not tax evasion. This is the lawful withdrawal of a prior voluntary agreement — using the IRS's own procedures and established law.</p>
      <h2>Why This Document Is So Powerful</h2>
      <p>Most Americans have never been told that their participation in the income tax system involved any kind of election on their part. The ROE process begins with understanding that it did — and that elections can be revoked.</p>
      <blockquote>You cannot be held to an agreement you did not knowingly make. The ROE puts this principle into formal legal action.</blockquote>
      <h2>What Is Included in Our ROE Packet</h2>
      <ul>
        <li>The Revocation of Election document itself — properly formatted</li>
        <li>Filing and mailing instructions for your specific situation</li>
        <li>Instructional videos covering the notarization and filing process (available separately)</li>
      </ul>
      <h2>Who Should Consider the ROE?</h2>
      <p>The ROE is particularly relevant for individuals who:</p>
      <ul>
        <li>Have already completed or are in the process of status correction</li>
        <li>Want to formally document their non-obligated status regarding income tax</li>
        <li>Are looking for a standalone document to add to their sovereignty paperwork</li>
      </ul>
      <h2>How to Get Started</h2>
      <p>The ROE packet is available as a standalone purchase through our <a href="/services/diy">DIY Programs</a>. Instructional videos are available separately. If you want guidance through the process, our <a href="/tax-remedy-services">tax consulting team</a> can walk you through every step.</p>
    `,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

export const categories = [
  'All Posts',
  'The IRS',
  'Birth Certificate',
  'Correcting Status',
  'Marriage Paperwork',
  'Need To Know',
  'Tax Remedy',
];
