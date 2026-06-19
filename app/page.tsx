import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { PostCard } from '@/components/ui/PostCard';
import type { Category } from '@/types/post';

const CATEGORIES: { value: Category | 'all'; label: string }[] = [
  { value: 'all', label: 'All Posts' },
  { value: 'build-log', label: 'Build Log' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'experiment', label: 'Experiment' },
];

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <div className="relative overflow-hidden">
      {/* Grid background */}
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-100" />

      {/* Gradient orbs */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-[30%] -left-20 h-[300px] w-[400px] rounded-full bg-sky-600/8 blur-[100px]" />

      {/* Hero */}
      <section className="relative mx-auto max-w-4xl px-6 pb-20 pt-28">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/5 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="font-mono text-[11px] text-violet-400 tracking-wider uppercase">
            Developer · AI Creator · Agency Owner
          </span>
        </div>

        <h1 className="mb-6 max-w-2xl text-5xl font-bold leading-tight tracking-tight text-zinc-100 lg:text-6xl">
          Building in public.{' '}
          <span className="bg-gradient-to-r from-violet-400 to-sky-400 bg-clip-text text-transparent animate-gradient">
            Shipping in real time.
          </span>
        </h1>

        <p className="mb-8 max-w-xl text-lg leading-relaxed text-zinc-400">
          Behind-the-scenes build logs, practical AI &amp; automation tutorials,
          and creative experiments — from the intersection of code, AI, and
          indie game dev.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/blog"
            className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-violet-500/20 transition-all hover:bg-violet-500 hover:shadow-violet-500/30"
          >
            Browse all posts →
          </Link>
          <Link
            href="/about"
            className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-zinc-300 transition-all hover:border-white/20 hover:bg-white/5"
          >
            About me
          </Link>
        </div>

        {/* Category quick links */}
        <div className="mt-10 flex flex-wrap gap-2">
          {CATEGORIES.filter((c) => c.value !== 'all').map((cat) => (
            <Link
              key={cat.value}
              href={`/blog?category=${cat.value}`}
              className="rounded border border-white/5 bg-white/[0.03] px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500 transition-all hover:border-white/10 hover:text-zinc-400"
            >
              /{cat.value}
            </Link>
          ))}
        </div>
      </section>

      {/* Recent posts */}
      <section className="relative mx-auto max-w-4xl px-6 pb-24">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Recent Posts
          </h2>
          <Link
            href="/blog"
            className="font-mono text-xs text-zinc-600 transition-colors hover:text-zinc-400"
          >
            view all →
          </Link>
        </div>

        <div className="grid gap-4">
          {recentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </div>
  );
}
