import { NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import {
  getNewsletters,
  getNewsletterById,
  createNewsletter,
  updateNewsletter,
  deleteNewsletter,
  getSubscribers,
} from '@/lib/db';
import { sendCampaignEmail } from '@/lib/resend';

// 1. GET - Fetch campaigns list
export async function GET(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const list = await getNewsletters();
    return NextResponse.json(list);
  } catch (error: any) {
    console.error('Admin Fetch Campaigns Error:', error);
    return NextResponse.json({ error: 'Failed to fetch campaigns.' }, { status: 500 });
  }
}

// 2. POST - Create/Save draft or dispatch campaign actions
export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { action, id, slug, title, content, scheduledAt, testEmail } = body;

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https';
    const dynamicSiteUrl = `${protocol}://${host}`;

    // Handle Action triggers
    if (action === 'test') {
      if (!id || !testEmail) {
        return NextResponse.json({ error: 'Missing newsletter ID or test email.' }, { status: 400 });
      }
      const newsletter = await getNewsletterById(id);
      if (!newsletter) {
        return NextResponse.json({ error: 'Newsletter not found.' }, { status: 404 });
      }

      const { error } = await sendCampaignEmail({
        to: testEmail,
        email: testEmail,
        title: `[TEST] ${newsletter.title}`,
        markdown: newsletter.content,
        nid: newsletter.id,
        sid: 0, // Mock subscriber id for tests
        customSiteUrl: dynamicSiteUrl,
      });

      if (error) {
        return NextResponse.json({ error: 'Failed to send test email.' }, { status: 500 });
      }
      return NextResponse.json({ message: `Test email sent successfully to ${testEmail}` });
    }

    if (action === 'send') {
      if (!id) {
        return NextResponse.json({ error: 'Missing newsletter ID.' }, { status: 400 });
      }
      const newsletter = await getNewsletterById(id);
      if (!newsletter) {
        return NextResponse.json({ error: 'Newsletter not found.' }, { status: 404 });
      }

      // Fetch active verified subscribers
      const subscribers = await getSubscribers();
      const recipients = subscribers.filter((s) => s.verified && !s.unsubscribed);

      if (recipients.length === 0) {
        return NextResponse.json({ error: 'No verified active subscribers to send to.' }, { status: 400 });
      }

      // Send to each subscriber (using Promise.all or sequential)
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
            customSiteUrl: dynamicSiteUrl,
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

      return NextResponse.json({
        message: `Newsletter sent successfully. Sent: ${successCount}, Failed: ${errorCount}`,
      });
    }

    // Default: Create a new draft
    if (!title || !slug || !content) {
      return NextResponse.json({ error: 'Slug, title, and content are required.' }, { status: 400 });
    }

    const scheduledDate = scheduledAt ? new Date(scheduledAt) : null;
    const status = scheduledDate ? 'scheduled' : 'draft';

    const newDraft = await createNewsletter(slug, title, content, status, scheduledDate);
    return NextResponse.json(newDraft);
  } catch (error: any) {
    console.error('Admin Create/Send Campaign Error:', error);
    return NextResponse.json({ error: 'An error occurred processing the request.' }, { status: 500 });
  }
}

// 3. PUT - Update draft/campaign
export async function PUT(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, slug, title, content, status, scheduledAt, sentAt } = body;

    if (!id || !slug || !title || !content) {
      return NextResponse.json({ error: 'ID, slug, title, and content are required.' }, { status: 400 });
    }

    const scheduledDate = scheduledAt ? new Date(scheduledAt) : null;
    const sentDate = sentAt ? new Date(sentAt) : null;

    const updated = await updateNewsletter(
      id,
      slug,
      title,
      content,
      status,
      scheduledDate,
      sentDate
    );
    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Admin Update Campaign Error:', error);
    return NextResponse.json({ error: 'Failed to update newsletter.' }, { status: 500 });
  }
}

// 4. DELETE - Delete campaign
export async function DELETE(request: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');

    if (!idStr) {
      return NextResponse.json({ error: 'ID parameter is required.' }, { status: 400 });
    }

    const id = parseInt(idStr);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID.' }, { status: 400 });
    }

    await deleteNewsletter(id);
    return NextResponse.json({ message: 'Newsletter deleted successfully.' });
  } catch (error: any) {
    console.error('Admin Delete Campaign Error:', error);
    return NextResponse.json({ error: 'Failed to delete newsletter.' }, { status: 500 });
  }
}
