'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

export function ReadingHistoryTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackEvent('blog_read', { slug });
    const saved = localStorage.getItem('reading_history');
    let history: string[] = [];
    if (saved) {
      try {
        history = JSON.parse(saved) as string[];
      } catch {
        history = [];
      }
    }

    // Move to front (most recent) and deduplicate
    history = [slug, ...history.filter((s) => s !== slug)];

    // Keep max 50 items
    if (history.length > 50) history = history.slice(0, 50);

    localStorage.setItem('reading_history', JSON.stringify(history));
  }, [slug]);

  return null;
}
