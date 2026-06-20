import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { PostEditor } from '../PostEditor';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Blog Post - Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewBlogPostPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect('/admin/login');
  }

  return <PostEditor />;
}
