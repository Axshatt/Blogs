import { getAllPosts } from '@/lib/posts';
import { BlogListing } from '@/components/blog/BlogListing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Build logs, tutorials, and creative experiments.',
  alternates: { canonical: '/blog' },
};

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    tag?: string;
    page?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  return <BlogListing allPosts={getAllPosts()} {...await searchParams} />;
}
