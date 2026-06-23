/**
 * Umami Analytics Utilities
 *
 * A typed, SSR-safe wrapper around the Umami browser API.
 * Functions are no-ops when called on the server or when the
 * Umami script hasn't loaded (e.g. ad-blocker, local dev without the script).
 */

// Extend the Window interface with Umami's global
declare global {
  interface Window {
    umami?: {
      track: (
        eventNameOrProps?: string | Record<string, unknown>,
        eventData?: Record<string, unknown>
      ) => void;
    };
  }
}

/** Website ID injected via environment variable */
export const UMAMI_WEBSITE_ID =
  process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID ?? '';

/**
 * Track a named custom event.
 *
 * @example
 * trackEvent('newsletter_signup', { success: true });
 */
export function trackEvent(
  eventName: string,
  data?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;
  try {
    window.umami?.track(eventName, data);
  } catch {
    // Silently ignore – analytics should never break the app
  }
}

/**
 * Manually track a page view.
 * Umami already tracks page views automatically, so this is only
 * useful for virtual/client-side navigations you want to log explicitly.
 *
 * @example
 * trackPageView('/blog/my-post');
 */
export function trackPageView(url: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.umami?.track({ url } as Record<string, unknown>);
  } catch {
    // Silently ignore
  }
}
