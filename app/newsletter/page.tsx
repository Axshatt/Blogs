import { getNewsletters } from '@/lib/db';
import Link from 'next/link';
import type { Metadata } from 'next';
import readingTime from 'reading-time';

export const metadata: Metadata = {
  description: 'Public archive of previous weekly newsletter issues covering development, design, and AI engineering.',
  alternates: { canonical: '/newsletter' },
};

export default async function NewsletterArchivePage() {
  const sentNewsletters = await getNewsletters('sent');

  return (
    <div className="mx-auto max-w-4xl px-margin-mobile py-xxl md:px-margin-desktop">
      <header className="mb-xl text-left border-b border-outline-variant/20 pb-lg">
        <h1 className="text-display-lg-mobile md:text-display-lg font-black tracking-tighter text-primary mb-md">
          Newsletter Archive
        </h1>
        <p className="text-body-lg text-on-surface-variant max-w-2xl leading-relaxed">
          Weekly updates on building clean software, premium UI design systems, and AI engineering tinkering. Sent every Saturday morning.
        </p>
      </header>

      {sentNewsletters.length === 0 ? (
        <div className="hairline-a bg-surface-container-low p-xxl text-center rounded-lg">
          <p className="text-body-md text-on-surface-variant">
            No newsletter issues have been archived yet. Stay tuned!
          </p>
          <div className="pt-lg">
            <Link
              href="/"
              className="text-label-bold uppercase border-b border-primary hover:text-secondary hover:border-secondary transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-xl">
          {sentNewsletters.map((issue) => {
            const date = issue.sent_at
              ? new Date(issue.sent_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : 'N/A';
            const stats = readingTime(issue.content);
            
            // Extract a clean snippet (removing Markdown headers and images)
            const cleanSnippet = issue.content
              .replace(/#+\s+.*$/gm, '') // Remove headers
              .replace(/!\[.*\]\(.*\)/g, '') // Remove images
              .replace(/\[(.*)\]\(.*\)/g, '$1') // Clean links
              .substring(0, 180) + '...';

            return (
              <article key={issue.id} className="group flex flex-col md:flex-row md:items-start justify-between gap-md border-b border-outline-variant/15 pb-xl last:border-b-0 last:pb-0">
                <div className="flex-1 space-y-sm">
                  <div className="flex items-center gap-sm text-label-sm text-on-surface-variant/75">
                    <span>{date}</span>
                    <span>•</span>
                    <span>{stats.text}</span>
                  </div>
                  <h2 className="text-headline-md font-extrabold tracking-tight group-hover:text-secondary transition-colors">
                    <Link href={`/newsletter/${issue.slug}`}>
                      {issue.title}
                    </Link>
                  </h2>
                  <p className="text-body-md text-on-surface-variant leading-relaxed line-clamp-2 max-w-2xl">
                    {cleanSnippet}
                  </p>
                </div>
                <div className="shrink-0 pt-xs md:pt-md">
                  <Link
                    href={`/newsletter/${issue.slug}`}
                    className="text-label-bold uppercase border-b border-primary group-hover:border-secondary group-hover:text-secondary transition-colors"
                  >
                    Read Issue
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
export const dynamic = 'force-dynamic';
