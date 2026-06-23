'use client';

import { useEffect, useRef, useState } from 'react';
import Giscus from '@giscus/react';

/**
 * Giscus-powered commenting component.
 *
 * - Lazy-loads via IntersectionObserver (only renders when scrolled near).
 * - Syncs theme with the site's dark/light mode in real-time.
 * - Uses pathname mapping so each blog post gets its own Discussion thread.
 * - Reserves a min-height to prevent layout shifts while loading.
 */
export function Comments() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Lazy-load: only mount Giscus when the section scrolls into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // start loading 200px before it's on screen
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Sync theme with site's dark mode class
  useEffect(() => {
    const detectTheme = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    };

    // Initial detection
    detectTheme();

    // Watch for class changes on <html> (theme toggles add/remove 'dark')
    const observer = new MutationObserver(detectTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO ?? '';
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID ?? '';
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY ?? '';
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? '';

  // Build Giscus theme — custom CSS on production, built-in fallback on localhost.
  // Custom theme URLs must be publicly accessible (Giscus runs in an iframe from giscus.app).
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? '';
  const isProduction = siteUrl.startsWith('https://');
  const giscusTheme = isProduction
    ? theme === 'dark'
      ? `${siteUrl}/giscus-dark.css`
      : `${siteUrl}/giscus-light.css`
    : theme === 'dark'
      ? 'noborder_dark'
      : 'noborder_light';

  // Don't render anything if env vars are missing
  if (!repo || !repoId || !category || !categoryId) return null;

  return (
    <section
      ref={containerRef}
      id="comments"
      aria-label="Comments"
      className="mt-xxl border-t border-outline-variant pt-xl"
      style={{ minHeight: isVisible ? 'auto' : '300px' }}
    >
      <h2 className="text-headline-md font-bold tracking-tight text-primary mb-lg">
        Comments
      </h2>

      {isVisible ? (
        <div className="giscus-container">
          <Giscus
            id="giscus-comments"
            repo={repo as `${string}/${string}`}
            repoId={repoId}
            category={category}
            categoryId={categoryId}
            mapping="pathname"
            strict="0"
            reactionsEnabled="0"
            emitMetadata="0"
            inputPosition="top"
            theme={giscusTheme}
            lang="en"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center py-xl text-on-surface-variant text-body-md">
          <span className="material-symbols-outlined mr-sm !text-[20px] animate-spin">
            progress_activity
          </span>
          Loading comments…
        </div>
      )}
    </section>
  );
}
