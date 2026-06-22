import { NextResponse } from 'next/server';
import { getNewsletters, getSubscribers, updateNewsletter } from '@/lib/db';
import { sendCampaignEmail } from '@/lib/resend';

export async function GET(request: Request) {
  // Validate Vercel Cron Authorization
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (process.env.NODE_ENV === 'production' && cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Fetch scheduled campaigns
    const scheduledNewsletters = await getNewsletters('scheduled');
    const now = new Date();
    const dueNewsletters = scheduledNewsletters.filter(
      (n) => n.scheduled_at && new Date(n.scheduled_at) <= now
    );

    if (dueNewsletters.length === 0) {
      return NextResponse.json({ message: 'No scheduled newsletters are due for sending.' });
    }

    // 2. Fetch active verified subscribers
    const subscribers = await getSubscribers();
    const recipients = subscribers.filter((s) => s.verified && !s.unsubscribed);

    if (recipients.length === 0) {
      return NextResponse.json({ message: 'No active verified subscribers found.' });
    }

    const results = [];

    // 3. Dispatch campaigns
    for (const newsletter of dueNewsletters) {
      let successCount = 0;
      let errorCount = 0;

      for (const subscriber of recipients) {
        try {
          const { error } = await sendCampaignEmail({
            to: subscriber.email,
            email: subscriber.email,
            title: newsletter.title,
            markdown: newsletter.content,
            nid: newsletter.id,
            sid: subscriber.id,
          });
          if (error) errorCount++;
          else successCount++;
        } catch (e) {
          errorCount++;
        }
      }

      // Mark newsletter as sent
      await updateNewsletter(
        newsletter.id,
        newsletter.slug,
        newsletter.title,
        newsletter.content,
        'sent',
        null,
        new Date()
      );

      results.push({
        id: newsletter.id,
        title: newsletter.title,
        sent: successCount,
        failed: errorCount,
      });
    }

    return NextResponse.json({
      message: `Processed ${dueNewsletters.length} due newsletters.`,
      results,
    });
  } catch (error: any) {
    console.error('Cron Sending Error:', error);
    return NextResponse.json({ error: 'Internal server error during cron job execution.' }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
