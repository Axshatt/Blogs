import { cookies } from 'next/headers';

const SESSION_COOKIE_NAME = 'admin_session';

async function getSecretKey() {
  const secret = process.env.SESSION_SECRET || 'fallback-secret-key-replace-this-in-production';
  const encoder = new TextEncoder();
  return crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

export async function signSession(payload: string): Promise<string> {
  const key = await getSecretKey();
  const encoder = new TextEncoder();
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payload)
  );
  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  const signatureHex = signatureArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return `${payload}.${signatureHex}`;
}

export async function verifySession(token: string): Promise<boolean> {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [payload, signatureHex] = parts;

  try {
    const key = await getSecretKey();
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

export async function login(password: string): Promise<boolean> {
  const expectedPassword = process.env.ADMIN_PASSWORD || 'PCO2GOGO2';
  if (password === expectedPassword) {
    const token = await signSession('admin');
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });
    return true;
  }
  return false;
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return false;
  return verifySession(token);
}
