import { Suspense } from 'react';
import { getAllPosts } from '@/lib/posts';
import { StaticBlogFilters } from '@/components/blog/StaticBlogFilters';

import { BlogListing } from '@/components/blog/BlogListing';

export const metadata = { title: 'Blog', description: 'Build logs, tutorials, and creative experiments.', alternates: { canonical: '/blog' } };

export default function BlogPage() {
  const posts = getAllPosts();
  return (
    <Suspense fallback={<BlogListing allPosts={posts} />}>
      <StaticBlogFilters posts={posts} />
    </Suspense>
  );
}
