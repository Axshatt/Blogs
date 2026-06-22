'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Subscriber {
  id: number;
  email: string;
  created_at: string;
  verified: boolean;
  unsubscribed: boolean;
  signup_ip: string | null;
}

interface Campaign {
  id: number;
  slug: string;
  title: string;
  status: 'draft' | 'scheduled' | 'sent';
  scheduled_at: string | null;
  sent_at: string | null;
  created_at: string;
}

interface Analytics {
  totalSubscribers: number;
  verifiedSubscribers: number;
  unsubscribed: number;
  growth: { date: string; count: number }[];
  campaignPerformance: { id: number; title: string; sentAt: string; opens: number; clicks: number }[];
}

export default function AdminNewsletterDashboard() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalSubscribers: 0,
    verifiedSubscribers: 0,
    unsubscribed: 0,
    growth: [],
    campaignPerformance: [],
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch all admin newsletter data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch subscribers
      const subRes = await fetch(`/api/admin/newsletter/subscribers?search=${encodeURIComponent(searchTerm)}`);
      const subData = await subRes.json();
      if (subRes.ok) setSubscribers(subData);

      // Fetch campaigns
      const camRes = await fetch('/api/admin/newsletter/campaigns');
      const camData = await camRes.json();
      if (camRes.ok) setCampaigns(camData);

      // Extract analytics totals
      const total = subData.length;
      const verified = subData.filter((s: Subscriber) => s.verified).length;
      const unsub = subData.filter((s: Subscriber) => s.unsubscribed).length;
      
      setAnalytics((prev) => ({
        ...prev,
        totalSubscribers: total,
        verifiedSubscribers: verified,
        unsubscribed: unsub,
      }));
    } catch (e) {
      console.error('Failed to load admin newsletter data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const handleDeleteCampaign = async (id: number) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;
    try {
      const res = await fetch(`/api/admin/newsletter/campaigns?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert('Failed to delete campaign');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-margin-mobile py-xl md:px-margin-desktop space-y-xl">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-md border-b border-outline-variant/20 pb-lg">
        <div>
          <h1 className="text-display-lg-mobile font-black tracking-tighter text-primary">
            Newsletter Manager
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Manage your newsletter campaigns, drafts, and subscriber growth.
          </p>
        </div>
        <div className="flex gap-sm">
          <a
            href="/api/admin/newsletter/subscribers?format=csv"
            className="text-label-bold inline-flex items-center gap-xs border border-outline-variant px-lg py-sm uppercase bg-surface hover:bg-surface-container-low cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined !text-[18px]">download</span>
            Export CSV
          </a>
          <Link
            href="/admin/newsletter/editor"
            className="text-label-bold inline-flex items-center gap-xs bg-primary text-on-primary px-lg py-sm uppercase hover:bg-primary/95 cursor-pointer transition-colors"
          >
            <span className="material-symbols-outlined !text-[18px]">add</span>
            New Campaign
          </Link>
        </div>
      </header>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
        <div className="hairline-a bg-surface p-lg rounded-lg">
          <div className="text-label-sm text-on-surface-variant/70 uppercase font-semibold">Total Signups</div>
          <div className="text-[36px] font-black tracking-tighter mt-xs text-primary">
            {analytics.totalSubscribers}
          </div>
        </div>
        <div className="hairline-a bg-surface p-lg rounded-lg">
          <div className="text-label-sm text-on-surface-variant/70 uppercase font-semibold">Verified Active</div>
          <div className="text-[36px] font-black tracking-tighter mt-xs text-secondary-on-container text-[#566500]">
            {analytics.verifiedSubscribers}
          </div>
        </div>
        <div className="hairline-a bg-surface p-lg rounded-lg">
          <div className="text-label-sm text-on-surface-variant/70 uppercase font-semibold">Unsubscribed</div>
          <div className="text-[36px] font-black tracking-tighter mt-xs text-error">
            {analytics.unsubscribed}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Left Side: Campaigns list */}
        <div className="lg:col-span-7 space-y-md">
          <h2 className="text-headline-sm font-extrabold tracking-tight">Campaigns</h2>
          
          {loading ? (
            <div className="py-xl text-center text-on-surface-variant">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className="hairline-a p-xl rounded-lg text-center text-on-surface-variant bg-surface-container-low">
              No campaigns created yet. Click "New Campaign" to write your first newsletter.
            </div>
          ) : (
            <div className="space-y-sm">
              {campaigns.map((c) => {
                const date = c.sent_at || c.scheduled_at || c.created_at;
                const dateLabel = c.sent_at ? 'Sent' : c.scheduled_at ? 'Scheduled' : 'Created';
                const formattedDate = new Date(date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <div
                    key={c.id}
                    className="hairline-a bg-surface hover:bg-surface-container-low p-md rounded-lg flex items-center justify-between gap-md transition-all duration-300"
                  >
                    <div className="space-y-xs">
                      <div className="flex items-center gap-sm">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            c.status === 'sent'
                              ? 'bg-secondary-container text-on-secondary-container'
                              : c.status === 'scheduled'
                              ? 'bg-primary-container text-on-primary-container'
                              : 'bg-surface-container-highest text-on-surface-variant'
                          }`}
                        >
                          {c.status}
                        </span>
                        <span className="text-[11px] text-on-surface-variant">
                          {dateLabel}: {formattedDate}
                        </span>
                      </div>
                      <h3 className="text-body-lg font-bold text-primary">{c.title}</h3>
                    </div>
                    <div className="flex items-center gap-xs">
                      <Link
                        href={`/admin/newsletter/editor?id=${c.id}`}
                        className="w-9 h-9 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                        title="Edit Campaign"
                      >
                        <span className="material-symbols-outlined !text-[18px]">edit</span>
                      </Link>
                      <button
                        onClick={() => handleDeleteCampaign(c.id)}
                        className="w-9 h-9 rounded-full hover:bg-error/10 flex items-center justify-center text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                        title="Delete Campaign"
                      >
                        <span className="material-symbols-outlined !text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Subscribers list & search */}
        <div className="lg:col-span-5 space-y-md">
          <div className="flex items-center justify-between">
            <h2 className="text-headline-sm font-extrabold tracking-tight">Subscribers</h2>
          </div>

          <form onSubmit={handleSearch} className="flex gap-sm">
            <input
              type="text"
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-md px-md py-sm text-body-md text-primary focus:outline-none focus:border-primary focus:ring-0"
            />
            <button
              type="submit"
              className="bg-primary text-on-primary hover:bg-primary/95 text-label-bold uppercase px-lg rounded-md cursor-pointer transition-colors"
            >
              Search
            </button>
          </form>

          {loading ? (
            <div className="py-xl text-center text-on-surface-variant">Loading subscribers...</div>
          ) : subscribers.length === 0 ? (
            <div className="hairline-a p-xl rounded-lg text-center text-on-surface-variant bg-surface-container-low">
              No subscribers found.
            </div>
          ) : (
            <div className="border border-outline-variant/30 rounded-lg overflow-hidden bg-surface max-h-[480px] overflow-y-auto">
              <table className="w-full border-collapse text-left text-body-sm">
                <thead>
                  <tr className="bg-surface-container border-b border-outline-variant/30 text-on-surface-variant uppercase text-[10px] font-bold">
                    <th className="p-md">Email</th>
                    <th className="p-md text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15">
                  {subscribers.map((sub) => (
                    <tr key={sub.id} className="hover:bg-surface-container-low">
                      <td className="p-md font-medium text-primary break-all max-w-[200px]">
                        {sub.email}
                      </td>
                      <td className="p-md text-right">
                        <div className="flex flex-col items-end gap-[2px]">
                          <span
                            className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              sub.verified
                                ? 'bg-secondary-container text-on-secondary-container'
                                : 'bg-error-container text-on-error-container'
                            }`}
                          >
                            {sub.verified ? 'Verified' : 'Pending'}
                          </span>
                          {sub.unsubscribed && (
                            <span className="text-[9px] font-bold uppercase bg-error/10 text-error px-1.5 py-0.5 rounded">
                              Unsubscribed
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
