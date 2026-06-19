import Link from 'next/link';
import type { Post } from '@/types/post';
import { CategoryBadge } from './CategoryBadge';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { slug, frontmatter, readingTime } = post;
  const date = new Date(frontmatter.published).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <Link
      href={`/blog/${slug}`}
      className="group block rounded-xl border border-white/5 bg-white/[0.02] p-6 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-black/20"
    >
      <div className="mb-3 flex items-center gap-3">
        <CategoryBadge category={frontmatter.category} />
        <span className="font-mono text-[11px] text-zinc-500">{date}</span>
        <span className="font-mono text-[11px] text-zinc-600">·</span>
        <span className="font-mono text-[11px] text-zinc-500">{readingTime}</span>
      </div>

      <h2 className="mb-2 text-lg font-semibold leading-snug text-zinc-100 transition-colors duration-200 group-hover:text-white">
        {frontmatter.title}
      </h2>

      <p className="mb-4 text-sm leading-relaxed text-zinc-400 line-clamp-2">
        {frontmatter.excerpt}
      </p>

      {frontmatter.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {frontmatter.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded border border-white/5 bg-white/[0.03] px-2 py-0.5 font-mono text-[10px] text-zinc-500"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
