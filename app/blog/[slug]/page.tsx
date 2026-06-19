import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts, getPostBySlug, getAllSlugs } from '@/lib/posts';
import { generatePostMetadata } from '@/lib/seo';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { useMDXComponents } from '@/mdx-components';
import Link from 'next/link';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return generatePostMetadata(post.frontmatter, slug);
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  const { frontmatter, content, readingTime } = post;
  const date = new Date(frontmatter.published).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const components = useMDXComponents({});

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 font-mono text-xs text-zinc-600">
        <Link href="/blog" className="transition-colors hover:text-zinc-400">
          /blog
        </Link>
        <span>/</span>
        <span className="text-zinc-500">{slug}</span>
      </div>

      {/* Post header */}
      <header className="mb-10">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <CategoryBadge category={frontmatter.category} size="md" />
          <span className="font-mono text-xs text-zinc-500">{date}</span>
          <span className="font-mono text-xs text-zinc-600">·</span>
          <span className="font-mono text-xs text-zinc-500">{readingTime}</span>
        </div>

        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-zinc-100 sm:text-4xl">
          {frontmatter.title}
        </h1>

        <p className="text-base leading-7 text-zinc-400">{frontmatter.excerpt}</p>

        {frontmatter.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {frontmatter.tags.map((tag) => (
              <span
                key={tag}
                className="rounded border border-white/5 bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-zinc-500"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {frontmatter.canonical_url && (
          <p className="mt-4 font-mono text-[11px] text-zinc-600">
            Originally published at{' '}
            <a
              href={frontmatter.canonical_url}
              className="text-zinc-500 underline hover:text-zinc-300"
              target="_blank"
              rel="noopener noreferrer"
            >
              {new URL(frontmatter.canonical_url).hostname}
            </a>
          </p>
        )}
      </header>

      <hr className="mb-10 border-white/5" />

      {/* MDX Content */}
      <div className="prose-content">
        <MDXRemote source={content} components={components} />
      </div>

      {/* Prev / Next navigation */}
      {(prevPost || nextPost) && (
        <nav className="mt-16 border-t border-white/5 pt-10">
          <div className="grid grid-cols-2 gap-4">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group rounded-lg border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                  ← Older
                </div>
                <div className="text-sm text-zinc-400 group-hover:text-zinc-200 line-clamp-2 transition-colors">
                  {prevPost.frontmatter.title}
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group rounded-lg border border-white/5 bg-white/[0.02] p-4 text-right transition-all hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className="mb-1 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
                  Newer →
                </div>
                <div className="text-sm text-zinc-400 group-hover:text-zinc-200 line-clamp-2 transition-colors">
                  {nextPost.frontmatter.title}
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </nav>
      )}
    </article>
  );
}
