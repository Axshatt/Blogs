'use client';

import { useSearchParams } from 'next/navigation';
import type { Post } from '@/types/post';
import { BlogListing } from './BlogListing';

export function StaticBlogFilters({ posts }: { posts: Post[] }) {
  const query = useSearchParams();
  return <BlogListing category={query.get('category') ?? undefined} tag={query.get('tag') ?? undefined}
    search={query.get('search') ?? undefined} page={query.get('page') ?? undefined} allPosts={posts} />;
}
