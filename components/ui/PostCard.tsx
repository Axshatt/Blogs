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
      className="group flex flex-col md:flex-row gap-lg bg-white p-lg transition-all duration-300 hairline-a hover:bg-surface-container-low"
    >
      {frontmatter.coverImage && (
        <div className="w-full md:w-[240px] shrink-0 h-[160px] md:h-auto relative overflow-hidden bg-surface-container border border-outline-variant/30">
          <img
            src={frontmatter.coverImage}
            alt={frontmatter.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="mb-sm flex items-center gap-lg">
            <CategoryBadge category={frontmatter.category} />
            <span className="text-label-sm text-on-surface-variant">{date}</span>
            <span className="text-label-sm text-outline">·</span>
            <span className="text-label-sm text-on-surface-variant">{readingTime}</span>
          </div>

          <h2 className="text-headline-lg mb-sm tracking-tight text-primary transition-colors duration-200 group-hover:text-secondary">
            {frontmatter.title}
          </h2>

          <p className="text-body-md mb-md text-on-surface-variant line-clamp-2">
            {frontmatter.excerpt}
          </p>
        </div>

        {frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-sm">
            {frontmatter.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-label-sm rounded-full border border-outline-variant px-sm py-0.5 uppercase"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
