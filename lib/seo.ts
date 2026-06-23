import type { Metadata, Viewport } from 'next';
import type { PostFrontmatter } from '@/types/post';

const SITE_URL = 'https://blog.akshatcodes.com';
const SITE_NAME = 'AkshatCodes';
const SITE_DESCRIPTION =
  'Personal log of experiments, technical deep-dives, and aesthetic explorations. Focused on high-performance web experiences and minimalist systems.';

export const viewport: Viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export function getBaseMetadata(): Metadata {
  return {
    metadataBase: new URL(SITE_URL),
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    keywords: [
      'Next.js',
      'React',
      'TypeScript',
      'Web Development',
      'AI Engineering',
      'Full-stack Dev',
      'Design Systems',
      'Akshat Codes',
      'Akshat Singh'
    ],
    authors: [{ name: 'Akshat Singh', url: SITE_URL }],
    creator: 'Akshat Singh',
    publisher: 'Akshat Singh',
    referrer: 'origin-when-cross-origin',
    alternates: {
      canonical: '/',
      types: {
        'application/rss+xml': [{ url: '/rss.xml', title: 'AkshatCodes RSS Feed' }],
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      locale: 'en_US',
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: SITE_NAME,
      description: SITE_DESCRIPTION,
      creator: '@akshatcodes',
      site: '@akshatcodes',
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export function generatePostMetadata(
  frontmatter: PostFrontmatter,
  slug: string
): Metadata {
  const postUrl = `${SITE_URL}/blog/${slug}`;
  const canonicalUrl = frontmatter.canonical_url ?? postUrl;
  const ogImageUrl = frontmatter.coverImage
    ? `${SITE_URL}${frontmatter.coverImage}`
    : `${SITE_URL}/og-image.png`;

  return {
    title: frontmatter.title,
    description: frontmatter.excerpt,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.excerpt,
      url: postUrl,
      type: 'article',
      siteName: SITE_NAME,
      publishedTime: frontmatter.published,
      modifiedTime: frontmatter.published,
      authors: ['Akshat Singh'],
      tags: frontmatter.tags,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.excerpt,
      creator: '@akshatcodes',
      site: '@akshatcodes',
      images: [ogImageUrl],
    },
  };
}

// ── JSON-LD Structured Data Schema Generators ──

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    'name': SITE_NAME,
    'url': SITE_URL,
    'logo': {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#logo`,
      'url': `${SITE_URL}/icon.jpg`,
      'caption': SITE_NAME,
    },
    'sameAs': [
      'https://github.com/Axshatt',
      'https://x.com',
      'https://www.instagram.com/code.akshat.in/',
      'https://linkedin.com'
    ],
  };
}

export function getPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${SITE_URL}/#person`,
    'name': 'Akshat Singh',
    'url': SITE_URL,
    'image': {
      '@type': 'ImageObject',
      '@id': `${SITE_URL}/#personImage`,
      'url': `${SITE_URL}/images/akshat_profile.jpg`,
      'caption': 'Akshat Singh',
    },
    'sameAs': [
      'https://github.com/Axshatt',
      'https://x.com',
      'https://www.instagram.com/code.akshat.in/',
      'https://linkedin.com'
    ],
    'jobTitle': 'Full-stack Developer & AI Engineer',
    'worksFor': {
      '@type': 'Organization',
      'name': SITE_NAME,
      'url': SITE_URL,
    },
  };
}

export function getBlogPostSchema(
  title: string,
  excerpt: string,
  published: string,
  slug: string,
  coverImage?: string,
  author?: string
) {
  const postUrl = `${SITE_URL}/blog/${slug}`;
  const ogImageUrl = coverImage ? `${SITE_URL}${coverImage}` : `${SITE_URL}/og-image.png`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${postUrl}/#post`,
    'headline': title,
    'description': excerpt,
    'image': ogImageUrl,
    'datePublished': published,
    'dateModified': published,
    'author': {
      '@type': 'Person',
      'name': author || 'Akshat Singh',
      'url': SITE_URL,
    },
    'publisher': {
      '@type': 'Organization',
      'name': SITE_NAME,
      'url': SITE_URL,
      'logo': {
        '@type': 'ImageObject',
        'url': `${SITE_URL}/icon.jpg`,
      },
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  };
}

export { SITE_URL, SITE_NAME, SITE_DESCRIPTION };
