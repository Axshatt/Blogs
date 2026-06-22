import { NextResponse } from 'next/server';
import { trackEvent } from '@/lib/db';

const TRANSPARENT_PIXEL = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
  'base64'
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const nidStr = searchParams.get('nid');
  const sidStr = searchParams.get('sid');
  const event = searchParams.get('event'); // 'open' or 'click'
  const url = searchParams.get('url'); // target URL for clicks

  if (!nidStr || !sidStr) {
    return new Response('Missing parameters', { status: 400 });
  }

  const nid = parseInt(nidStr);
  const sid = parseInt(sidStr);

  if (isNaN(nid) || isNaN(sid)) {
    return new Response('Invalid parameters', { status: 400 });
  }

  try {
    if (event === 'open') {
      // 1. Record email open event in database
      await trackEvent(nid, sid, 'open');

      // 2. Return 1x1 transparent tracking pixel
      return new Response(TRANSPARENT_PIXEL, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      });
    }

    if (event === 'click' && url) {
      // 1. Record link click event in database
      await trackEvent(nid, sid, 'click', url);

      // 2. Redirect to destination url
      return NextResponse.redirect(url);
    }

    return new Response('Bad Request', { status: 400 });
  } catch (error) {
    console.error('Tracking API Error:', error);
    // If redirect fails, still try to fall back gracefully
    if (event === 'click' && url) {
      return NextResponse.redirect(url);
    }
    return new Response('Internal Error', { status: 500 });
  }
}
