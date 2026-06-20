import { getAllPosts } from '@/lib/posts';
import { PostCard } from '@/components/ui/PostCard';
import type { Category } from '@/types/post';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - AkshatCodes',
  description: 'Build logs, tutorials, and creative experiments.',
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
    <div className="min-h-screen px-margin-mobile py-xxl md:px-margin-desktop font-sans text-primary">
      {/* Page Title */}
      <div className="mb-xl border-b border-outline-variant pb-md">
        <h1 className="text-display-lg-mobile md:text-display-lg uppercase tracking-tight">
          All Builds<span className="text-secondary">.</span>
        </h1>
        <p className="text-body-lg mt-xs text-on-surface-variant uppercase font-inter tracking-tight">
          Explore cases, tutorials, and direct logs of what I am creating.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* LEFT COLUMN: Posts Listing */}
        <div className="lg:col-span-8 flex flex-col space-y-md">
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
                  className="text-label-bold inline-flex items-center gap-xs border border-outline-variant px-lg py-sm uppercase mt-md bg-white hover:bg-surface-container-low"
                >
                  Reset Filters
                </Link>
              )}
            </div>
          ) : (
            <div className="grid gap-gutter">
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
        <div className="lg:col-span-4 space-y-lg">
          {/* Search Input Panel */}
          <div className="border border-outline-variant/40 bg-white p-lg shadow-sm">
            <h3 className="text-label-bold uppercase text-primary border-b border-outline-variant/20 pb-xs mb-md">
              Search articles
            </h3>
            <form action="/blog" method="GET" className="relative">
              {category && category !== 'all' && (
                <input type="hidden" name="category" value={category} />
              )}
              {tag && (
                <input type="hidden" name="tag" value={tag} />
              )}
              <input
                type="text"
                name="search"
                defaultValue={search || ''}
                placeholder="Search..."
                className="w-full border border-outline-variant bg-surface px-md py-sm text-body-md font-sans focus:border-primary focus:outline-none"
              />
              <button
                type="submit"
                className="absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary cursor-pointer"
              >
                <span className="material-symbols-outlined !text-[20px]">search</span>
              </button>
            </form>
          </div>

          {/* Category Panel */}
          <div className="border border-outline-variant/40 bg-white p-lg shadow-sm">
            <h3 className="text-label-bold uppercase text-primary border-b border-outline-variant/20 pb-xs mb-md">
              Content Pillars
            </h3>
            <div className="space-y-sm">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.value;
                const count =
                  cat.value === 'all'
                    ? allPosts.length
                    : allPosts.filter((p) => p.frontmatter.category === cat.value).length;
                return (
                  <Link
                    key={cat.value}
                    href={getPageUrlWithFilter({ category: cat.value, page: 1 })}
                    className={`flex items-center justify-between text-body-md py-xs px-sm uppercase font-bold transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-on-primary'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-label-sm px-xs py-0.5 rounded ${
                        isActive ? 'bg-white/20 text-white' : 'bg-surface-container text-on-surface-variant'
                      }`}
                    >
                      {count}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Popular Tags Panel */}
          {popularTags.length > 0 && (
            <div className="border border-outline-variant/40 bg-white p-lg shadow-sm">
              <h3 className="text-label-bold uppercase text-primary border-b border-outline-variant/20 pb-xs mb-md">
                Popular Tags
              </h3>
              <div className="flex flex-wrap gap-xs">
                {popularTags.map((t) => {
                  const isActive = tag === t;
                  return (
                    <Link
                      key={t}
                      href={getPageUrlWithFilter({ tag: isActive ? '' : t, page: 1 })}
                      className={`text-label-sm border px-sm py-0.5 uppercase transition-all duration-200 ${
                        isActive
                          ? 'border-primary bg-primary text-on-primary'
                          : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                      }`}
                    >
                      #{t}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
