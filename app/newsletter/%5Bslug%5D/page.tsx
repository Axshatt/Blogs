import { getNewsletterBySlug, getNewsletters } from '@/lib/db';
import { markdownToHtml } from '@/lib/resend';
import { ShareButtons } from '@/components/ui/ShareButtons';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import readingTime from 'reading-time';
import { SITE_URL } from '@/lib/seo';

type Params = Promise<{ slug: string }>;

interface PageProps {
  params: Params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getNewsletterBySlug(slug);
  if (!issue) return {};

  const cleanExcerpt = issue.content
    .replace(/#+\s+.*$/gm, '')
    .replace(/!\[.*\]\(.*\)/g, '')
    .replace(/\[(.*)\]\(.*\)/g, '$1')
    .substring(0, 150)
    .trim();

  return {
    description: cleanExcerpt,
    alternates: {
      canonical: `${SITE_URL}/newsletter/${issue.slug}`,
    },
    openGraph: {
      title: issue.title,
      description: cleanExcerpt,
      type: 'article',
      url: `${SITE_URL}/newsletter/${issue.slug}`,
    },
  };
}

export default async function NewsletterIssuePage({ params }: PageProps) {
  const { slug } = await params;
  const issue = await getNewsletterBySlug(slug);

  if (!issue || issue.status !== 'sent') {
    notFound();
  }

  const date = issue.sent_at
    ? new Date(issue.sent_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';

  const stats = readingTime(issue.content);
  const htmlContent = markdownToHtml(issue.content);
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/newsletter/${issue.slug}`;

  // Fetch related issues (2 other sent issues)
  const allSent = await getNewsletters('sent');
  const relatedIssues = allSent.filter((n) => n.id !== issue.id).slice(0, 2);

  return (
    <div className="mx-auto max-w-3xl px-margin-mobile py-xxl md:px-margin-desktop">
      {/* Back button */}
      <div className="mb-lg">
        <Link
          href="/newsletter"
          className="group inline-flex items-center gap-xs text-label-sm font-semibold uppercase text-on-surface-variant hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined !text-[16px] transition-transform group-hover:-translate-x-0.5">
            arrow_back
          </span>
          Archive
        </Link>
      </div>

      <article className="space-y-xl pb-xxl border-b border-outline-variant/20">
        {/* Header Metadata */}
        <header className="space-y-md">
          <div className="flex items-center gap-sm text-label-sm text-on-surface-variant/75">
            <span>{date}</span>
            <span>•</span>
            <span>{stats.text}</span>
          </div>
          <h1 className="text-headline-xl md:text-display-lg-mobile font-black tracking-tighter text-primary leading-tight">
            {issue.title}
          </h1>
        </header>

        {/* Share Buttons */}
        <div className="flex justify-between items-center py-xs border-y border-outline-variant/10">
          <div className="text-label-sm text-on-surface-variant/75">
            Written by Akshat Codes
          </div>
          <ShareButtons title={issue.title} url={shareUrl} />
        </div>

        {/* Content Body */}
        <div
          className="prose-content text-body-lg text-on-surface-variant leading-relaxed space-y-md"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </article>

      {/* Related Newsletters */}
      {relatedIssues.length > 0 && (
        <section className="py-xxl">
          <h3 className="text-headline-sm font-extrabold tracking-tight mb-xl">
            Related Newsletters
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
            {relatedIssues.map((related) => {
              const rDate = related.sent_at
                ? new Date(related.sent_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : 'N/A';
              const rStats = readingTime(related.content);

              return (
                <div
                  key={related.id}
                  className="hairline-a bg-surface hover:bg-surface-container-low rounded-lg p-lg flex flex-col justify-between gap-md transition-all duration-300 group"
                >
                  <div className="space-y-xs">
                    <div className="text-[11px] font-semibold text-on-surface-variant/70 uppercase tracking-wider flex gap-sm">
                      <span>{rDate}</span>
                      <span>•</span>
                      <span>{rStats.text}</span>
                    </div>
                    <h4 className="text-body-lg font-bold group-hover:text-secondary transition-colors line-clamp-2">
                      <Link href={`/newsletter/${related.slug}`}>
                        {related.title}
                      </Link>
                    </h4>
                  </div>
                  <div className="pt-sm">
                    <Link
                      href={`/newsletter/${related.slug}`}
                      className="text-label-bold uppercase border-b border-primary hover:text-secondary hover:border-secondary transition-colors"
                    >
                      Read Now
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
export const dynamic = 'force-dynamic';
