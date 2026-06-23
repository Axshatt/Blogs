'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { trackEvent } from '@/lib/analytics';

interface ShareButtonsProps {
  title: string;
  url: string;
}

/**
 * Medium-style share button with dropdown menu.
 * Shows a bookmark button and a single share icon; on click opens a dropdown with social share options.
 * Both buttons display Medium-style hovering tooltips.
 */
export function ShareButtons({ title, url }: ShareButtonsProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    trackEvent('share_post', { method: 'copy_link', title, url });
    setTimeout(() => setCopied(false), 2000);
  }, [title, url]);

  const shareText = encodeURIComponent(`Read "${title}": `);
  const encodedUrl = encodeURIComponent(url);

  const shareOptions = [
    {
      label: 'Copy link',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      ),
      onClick: () => {
        handleCopy();
      },
      isCopy: true,
    },
    {
      label: 'Share on X',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      href: `https://x.com/intent/tweet?text=${shareText}&url=${encodedUrl}`,
      method: 'twitter',
    },
    {
      label: 'Share on LinkedIn',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      method: 'linkedin',
    },
    {
      label: 'Share on Facebook',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      method: 'facebook',
    },
    {
      label: 'Share on Bluesky',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 600 530">
          <path d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.72 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z" />
        </svg>
      ),
      href: `https://bsky.app/intent/compose?text=${shareText}${encodedUrl}`,
      method: 'bluesky',
    },
    {
      label: 'Share on Threads',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.96-.065-1.187.408-2.26 1.33-3.017.88-.724 2.108-1.138 3.66-1.235 1.133-.07 2.19-.02 3.161.15-.09-.542-.261-1-.528-1.373-.39-.543-1.003-.838-1.822-.878h-.05c-.735 0-1.632.247-2.07.674l-1.427-1.46c.737-.722 1.957-1.136 3.27-1.213l.054-.002c1.34 0 2.467.46 3.349 1.368.795.82 1.293 1.928 1.484 3.297.473.19.903.414 1.29.67 1.266.835 2.148 2.02 2.554 3.436.506 1.764.375 4.27-1.752 6.346-1.856 1.814-4.2 2.66-7.37 2.682zM12.834 14.1c-1.076.066-1.882.324-2.4.765-.466.396-.636.847-.606 1.39.04.718.48 1.665 2.356 1.545 1.122-.061 1.958-.44 2.558-1.162.471-.567.804-1.348.952-2.36-.914-.207-1.88-.245-2.86-.178z" />
        </svg>
      ),
      href: `https://www.threads.net/intent/post?text=${shareText}${encodedUrl}`,
      method: 'threads',
    },
  ];

  return (
    <div className="flex items-center gap-[6px]">
      {/* Save / Bookmark Button with tooltip */}
      <BookmarkButton />

      {/* Share Container with tooltip */}
      <div ref={menuRef} className="relative group flex items-center justify-center">
        {/* Share trigger button */}
        <button
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all duration-200 flex items-center justify-center cursor-pointer"
          aria-label="Share this post"
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
        </button>

        {/* Share Button Tooltip */}
        {!open && (
          <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden md:group-hover:flex flex-col items-center z-50 animate-fade-in">
            <div className="bg-[#191919] text-white text-[12px] font-medium px-[10px] py-[6px] rounded-lg whitespace-nowrap shadow-md">
              Share
            </div>
            <div className="w-2 h-2 bg-[#191919] rotate-45 -mt-[4px]" />
          </div>
        )}

        {/* Share menu */}
        {open && (
          <>
            {/* Mobile: full-screen backdrop */}
            <div
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setOpen(false)}
            />

            {/* Menu container — bottom sheet on mobile, dropdown on desktop */}
            <div
              role="menu"
              className={[
                // Base styles
                'bg-surface border border-outline-variant/40 z-50 py-sm',
                // Mobile: bottom sheet
                'fixed bottom-0 left-0 right-0 rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.2)] animate-slide-up',
                // Desktop: dropdown
                'md:absolute md:bottom-auto md:left-auto md:right-0 md:top-full md:mt-2 md:w-[220px] md:rounded-2xl md:shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:md:shadow-[0_12px_40px_rgba(0,0,0,0.35)] md:animate-fade-in',
              ].join(' ')}
            >
              {/* Drag handle — mobile only */}
              <div className="flex justify-center pt-xs pb-sm md:hidden">
                <div className="w-10 h-1 bg-outline-variant/50 rounded-full" />
              </div>

              {/* Pointer triangle — desktop only */}
              <div className="hidden md:block absolute -top-[6px] right-3 w-3 h-3 bg-surface border-l border-t border-outline-variant/40 rotate-45" />

              {/* Title — mobile only */}
              <div className="px-lg pb-sm mb-xs border-b border-outline-variant/30 md:hidden">
                <p className="text-label-sm font-bold text-on-surface-variant uppercase tracking-wider">Share this post</p>
              </div>

              {shareOptions.map((option, i) => {
                const sharedClasses =
                  'flex items-center gap-md px-lg py-[12px] md:py-[10px] w-full text-left text-body-md text-on-surface hover:bg-surface-container active:bg-surface-container-high transition-colors duration-150 cursor-pointer';

                // Separator after "Copy link"
                const separator = i === 0 ? (
                  <div className="border-b border-outline-variant/30 my-xs mx-lg" />
                ) : null;

                if (option.isCopy) {
                  return (
                    <div key={option.label}>
                      <button
                        role="menuitem"
                        onClick={() => {
                          option.onClick?.();
                        }}
                        className={sharedClasses}
                      >
                        <span className="w-5 h-5 flex-shrink-0 text-on-surface-variant">{option.icon}</span>
                        <span className="font-medium">{copied ? 'Copied!' : option.label}</span>
                      </button>
                      {separator}
                    </div>
                  );
                }

                return (
                  <a
                    key={option.label}
                    role="menuitem"
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={sharedClasses}
                    onClick={() => {
                      trackEvent('share_post', { method: option.method!, title, url });
                      setOpen(false);
                    }}
                  >
                    <span className="w-5 h-5 flex-shrink-0 text-on-surface-variant">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </a>
                );
              })}

              {/* Safe area padding for phones with home indicators */}
              <div className="h-2 md:hidden" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Standalone bookmark button that syncs with the reading list sidebar */
function BookmarkButton() {
  const [bookmarked, setBookmarked] = useState(false);

  // Check initial state
  useEffect(() => {
    try {
      const slug = window.location.pathname.split('/blog/')[1];
      const saved = localStorage.getItem('bookmarked_posts');
      if (saved && slug) {
        const bookmarks: string[] = JSON.parse(saved);
        if (bookmarks.includes(slug)) setBookmarked(true);
      }
    } catch { /* ignore */ }
  }, []);

  const handleToggle = () => {
    try {
      const slug = window.location.pathname.split('/blog/')[1];
      if (!slug) return;
      const saved = localStorage.getItem('bookmarked_posts');
      let bookmarks: string[] = saved ? JSON.parse(saved) : [];
      if (bookmarked) {
        bookmarks = bookmarks.filter((s) => s !== slug);
      } else {
        bookmarks = [slug, ...bookmarks];
      }
      localStorage.setItem('bookmarked_posts', JSON.stringify(bookmarks));
      setBookmarked(!bookmarked);
      window.dispatchEvent(new Event('bookmarks-updated'));
      trackEvent(bookmarked ? 'bookmark_remove' : 'bookmark_add', { slug });
    } catch { /* ignore */ }
  };

  return (
    <div className="relative group flex items-center justify-center">
      <button
        onClick={handleToggle}
        className="w-9 h-9 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-container transition-all duration-200 flex items-center justify-center cursor-pointer"
        aria-label={bookmarked ? 'Remove bookmark' : 'Save this post'}
      >
        <svg
          className={`w-[18px] h-[18px] transition-all duration-300 ${
            bookmarked ? 'text-secondary' : ''
          }`}
          viewBox="0 0 24 24"
          fill={bookmarked ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
      </button>

      {/* Tooltip */}
      <div className="pointer-events-none absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden md:group-hover:flex flex-col items-center z-50 animate-fade-in">
        <div className="bg-[#191919] text-white text-[12px] font-medium px-[10px] py-[6px] rounded-lg whitespace-nowrap shadow-md">
          {bookmarked ? 'Remove bookmark' : 'Save'}
        </div>
        <div className="w-2 h-2 bg-[#191919] rotate-45 -mt-[4px]" />
      </div>
    </div>
  );
}
