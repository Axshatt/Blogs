import { NextResponse } from 'next/server';
import { getAllPosts } from '@/lib/posts';
import {
  getNewsletterBySlug,
  createNewsletter,
  updateNewsletter,
  getSubscribers,
} from '@/lib/db';
import { sendCampaignEmail } from '@/lib/resend';

export async function GET(request: Request) {
  // Validate Vercel Cron Authorization
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (
    process.env.NODE_ENV === 'production' &&
    cronSecret &&
    authHeader !== `Bearer ${cronSecret}`
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Fetch all blog posts
    const posts = getAllPosts();
    if (posts.length === 0) {
      return NextResponse.json({ message: 'No blog posts found.' });
    }

    // Sort posts oldest first so that we process them in chronological order
    const oldestFirst = [...posts].sort(
      (a, b) =>
        new Date(a.frontmatter.published).getTime() -
        new Date(b.frontmatter.published).getTime()
    );

    // 2. Identify the first unprocessed post
    let postToProcess = null;
    let trackingSlug = '';

    for (const post of oldestFirst) {
      const slugCandidate = `auto-blog-${post.slug}`;
      const existing = await getNewsletterBySlug(slugCandidate);
      if (!existing) {
        postToProcess = post;
        trackingSlug = slugCandidate;
        break; // Process one post per cron execution to avoid timeouts and rate-limits
      }
    }

    if (!postToProcess) {
      return NextResponse.json({
        message: 'All blog posts have already been emailed to subscribers.',
      });
    }

    // 3. Fetch active verified subscribers
    const subscribers = await getSubscribers();
    const recipients = subscribers.filter(
      (s) => s.verified && !s.unsubscribed
    );

    // 4. Create the newsletter draft in the database to lock the process
    const newsletter = await createNewsletter(
      trackingSlug,
      postToProcess.frontmatter.title,
      postToProcess.content,
      'draft'
    );

    // 5. Send campaign emails
    let successCount = 0;
    let errorCount = 0;

    if (recipients.length > 0) {
      for (const subscriber of recipients) {
        try {
          const { error } = await sendCampaignEmail({
            to: subscriber.email,
            email: subscriber.email,
            title: postToProcess.frontmatter.title,
            markdown: postToProcess.content,
            nid: newsletter.id,
            sid: subscriber.id,
          });

          if (error) {
            errorCount++;
          } else {
            successCount++;
          }
        } catch (e) {
          errorCount++;
        }
      }
    }

    // 6. Mark newsletter as sent
    await updateNewsletter(
      newsletter.id,
      trackingSlug,
      postToProcess.frontmatter.title,
      postToProcess.content,
      'sent',
      null,
      new Date()
    );

    return NextResponse.json({
      message: `Successfully processed and sent email for blog post: "${postToProcess.frontmatter.title}"`,
      newsletterId: newsletter.id,
      slug: trackingSlug,
      recipients: recipients.length,
      sent: successCount,
      failed: errorCount,
    });
  } catch (error: any) {
    console.error('RSS Blog Newsletter Cron Sync Error:', error);
    return NextResponse.json(
      { error: 'Internal server error during RSS sync cron execution.' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
