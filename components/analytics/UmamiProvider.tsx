'use client';

import Script from 'next/script';
import { useEffect } from 'react';
import { trackEvent, UMAMI_WEBSITE_ID } from '@/lib/analytics';

/**
 * Global Umami provider.
 *
 * - Loads the cloud script with `afterInteractive` strategy.
 * - Registers a global click listener to automatically classify
 *   outbound link clicks (GitHub, LinkedIn, resume, generic).
 */
export function UmamiProvider() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a');
      if (!anchor) return;

      const href = anchor.href;
      if (!href || href.startsWith('javascript:')) return;

      try {
        const url = new URL(href);

        // Only intercept external links
        if (url.origin === window.location.origin) return;

        const hostname = url.hostname.toLowerCase();

        if (hostname.includes('github.com')) {
          trackEvent('github_click', { url: href });
        } else if (hostname.includes('linkedin.com')) {
          trackEvent('linkedin_click', { url: href });
        } else if (
          href.toLowerCase().includes('resume') ||
          href.toLowerCase().endsWith('.pdf')
        ) {
          trackEvent('resume_download', { url: href });
        } else {
          trackEvent('outbound_link_click', { url: href });
        }
      } catch {
        // Invalid URL – ignore
      }
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, []);

  // Skip rendering the script if no website ID is configured
  if (!UMAMI_WEBSITE_ID) return null;

  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id={UMAMI_WEBSITE_ID}
      strategy="afterInteractive"
    />
  );
}
