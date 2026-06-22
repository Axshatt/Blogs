'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types/post';
import { BookmarkPopover } from '@/components/ui/BookmarkPopover';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  const { slug, frontmatter } = post;
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showPopover, setShowPopover] = useState(false);

  // Load bookmark status on mount / updates
  const updateBookmarkStatus = () => {
    const saved = localStorage.getItem('library_lists');
    if (saved) {
      try {
        const lists = JSON.parse(saved) as any[];
        const isSaved = lists.some((l) => l.slugs.includes(slug));
        setIsBookmarked(isSaved);
      } catch (e) {
        console.error(e);
      }
    } else {
      // Fallback to legacy single list key
      const legacySaved = localStorage.getItem('bookmarked_posts');
      if (legacySaved) {
        try {
          const list = JSON.parse(legacySaved) as string[];
          setIsBookmarked(list.includes(slug));
        } catch {
          setIsBookmarked(false);
        }
      }
    }
  };

  useEffect(() => {
    updateBookmarkStatus();
    window.addEventListener('bookmarks-updated', updateBookmarkStatus);
    return () => {
      window.removeEventListener('bookmarks-updated', updateBookmarkStatus);
    };
  }, [slug]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowPopover((prev) => !prev);
  };

  const date = new Date(frontmatter.published).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="group flex flex-col gap-md py-lg border-b border-outline-variant/20 bg-transparent last:border-b-0 transition-all duration-300">
      {/* Top Row: Author & Meta info */}
      <div className="flex items-center gap-xs text-label-sm text-primary font-inter">
        <Link href="/about" className="shrink-0 relative w-6 h-6 rounded-full overflow-hidden border border-outline-variant/40 hover:opacity-85 transition-opacity">
          <Image
            src="/images/akshat_profile.png"
            alt="Akshat Singh"
            fill
            sizes="24px"
            className="object-cover"
          />
        </Link>
        <Link href="/about" className="font-extrabold hover:text-secondary hover:underline transition-colors flex items-center gap-xs">
          <span>Akshat Singh</span>
          {/* verified icon */}
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-secondary fill-current shrink-0" aria-label="Verified Author">
            <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.7l-3.6.81.34 3.7L1 12l2.44 2.79-.34 3.69 3.61.82 1.89 3.2 3.4-1.46 3.4 1.46 1.89-3.2 3.61-.82-.34-3.69L23 12zm-13 5l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
          </svg>
        </Link>
        <span className="text-on-surface-variant/50">·</span>
        <span className="text-on-surface-variant/80 font-medium">{date}</span>
      </div>

      {/* Main Content: Title, Excerpt, Image */}
      <div className="flex flex-row gap-lg justify-between items-start">
        {/* Left Side: Title & Subtitle */}
        <div className="flex-1 min-w-0">
          <Link href={`/blog/${slug}`} className="block group/link">
            <h2 className="text-[20px] md:text-[22px] font-extrabold leading-snug tracking-tight text-primary transition-colors duration-200 group-hover/link:text-secondary group-hover:text-secondary">
              {frontmatter.title}
            </h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed line-clamp-2 mt-xs font-inter font-normal">
              {frontmatter.excerpt}
            </p>
          </Link>
        </div>

        {/* Right Side: Featured Cover Image */}
        {frontmatter.coverImage && (
          <Link href={`/blog/${slug}`} className="shrink-0 block relative">
            <div className="w-[110px] h-[75px] sm:w-[150px] sm:h-[100px] relative overflow-hidden bg-surface-container border border-outline-variant/30 rounded transition-all duration-300 group-hover:shadow-sm">
              <img
                src={frontmatter.coverImage}
                alt={frontmatter.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </Link>
        )}
      </div>

      {/* Bottom Action Row */}
      <div className="flex items-center justify-end text-label-sm text-on-surface-variant/80 font-medium mt-xs select-none">
        {/* Right: Bookmark button */}
        <div className="relative">
          <button
            onClick={handleBookmark}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-low hover:text-primary transition-colors cursor-pointer"
            title="Save to reading list"
          >
            <span
              className="material-symbols-outlined !text-[18px] text-primary"
              style={isBookmarked ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              {isBookmarked ? 'bookmark' : 'bookmark_add'}
            </span>
          </button>
          {showPopover && (
            <BookmarkPopover
              slug={slug}
              onClose={() => setShowPopover(false)}
              onStateChange={updateBookmarkStatus}
            />
          )}
        </div>
      </div>
    </div>
  );
}
