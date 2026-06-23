import { notFound, redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { getPostFromGitHub } from '@/lib/github';
import { PostEditor } from '@/app/admin/blogs/PostEditor';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditBlogPostPage({ params }: PageProps) {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect('/admin/login');
  }

  const { slug } = await params;
  const post = await getPostFromGitHub(slug);
  if (!post) {
    notFound();
  }

  return <PostEditor initialPost={post} />;
}
