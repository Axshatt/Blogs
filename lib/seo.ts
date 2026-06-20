import type { Metadata } from 'next';
import type { PostFrontmatter } from '@/types/post';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://akshatcodes.com';
const SITE_NAME = 'AKSHATCODES';
const SITE_DESCRIPTION =
  'Personal log of experiments, technical deep-dives, and aesthetic explorations. Focused on high-performance web experiences and minimalist systems.';

export function getBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
    description: SITE_DESCRIPTION,
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
    },
    robots: { index: true, follow: true },
  };
}

export function generatePostMetadata(
  frontmatter: PostFrontmatter,
  slug: string
): Metadata {
  const postUrl = `${SITE_URL}/blog/${slug}`;
  const canonicalUrl = frontmatter.canonical_url ?? postUrl;

  return {
    title: frontmatter.title,
    description: frontmatter.excerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.excerpt,
      url: postUrl,
      type: 'article',
      publishedTime: frontmatter.published,
      tags: frontmatter.tags,
      ...(frontmatter.coverImage
        ? { images: [{ url: `${SITE_URL}${frontmatter.coverImage}` }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.excerpt,
    },
  };
}

export { SITE_URL, SITE_NAME, SITE_DESCRIPTION };
