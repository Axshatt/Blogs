import { NextResponse } from 'next/server';
import { createSubscriber, getSubscriberByEmail, checkRateLimit } from '@/lib/db';
import { sendVerificationEmail } from '@/lib/resend';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    // 1. Validate input
    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    // 2. Fetch client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';

    // 3. Check rate limits
    const allowed = await checkRateLimit(email, ip);
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many subscription attempts. Please try again in a minute.' },
        { status: 429 }
      );
    }

    // 4. Check if subscriber already exists
    const existing = await getSubscriberByEmail(email);
    if (existing && existing.verified && !existing.unsubscribed) {
      return NextResponse.json({ message: 'You are already subscribed to our newsletter!' });
    }

    // 5. Generate secure verification token
    const token = crypto.randomUUID();
    const expires = new Date();
    expires.setHours(expires.getHours() + 24); // Expiration: 24 Hours

    // 6. Create/Update subscriber in DB
    await createSubscriber(email, token, expires, ip);

    // 7. Dispatch verification email
    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
    const dynamicSiteUrl = `${protocol}://${host}`;

    const { error } = await sendVerificationEmail(email, token, dynamicSiteUrl);
    if (error) {
      console.error('Failed to send verification email:', error);
      return NextResponse.json(
        { error: 'Failed to send confirmation email. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: 'Thanks for signing up! Please check your inbox to confirm your subscription.',
    });
  } catch (error: any) {
    console.error('Subscription API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
