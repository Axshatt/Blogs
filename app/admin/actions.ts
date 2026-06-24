'use server';

import { login, logout } from '@/lib/auth';
import { writePostToGitHub, deletePostFromGitHub, uploadImageToGitHub } from '@/lib/github';
import type { Category } from '@/types/post';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { serialize } from 'next-mdx-remote/serialize';
import { after } from 'next/server';
import { getNewsletterBySlug, createNewsletter, updateNewsletter, getSubscribers } from '@/lib/db';
import { sendCampaignEmail } from '@/lib/resend';

export async function loginAction(prevState: { error?: string } | null, formData: FormData) {
  const password = formData.get('password') as string;
  const success = await login(password);
  if (success) {
    redirect('/admin');
  }
  return { error: 'Invalid password. Please try again.' };
}

export async function logoutAction() {
  await logout();
  redirect('/admin/login');
}

export async function savePostAction(
  prevState: { error?: string; success?: boolean } | null,
  formData: FormData
) {
  const isEdit = formData.get('isEdit') === 'true';
  const originalSlug = formData.get('originalSlug') as string;
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const excerpt = formData.get('excerpt') as string;
  const category = formData.get('category') as Category;
  const tagsString = formData.get('tags') as string;
  const publishedDate = formData.get('publishedDate') as string;
  const author = formData.get('author') as string;
  const coverImage = formData.get('coverImage') as string;
  const featured = formData.get('featured') === 'true';
  const publishedStatus = formData.get('publishedStatus') === 'true';
  const content = formData.get('content') as string;
  const canonicalUrl = formData.get('canonicalUrl') as string;

  if (!title || !slug || !content) {
    return { error: 'Title, slug, and content are required.' };
  }

  const tags = tagsString
    ? tagsString.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const frontmatter = {
    title,
    excerpt,
    category,
    tags,
    published: publishedDate || new Date().toISOString().split('T')[0],
    draft: !publishedStatus,
    author: author || 'Akshat Singh',
    coverImage: coverImage || undefined,
    featured,
    canonical_url: canonicalUrl || undefined,
  };

  if (isEdit && originalSlug && originalSlug !== slug) {
    const deleted = await deletePostFromGitHub(originalSlug);
    if (!deleted) {
      return { error: 'Failed to rename post (unable to remove old slug file).' };
    }
  }

  const commitMessage = isEdit ? `Edit blog post: ${title}` : `Create blog post: ${title}`;
  const success = await writePostToGitHub(slug, frontmatter, content, commitMessage);

  if (success) {
    if (publishedStatus) {
      after(async () => {
        try {
          const trackingSlug = `auto-blog-${slug}`;
          const existing = await getNewsletterBySlug(trackingSlug);
          if (!existing) {
            const subscribers = await getSubscribers();
            const recipients = subscribers.filter((s) => s.verified && !s.unsubscribed);
            if (recipients.length > 0) {
              const newsletter = await createNewsletter(
                trackingSlug,
                title,
                content,
                'draft'
              );
              for (const subscriber of recipients) {
                try {
                  await sendCampaignEmail({
                    to: subscriber.email,
                    email: subscriber.email,
                    title: title,
                    markdown: content,
                    nid: newsletter.id,
                    sid: subscriber.id,
                  });
                } catch (err) {
                  console.error(`Failed to send auto-blog email to ${subscriber.email}:`, err);
                }
              }
              await updateNewsletter(
                newsletter.id,
                trackingSlug,
                title,
                content,
                'sent',
                null,
                new Date()
              );
            }
          }
        } catch (e) {
          console.error('Error running real-time auto-blog email sync:', e);
        }
      });
    }

    revalidatePath('/blog');
    revalidatePath(`/blog/${slug}`);
    revalidatePath('/');
    redirect('/admin');
  }

  return { error: 'Failed to save post to GitHub.' };
}

export async function deletePostAction(slug: string) {
  const success = await deletePostFromGitHub(slug);
  if (success) {
    revalidatePath('/blog');
    revalidatePath('/');
  }
  return success;
}

export async function uploadImageAction(
  prevState: { url?: string; error?: string } | null,
  formData: FormData
) {
  const file = formData.get('file') as File;
  if (!file || file.size === 0) {
    return { error: 'No file selected.' };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString('base64');

    const nameParts = file.name.split('.');
    const ext = nameParts.pop();
    const cleanName = `${Date.now()}-${nameParts.join('.').replace(/[^a-zA-Z0-9]/g, '_')}.${ext}`;

    const url = await uploadImageToGitHub(cleanName, base64Data);
    if (url) {
      return { url, success: true };
    }
    return { error: 'Failed to upload image to GitHub.' };
  } catch (e) {
    return { error: 'Error reading file.' };
  }
}

export async function compileMdxAction(content: string) {
  try {
    const serialized = await serialize(content);
    return { serialized };
  } catch (error: any) {
    return { error: error?.message || 'Failed to compile MDX' };
  }
}

