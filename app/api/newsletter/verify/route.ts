import { NextResponse } from 'next/server';
import { getSubscriberByToken, verifySubscriber } from '@/lib/db';
import { sendWelcomeEmail } from '@/lib/resend';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
  const dynamicSiteUrl = `${protocol}://${host}`;

  if (!token) {
    return NextResponse.redirect(`${dynamicSiteUrl}/verify-success?status=invalid`);
  }

  try {
    // 1. Find subscriber by token
    const subscriber = await getSubscriberByToken(token);
    if (!subscriber) {
      return NextResponse.redirect(`${dynamicSiteUrl}/verify-success?status=not-found`);
    }

    // 2. Check token expiration
    if (subscriber.verification_token_expires) {
      const expires = new Date(subscriber.verification_token_expires);
      if (new Date() > expires) {
        return NextResponse.redirect(`${dynamicSiteUrl}/verify-success?status=expired`);
      }
    }

    // 3. Mark as verified in database
    await verifySubscriber(subscriber.id);

    // 4. Send Welcome email
    await sendWelcomeEmail(subscriber.email, dynamicSiteUrl);

    return NextResponse.redirect(`${dynamicSiteUrl}/verify-success?status=verified`);
  } catch (error) {
    console.error('Verification API Error:', error);
    return NextResponse.redirect(`${dynamicSiteUrl}/verify-success?status=error`);
  }
}
