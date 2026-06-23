'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import type { Post } from '@/types/post';
import { trackEvent } from '@/lib/analytics';

interface BlogSidebarProps {
  posts: Post[];
}

const RECOMMENDED_TOPICS = [
  { name: 'AI & Automation', tag: 'ai-automation' },
  { name: 'Game Dev', tag: 'game-dev' },
  { name: 'n8n', tag: 'n8n' },
  { name: 'OpenAI', tag: 'openai' },
  { name: 'Agency', tag: 'agency' },
  { name: 'Procedural Gen', tag: 'procedural-generation' },
  { name: 'Creative Coding', tag: 'creative-coding' },
  { name: 'Next.js', tag: 'nextjs' },
  { name: 'React', tag: 'react' },
  { name: 'SaaS', tag: 'saas' },
  { name: 'Design Insights', tag: 'design' },
  { name: 'Tech Industry', tag: 'tech' },
];

const FOOTER_LINKS = [
  'Help',
  'Status',
  'About',
  'Careers',
  'Press',
  'Blog',
  'Store',
  'Privacy',
  'Rules',
  'Terms',
  'Text to speech',
];

export function BlogSidebar({ posts }: BlogSidebarProps) {
  const searchParams = useSearchParams();
  const activeTag = searchParams.get('tag');
  
  const [bookmarkedSlugs, setBookmarkedSlugs] = useState<string[]>([]);
  const [showAllTopics, setShowAllTopics] = useState(false);

  // Function to load bookmarks from localStorage
  const loadBookmarks = () => {
    const saved = localStorage.getItem('bookmarked_posts');
    if (saved) {
      try {
        setBookmarkedSlugs(JSON.parse(saved) as string[]);
      } catch (e) {
        console.error(e);
      }
    } else {
      setBookmarkedSlugs([]);
    }
  };

  useEffect(() => {
    // Initial load
    loadBookmarks();

    // Listen to updates from PostCard component
    window.addEventListener('bookmarks-updated', loadBookmarks);
    return () => {
      window.removeEventListener('bookmarks-updated', loadBookmarks);
    };
  }, []);

  // Track search/filter usage
  useEffect(() => {
    if (activeTag) {
      trackEvent('search_used', { tag: activeTag });
    }
  }, [activeTag]);

  // Remove a post from bookmarks directly from the sidebar
  const handleRemoveBookmark = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    const updated = bookmarkedSlugs.filter((s) => s !== slug);
    setBookmarkedSlugs(updated);
    localStorage.setItem('bookmarked_posts', JSON.stringify(updated));
    // Dispatch event so PostCard components can update their bookmark state
    window.dispatchEvent(new Event('bookmarks-updated'));
  };

  // Filter posts to find bookmarked ones
  const bookmarkedPosts = posts.filter((p) => bookmarkedSlugs.includes(p.slug));

  return (
    <div className="space-y-xl font-sans text-primary">
      {/* Recommended Topics Panel */}
      <div className="bg-transparent py-md">
        <h3 className="text-label-bold uppercase text-primary pb-xs mb-md">
          Recommended topics
        </h3>
        <div className="flex flex-wrap gap-sm">
          {(showAllTopics ? RECOMMENDED_TOPICS : RECOMMENDED_TOPICS.slice(0, 5)).map((topic) => {
            const isActive = activeTag === topic.tag;
            const linkHref = isActive ? '/blog' : `/blog?tag=${topic.tag}`;
            return (
              <Link
                key={topic.tag}
                href={linkHref}
                className={`text-body-sm px-md py-sm rounded-full transition-all duration-200 inline-flex items-center gap-1 font-bold ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-primary'
                }`}
              >
                <span>{isActive ? '✓' : '+'}</span>
                <span>{topic.name}</span>
              </Link>
            );
          })}
        </div>
        <div className="mt-md">
          <button
            onClick={() => setShowAllTopics(!showAllTopics)}
            className="text-label-sm text-secondary hover:text-primary font-extrabold hover:underline cursor-pointer bg-transparent border-none p-0"
          >
            {showAllTopics ? 'See fewer topics' : 'See more topics'}
          </button>
        </div>
      </div>

      {/* Reading List Panel */}
      <div className="bg-transparent py-md">
        <h3 className="text-label-bold uppercase text-primary border-b border-outline-variant/20 pb-xs mb-md">
          Reading list
        </h3>

        {bookmarkedPosts.length === 0 ? (
          <div className="text-body-md text-on-surface-variant leading-relaxed font-inter font-normal space-y-sm">
            <p>
              Click the{' '}
              <span className="material-symbols-outlined !text-[16px] inline-block align-middle text-primary">
                bookmark_add
              </span>{' '}
              on any story to easily add it to your reading list or a custom list that you can share.
            </p>
          </div>
        ) : (
          <div className="space-y-md">
            {bookmarkedPosts.slice(0, 2).map((p) => {
              const dateStr = new Date(p.frontmatter.published).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });
              return (
                <div key={p.slug} className="group border-b border-outline-variant/20 pb-sm last:border-b-0 last:pb-0">
                  <div className="flex items-center justify-between gap-xs">
                    {/* Small Meta info */}
                    <div className="flex items-center gap-1 text-[10px] text-on-surface-variant/80 uppercase font-semibold">
                      <span>Akshat Singh</span>
                      <span>·</span>
                      <span>{dateStr}</span>
                    </div>
                  </div>
                  {/* Post Link */}
                  <Link
                    href={`/blog/${p.slug}`}
                    className="block text-body-md font-bold text-primary hover:text-secondary transition-colors duration-200 mt-1 line-clamp-2 leading-snug"
                  >
                    {p.frontmatter.title}
                  </Link>
                </div>
              );
            })}
            
            {bookmarkedPosts.length > 2 && (
              <div className="mt-md pt-sm border-t border-outline-variant/10">
                <Link
                  href="/library"
                  className="text-label-sm text-secondary hover:text-primary font-extrabold hover:underline"
                >
                  See more ({bookmarkedPosts.length - 2} more)
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
