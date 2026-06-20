import Link from 'next/link';
import type { Post } from '@/types/post';

interface FeaturedBuildCardProps {
  post: Post;
}

export function FeaturedBuildCard({ post }: FeaturedBuildCardProps) {
  const { slug, frontmatter } = post;
  const date = new Date(frontmatter.published).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  }).toUpperCase();

  return (
    <div className="hairline-a group relative overflow-hidden bg-white p-lg md:col-span-8">
      <div className="relative z-10">
        {/* Top row: badge + date */}
        <div className="mb-xxl flex items-start justify-between">
          <span className="text-label-bold rounded-full bg-secondary-container px-md py-xs uppercase text-on-secondary-container">
            Latest Build
          </span>
          <span className="text-label-sm opacity-50">{date}</span>
        </div>

        {/* Title + description */}
        <h2 className="text-headline-xl mb-md">{frontmatter.title}</h2>
        <p className="text-body-md mb-lg max-w-md text-on-surface-variant">
          {frontmatter.excerpt}
        </p>

        {/* CTA */}
        <Link
          href={`/blog/${slug}`}
          className="group/link inline-flex items-center space-x-sm"
        >
          <span className="text-label-bold border-b border-primary uppercase">
            Read Case Study
          </span>
          <span className="material-symbols-outlined transition-transform group-hover/link:translate-x-1">
            arrow_forward
          </span>
        </Link>
      </div>

      {/* Decorative background icon */}
      <div className="absolute bottom-[-10%] right-[-10%] h-2/3 w-2/3 opacity-10 transition-opacity group-hover:opacity-20">
        <span className="material-symbols-outlined !text-[240px]">layers</span>
      </div>
    </div>
  );
}
