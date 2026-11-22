import { getAllPosts } from '@/lib/posts';
import { getNewsletters } from '@/lib/db';
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from '@/lib/seo';

export const dynamic = 'force-static';

export async function GET() {
  const posts = getAllPosts();
  
  let newsletters: any[] = [];
  try {
    newsletters = process.env.PAGES_EXPORT === 'true' ? [] : await getNewsletters('sent');
  } catch (e) {
    console.error('Failed to load newsletters for llms.txt:', e);
  }

  const postsMarkdown = posts
    .map((post) => {
      const url = `${SITE_URL}/blog/${post.slug}`;
      const desc = post.frontmatter.excerpt;
      const category = post.frontmatter.category;
      const published = new Date(post.frontmatter.published).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return `- [${post.frontmatter.title}](${url}): ${desc} (Published: ${published}, Category: ${category}, Reading Time: ${post.readingTime})`;
    })
    .join('\n');

  const newslettersMarkdown = newsletters
    .map((issue) => {
      const url = `${SITE_URL}/newsletter/${issue.slug}`;
      const published = issue.sent_at 
        ? new Date(issue.sent_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : '';
      return `- [${issue.title}](${url})${published ? ` (Sent: ${published})` : ''}`;
    })
    .join('\n');

  const markdown = `# ${SITE_NAME}
> ${SITE_DESCRIPTION}

This file provides a structured, LLM-friendly index of pages, guides, recent articles, and newsletter updates published on ${SITE_NAME}.

## Core Pages

- [Homepage](${SITE_URL}/): The main landing page with post highlights, projects, and email subscription.
- [Blog](${SITE_URL}/blog): The directory of articles, system build logs, and experiments.
${process.env.PAGES_EXPORT === 'true' ? '' : `- [Newsletter](${SITE_URL}/newsletter): Subscriptions and digital archive of periodic insights.\n`}- [About](${SITE_URL}/about): Professional bio, contact info, and technology stack of Akshat Singh.

## Feeds and Metadata

- [Sitemap](${SITE_URL}/sitemap.xml): The XML sitemap index.
- [RSS Feed](${SITE_URL}/rss.xml): The RSS feed file for syndication.

## Blog Posts

${postsMarkdown || 'No posts available.'}
${newslettersMarkdown ? `\n## Newsletter Archive\n\n${newslettersMarkdown}` : ''}
`;

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
