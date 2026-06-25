import { getAllPosts } from '@/lib/posts';
import { PostCard } from '@/components/ui/PostCard';
import type { Category } from '@/types/post';
import type { Metadata } from 'next';
import Link from 'next/link';
import { BlogSidebar } from '@/components/ui/BlogSidebar';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Build logs, tutorials, and creative experiments.',
  alternates: { canonical: '/blog' },
};

const CATEGORIES: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All Pillars' },
  { value: 'build-log', label: 'Build Log' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'experiment', label: 'Experiment' },
];

interface BlogPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    tag?: string;
    page?: string;
  }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedParams = await searchParams;
  const category = resolvedParams.category;
  const search = resolvedParams.search;
  const tag = resolvedParams.tag;
  const page = resolvedParams.page;

  const allPosts = getAllPosts();

  // Extract popular tags from all posts (sorted by frequency)
  const tagsMap = new Map<string, number>();
  allPosts.forEach((post) => {
    post.frontmatter.tags?.forEach((t) => {
      tagsMap.set(t, (tagsMap.get(t) || 0) + 1);
    });
  });
  const popularTags = Array.from(tagsMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name]) => name);

  // Apply filters
  let filtered = allPosts;

  const activeCategory = category ?? 'all';

  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.frontmatter.category === category);
  }

  if (tag) {
    filtered = filtered.filter((p) => p.frontmatter.tags?.includes(tag));
  }

  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.frontmatter.title.toLowerCase().includes(query) ||
        p.frontmatter.excerpt.toLowerCase().includes(query) ||
        p.frontmatter.tags?.some((t) => t.toLowerCase().includes(query)) ||
        p.content.toLowerCase().includes(query)
    );
  }

  // Pagination Math
  const currentPage = Number(page || '1');
  const postsPerPage = 9;
  const totalPosts = filtered.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filtered.slice(startIndex, startIndex + postsPerPage);

  // Helper function to build URLs with updated filters
  function getPageUrlWithFilter(updates: { category?: string; tag?: string; search?: string; page?: number }) {
    const params = new URLSearchParams();

    const cat = updates.category !== undefined ? updates.category : category;
    if (cat && cat !== 'all') params.set('category', cat);

    const t = updates.tag !== undefined ? updates.tag : tag;
    if (t) params.set('tag', t);

    const s = updates.search !== undefined ? updates.search : search;
    if (s) params.set('search', s);

    const p = updates.page !== undefined ? updates.page : 1;
    if (p > 1) params.set('page', String(p));

    return `/blog?${params.toString()}`;
  }

  return (
    <div className="min-h-screen px-margin-mobile py-lg md:px-margin-desktop font-sans text-primary">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-xl lg:gap-x-0">
        {/* LEFT COLUMN: Posts Listing */}
        <div className="lg:col-span-8 flex flex-col space-y-md lg:pr-xl lg:border-r lg:border-outline-variant/20">
          {/* Page Title */}
          <div className="border-b border-outline-variant/20 mb-lg px-xl md:px-[56px]">
            <h2 className="pb-md text-body-md font-bold text-primary relative inline-block">
              For you
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
            </h2>
          </div>

          {/* Active Filter Indicators */}
          {(search || tag) && (
            <div className="flex flex-wrap gap-sm items-center text-label-sm uppercase text-on-surface-variant mb-sm">
              <span className="font-bold">Filters:</span>
              {search && (
                <Link
                  href={getPageUrlWithFilter({ search: '' })}
                  className="inline-flex items-center gap-xs border border-outline-variant bg-surface-container-low px-sm py-1 rounded-full hover:border-error hover:text-error"
                >
                  Search: {search}
                  <span className="material-symbols-outlined !text-[14px]">close</span>
                </Link>
              )}
              {tag && (
                <Link
                  href={getPageUrlWithFilter({ tag: '' })}
                  className="inline-flex items-center gap-xs border border-outline-variant bg-surface-container-low px-sm py-1 rounded-full hover:border-error hover:text-error"
                >
                  Tag: #{tag}
                  <span className="material-symbols-outlined !text-[14px]">close</span>
                </Link>
              )}
              <Link
                href="/blog"
                className="text-secondary font-bold underline hover:text-primary"
              >
                Clear All
              </Link>
            </div>
          )}

          {paginatedPosts.length === 0 ? (
            <div className="hairline-a bg-surface-container-low p-xxl text-center">
              <p className="text-body-md text-on-surface-variant">No posts matching your criteria were found.</p>
              {(search || tag || (category && category !== 'all')) && (
                <Link
                  href="/blog"
                  className="text-label-bold inline-flex items-center gap-xs border border-outline-variant px-lg py-sm uppercase mt-md bg-surface hover:bg-surface-container-low"
                >
                  Reset Filters
                </Link>
              )}
            </div>
          ) : (
            <div className="flex flex-col bg-transparent px-xl md:px-[56px] py-xs">
              {paginatedPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-outline-variant/30 pt-xl mt-xl">
              <Link
                href={currentPage > 1 ? getPageUrlWithFilter({ page: currentPage - 1 }) : '#'}
                className={`text-label-bold inline-flex items-center gap-xs border border-outline-variant px-md py-xs uppercase hover:bg-surface-container ${
                  currentPage <= 1 ? 'pointer-events-none opacity-40' : ''
                }`}
              >
                <span className="material-symbols-outlined !text-[18px]">chevron_left</span>
                Prev
              </Link>

              <div className="hidden sm:flex gap-xs">
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  const isActive = pageNum === currentPage;
                  return (
                    <Link
                      key={pageNum}
                      href={getPageUrlWithFilter({ page: pageNum })}
                      className={`w-9 h-9 flex items-center justify-center text-label-bold uppercase border transition-all duration-200 ${
                        isActive
                          ? 'border-primary bg-primary text-on-primary'
                          : 'border-outline-variant hover:border-primary hover:text-primary'
                      }`}
                    >
                      {pageNum}
                    </Link>
                  );
                })}
              </div>

              <span className="text-label-sm sm:hidden uppercase text-on-surface-variant font-bold">
                Page {currentPage} of {totalPages}
              </span>

              <Link
                href={currentPage < totalPages ? getPageUrlWithFilter({ page: currentPage + 1 }) : '#'}
                className={`text-label-bold inline-flex items-center gap-xs border border-outline-variant px-md py-xs uppercase hover:bg-surface-container ${
                  currentPage >= totalPages ? 'pointer-events-none opacity-40' : ''
                }`}
              >
                Next
                <span className="material-symbols-outlined !text-[18px]">chevron_right</span>
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sidebar Filters */}
        <div className="lg:col-span-4 space-y-lg lg:pl-xl">
          <BlogSidebar posts={allPosts} />
        </div>
      </div>
    </div>
  );
}
