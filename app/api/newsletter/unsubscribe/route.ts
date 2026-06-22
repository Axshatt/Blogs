import { NextResponse } from 'next/server';
import { getSubscriberByEmail, unsubscribeSubscriber } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email address is required.' }, { status: 400 });
    }

    // 1. Verify if subscriber exists
    const subscriber = await getSubscriberByEmail(email);
    if (!subscriber) {
      return NextResponse.json(
        { error: 'This email is not subscribed to our newsletter.' },
        { status: 404 }
      );
    }

    // 2. Mark as unsubscribed in the database
    await unsubscribeSubscriber(email);

    return NextResponse.json({
      message: 'You have been successfully unsubscribed. We are sorry to see you go.',
    });
  } catch (error: any) {
    console.error('Unsubscribe API Error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}
