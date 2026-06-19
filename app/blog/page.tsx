import { getAllPosts } from '@/lib/posts';
import { PostCard } from '@/components/ui/PostCard';
import type { Category } from '@/types/post';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Build logs, AI/automation tutorials, and creative experiments.',
};

const CATEGORIES: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'build-log', label: 'Build Log' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'experiment', label: 'Experiment' },
];

interface BlogPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { category } = await searchParams;
  const allPosts = getAllPosts();

  const filtered =
    category && category !== 'all'
      ? allPosts.filter((p) => p.frontmatter.category === category)
      : allPosts;

  const activeCategory = category ?? 'all';

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-2 font-mono text-xs uppercase tracking-widest text-zinc-600">
          /blog
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-zinc-100">
          All Posts
        </h1>
        <p className="text-base text-zinc-500">
          {allPosts.length} posts across 3 pillars
        </p>
      </div>

      {/* Category filters */}
      <div className="mb-8 flex flex-wrap gap-2" role="tablist">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.value;
          const count =
            cat.value === 'all'
              ? allPosts.length
              : allPosts.filter((p) => p.frontmatter.category === cat.value)
                  .length;
          return (
            <Link
              key={cat.value}
              href={cat.value === 'all' ? '/blog' : `/blog?category=${cat.value}`}
              role="tab"
              aria-selected={isActive}
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-1.5 font-mono text-xs transition-all duration-200 ${
                isActive
                  ? 'border-violet-500/40 bg-violet-500/10 text-violet-300'
                  : 'border-white/5 bg-transparent text-zinc-500 hover:border-white/10 hover:text-zinc-400'
              }`}
            >
              {cat.label}
              <span
                className={`rounded px-1 py-0.5 text-[10px] ${
                  isActive ? 'bg-violet-500/20 text-violet-400' : 'bg-white/5 text-zinc-600'
                }`}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Post list */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-12 text-center">
          <p className="font-mono text-sm text-zinc-600">No posts in this category yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
