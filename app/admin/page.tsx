import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getLatestPostsFromGitHub } from '@/lib/github';
import { DashboardClient } from './DashboardClient';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  robots: {
    index: false,
    follow: false,
  },
};

// Force dynamic execution so we always get the latest state from GitHub
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect('/admin/login');
  }

  const posts = await getLatestPostsFromGitHub();

  return <DashboardClient initialPosts={posts} />;
}
