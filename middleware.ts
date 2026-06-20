import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'admin_session';

async function getSecretKey(secret: string) {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
}

async function verifySession(token: string, secret: string): Promise<boolean> {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, signatureHex] = parts;

  try {
    const key = await getSecretKey(secret);
    const encoder = new TextEncoder();
    const matches = signatureHex.match(/.{1,2}/g);
    if (!matches) return false;
    const sigBytes = new Uint8Array(matches.map((byte) => parseInt(byte, 16)));

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      encoder.encode(payload)
    );

    return isValid && payload === 'admin';
  } catch (e) {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes, but allow /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const secret = process.env.SESSION_SECRET || 'fallback-secret-key-replace-this-in-production';
    const isAuthed = token ? await verifySession(token, secret) : false;

    if (!isAuthed) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
