'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { markdownToHtml } from '@/lib/resend';

function NewsletterEditorInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idParam = searchParams.get('id');

  const [id, setId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<'draft' | 'scheduled' | 'sent'>('draft');
  const [scheduledAt, setScheduledAt] = useState('');
  
  const [testEmail, setTestEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [sendingCampaign, setSendingCampaign] = useState(false);

  // Auto-generate slug from title (only if slug is not edited yet)
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    if (!id) {
      const generated = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generated);
    }
  };

  // Load existing campaign if editing
  useEffect(() => {
    if (idParam) {
      const campaignId = parseInt(idParam);
      if (!isNaN(campaignId)) {
        setId(campaignId);
        fetch(`/api/admin/newsletter/campaigns`)
          .then((res) => res.json())
          .then((list) => {
            const item = list.find((c: any) => c.id === campaignId);
            if (item) {
              setTitle(item.title);
              setSlug(item.slug);
              setContent(item.content);
              setStatus(item.status);
              if (item.scheduled_at) {
                // Convert UTC string to local datetime-local format (YYYY-MM-DDThh:mm)
                const localDate = new Date(item.scheduled_at);
                const offset = localDate.getTimezoneOffset();
                const adjusted = new Date(localDate.getTime() - offset * 60 * 1000);
                setScheduledAt(adjusted.toISOString().slice(0, 16));
              }
            }
          })
          .catch((e) => console.error(e));
      }
    }
  }, [idParam]);

  // Save draft / Update campaign
  const handleSave = async () => {
    if (!title || !slug || !content) {
      alert('Please fill out Title, Slug, and Content before saving.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        id,
        title,
        slug,
        content,
        status: scheduledAt ? 'scheduled' : 'draft',
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
      };

      const method = id ? 'PUT' : 'POST';
      const res = await fetch('/api/admin/newsletter/campaigns', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save.');

      if (!id) {
        setId(data.id);
        // Update URL to edit mode
        router.replace(`/admin/newsletter/editor?id=${data.id}`);
      }
      alert('Campaign saved successfully!');
    } catch (e: any) {
      alert(e.message || 'An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  // Send Test Email
  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) {
      alert('Please save the draft first before sending a test.');
      return;
    }
    if (!testEmail) {
      alert('Please specify a test email.');
      return;
    }

    setSendingTest(true);
    try {
      const res = await fetch('/api/admin/newsletter/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'test',
          id,
          testEmail,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send test email.');

      alert(data.message || 'Test sent!');
    } catch (e: any) {
      alert(e.message || 'Failed to send test email.');
    } finally {
      setSendingTest(false);
    }
  };

  // Send campaign to all verified subscribers
  const handleSendCampaignNow = async () => {
    if (!id) {
      alert('Save this newsletter as a draft first.');
      return;
    }

    if (!confirm('Are you absolutely sure you want to send this newsletter to ALL verified subscribers now? This action cannot be undone.')) {
      return;
    }

    setSendingCampaign(true);
    try {
      const res = await fetch('/api/admin/newsletter/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          id,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send newsletter.');

      alert(data.message || 'Newsletter sent successfully!');
      router.push('/admin/newsletter');
    } catch (e: any) {
      alert(e.message || 'An error occurred during sending.');
    } finally {
      setSendingCampaign(false);
    }
  };

  const previewHtml = markdownToHtml(content);

  return (
    <div className="mx-auto max-w-7xl px-margin-mobile py-xl md:px-margin-desktop space-y-md">
      {/* Top action bar */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-md border-b border-outline-variant/20 pb-lg">
        <div className="flex items-center gap-md">
          <Link
            href="/admin/newsletter"
            className="group w-10 h-10 border border-outline-variant rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined !text-[20px] transition-transform group-hover:-translate-x-0.5">
              arrow_back
            </span>
          </Link>
          <div>
            <h1 className="text-headline-lg font-black tracking-tighter text-primary">
              {id ? 'Edit Campaign' : 'Write Newsletter'}
            </h1>
            <p className="text-body-sm text-on-surface-variant">
              Compose, preview, schedule, and send your newsletter issues.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-xs">
          <button
            onClick={handleSave}
            disabled={saving}
            className="text-label-bold border border-outline-variant bg-surface text-primary px-lg py-sm uppercase hover:bg-surface-container-low cursor-pointer transition-colors"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          
          {status !== 'sent' && (
            <button
              onClick={handleSendCampaignNow}
              disabled={sendingCampaign || !id}
              className="text-label-bold bg-primary text-on-primary px-lg py-sm uppercase hover:bg-primary/95 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendingCampaign ? 'Sending...' : 'Send to Subscribers'}
            </button>
          )}
        </div>
      </header>

      {/* Editor Main body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        {/* Left pane: inputs and editor textarea */}
        <div className="lg:col-span-6 space-y-md">
          {/* Metadata forms */}
          <div className="hairline-a p-md rounded-lg space-y-sm bg-surface-container-lowest">
            <div>
              <label htmlFor="title" className="text-label-sm font-semibold uppercase text-on-surface-variant/80">
                Campaign Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Weekly Log #14: Redesigning layouts"
                className="w-full bg-surface border border-outline-variant rounded px-sm py-xs text-body-md text-primary focus:outline-none focus:border-primary focus:ring-0 mt-xs"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
              <div>
                <label htmlFor="slug" className="text-label-sm font-semibold uppercase text-on-surface-variant/80">
                  Slug (URL pathname)
                </label>
                <input
                  id="slug"
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="weekly-log-14"
                  className="w-full bg-surface border border-outline-variant rounded px-sm py-xs text-body-md text-primary focus:outline-none focus:border-primary focus:ring-0 mt-xs"
                />
              </div>
              <div>
                <label htmlFor="schedule" className="text-label-sm font-semibold uppercase text-on-surface-variant/80">
                  Schedule Send (Optional)
                </label>
                <input
                  id="schedule"
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full bg-surface border border-outline-variant rounded px-sm py-xs text-body-md text-primary focus:outline-none focus:border-primary focus:ring-0 mt-xs cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Test Sender Form */}
          {id && (
            <form onSubmit={handleSendTest} className="hairline-a p-md rounded-lg flex items-center justify-between gap-md bg-surface-container-lowest">
              <div className="flex-1">
                <label htmlFor="test-email" className="text-label-sm font-semibold uppercase text-on-surface-variant/80">
                  Send Test Run
                </label>
                <input
                  id="test-email"
                  type="email"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  required
                  className="w-full bg-surface border border-outline-variant rounded px-sm py-xs text-body-sm text-primary focus:outline-none focus:border-primary focus:ring-0 mt-xs"
                />
              </div>
              <button
                type="submit"
                disabled={sendingTest}
                className="text-[11px] font-bold uppercase border border-outline-variant/70 bg-surface px-md py-sm rounded mt-[18px] hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                {sendingTest ? 'Sending...' : 'Test Send'}
              </button>
            </form>
          )}

          {/* Editor Input Area */}
          <div className="flex flex-col">
            <label htmlFor="content" className="text-label-sm font-semibold uppercase text-on-surface-variant/80 mb-sm">
              Newsletter Content (Markdown / MDX)
            </label>
            <textarea
              id="content"
              rows={18}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your email here using markdown..."
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-md p-md text-body-md text-primary font-mono focus:outline-none focus:border-primary focus:ring-0 resize-y min-h-[300px]"
            />
          </div>
        </div>

        {/* Right pane: live preview */}
        <div className="lg:col-span-6 space-y-md">
          <div className="flex items-center justify-between border-b border-outline-variant/10 pb-xs">
            <span className="text-label-sm font-semibold uppercase text-on-surface-variant/80">
              Live Campaign HTML Preview
            </span>
          </div>

          <div className="border border-outline-variant/30 rounded-lg p-lg bg-surface shadow-inner overflow-y-auto max-h-[75vh] min-h-[500px]">
            {title && (
              <h1 className="text-headline-xl font-black border-b border-outline-variant/10 pb-md mb-md text-primary">
                {title}
              </h1>
            )}
            
            {content ? (
              <div
                className="prose-content text-body-md text-on-surface-variant space-y-md"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <div className="text-center py-xxl text-on-surface-variant/50 italic text-body-md">
                Start typing markdown in the editor to see your email preview here.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NewsletterEditorPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <NewsletterEditorInner />
    </Suspense>
  );
}
