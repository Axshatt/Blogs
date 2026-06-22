import { getAllPosts } from '@/lib/posts';
import type { Metadata } from 'next';
import { LibraryClient } from './LibraryClient';

export const metadata: Metadata = {
  title: 'Your Library - AkshatCodes',
  description: 'Your saved reading list and bookmarked posts.',
};

export default function LibraryPage() {
  const allPosts = getAllPosts();

  // Serialize posts for the client component
  const postsData = allPosts.map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    excerpt: p.frontmatter.excerpt,
    coverImage: p.frontmatter.coverImage || null,
    published: p.frontmatter.published,
    category: p.frontmatter.category,
    tags: p.frontmatter.tags,
    readingTime: p.readingTime,
  }));

  return <LibraryClient posts={postsData} />;
}
