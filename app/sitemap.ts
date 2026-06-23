import type { MetadataRoute } from 'next';
import { getAllPosts } from '@/lib/posts';
import { SITE_URL } from '@/lib/seo';
import { getNewsletters } from '@/lib/db';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getAllPosts();
  
  let newsletters: any[] = [];
  try {
    newsletters = await getNewsletters('sent');
  } catch (e) {
    console.error('Failed to load newsletters for sitemap:', e);
  }

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/blog`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/newsletter`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.frontmatter.published),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const newsletterPages: MetadataRoute.Sitemap = newsletters.map((issue) => ({
    url: `${SITE_URL}/newsletter/${issue.slug}`,
    lastModified: issue.sent_at ? new Date(issue.sent_at) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...staticPages, ...postPages, ...newsletterPages];
}
