import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { getAllPosts, getPostBySlug, getAllSlugs } from '@/lib/posts';
import { generatePostMetadata, getBlogPostSchema } from '@/lib/seo';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { useMDXComponents } from '@/mdx-components';
import Link from 'next/link';
import { AuthorBox } from '@/components/ui/AuthorBox';
import { ReadingHistoryTracker } from '@/components/ui/ReadingHistoryTracker';
import { Comments } from '@/components/blog/Comments';
import { ShareButtons } from '@/components/ui/ShareButtons';

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
  return generatePostMetadata(post.frontmatter, slug, post.content);
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

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const components = useMDXComponents({});

  const postSchema = getBlogPostSchema(
    frontmatter.title,
    frontmatter.excerpt,
    frontmatter.published,
    slug,
    frontmatter.coverImage,
    frontmatter.author
  );

  return (
    <article className="mx-auto max-w-4xl px-margin-mobile py-xxl md:px-margin-desktop">
      {/* Blog Posting Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(postSchema),
        }}
      />

      <ReadingHistoryTracker slug={slug} />
      {/* Breadcrumb */}
      <div className="text-label-sm mb-lg flex items-center gap-sm text-on-surface-variant">
        <Link href="/blog" className="transition-colors hover:text-primary">
          /blog
        </Link>
        <span>/</span>
        <span className="text-primary">{slug}</span>
      </div>

      {/* Post header */}
      <header className="mb-xl">
        <div className="mb-md flex flex-wrap items-center justify-between gap-md">
          <div className="flex flex-wrap items-center gap-lg">
            <CategoryBadge category={frontmatter.category} size="md" />
            <span className="text-label-sm text-on-surface-variant">{date}</span>
            <span className="text-label-sm text-outline">·</span>
            <span className="text-label-sm text-on-surface-variant">{readingTime}</span>
          </div>
          <ShareButtons
            title={frontmatter.title}
            url={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/blog/${slug}`}
          />
        </div>

        <h1 className="text-headline-xl mb-md tracking-tight text-primary md:text-display-lg-mobile">
          {frontmatter.title}
        </h1>

        <p className="text-body-lg text-on-surface-variant">{frontmatter.excerpt}</p>


        {frontmatter.canonical_url && (
          <p className="text-label-sm mt-md text-on-surface-variant">
            Originally published at{' '}
            <a
              href={frontmatter.canonical_url}
              className="text-secondary underline underline-offset-2 hover:text-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              {new URL(frontmatter.canonical_url).hostname}
            </a>
          </p>
        )}
      </header>

      <hr className="mb-xl border-outline-variant" />

      {/* MDX Content */}
      <div className="prose-content">
        <MDXRemote source={content} components={components} />
      </div>

      {/* Author Info */}
      <AuthorBox />

      {/* Prev / Next navigation */}
      {(prevPost || nextPost) && (
        <nav className="mt-xxl border-t border-outline-variant pt-xl">
          <div className="grid grid-cols-2 gap-gutter">
            {prevPost ? (
              <Link
                href={`/blog/${prevPost.slug}`}
                className="group py-md transition-all hover:opacity-85 block"
              >
                <div className="text-label-sm mb-xs uppercase text-on-surface-variant">
                  ← Older
                </div>
                <div className="text-body-md text-primary font-bold transition-colors group-hover:text-secondary line-clamp-2">
                  {prevPost.frontmatter.title}
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextPost ? (
              <Link
                href={`/blog/${nextPost.slug}`}
                className="group py-md text-right transition-all hover:opacity-85 block"
              >
                <div className="text-label-sm mb-xs uppercase text-on-surface-variant">
                  Newer →
                </div>
                <div className="text-body-md text-primary font-bold transition-colors group-hover:text-secondary line-clamp-2">
                  {nextPost.frontmatter.title}
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </nav>
      )}

      {/* Comments */}
      <Comments />
    </article>
  );
}
