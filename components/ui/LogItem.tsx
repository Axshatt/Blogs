import Link from 'next/link';
import type { Post } from '@/types/post';

interface LogItemProps {
  post: Post;
}

export function LogItem({ post }: LogItemProps) {
  const { slug, frontmatter } = post;
  const date = new Date(frontmatter.published).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }).toUpperCase();

  return (
    <Link
      href={`/blog/${slug}`}
      className="group flex cursor-pointer flex-col py-lg md:flex-row md:items-center"
    >
      {/* Date */}
      <span className="text-label-sm mb-sm w-32 text-on-surface-variant md:mb-0">
        {date}
      </span>

      {/* Title */}
      <h3 className="text-body-lg flex-grow transition-transform duration-300 group-hover:translate-x-2 md:text-headline-lg">
        {frontmatter.title}
      </h3>

      {/* Tags */}
      {frontmatter.tags.length > 0 && (
        <div className="mt-md flex gap-sm md:mt-0">
          {frontmatter.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-label-sm rounded-full border border-outline-variant px-sm py-1 uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
