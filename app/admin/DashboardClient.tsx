'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Post } from '@/types/post';
import { logoutAction, deletePostAction } from './actions';

interface DashboardClientProps {
  initialPosts: Post[];
}

export function DashboardClient({ initialPosts }: DashboardClientProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  // Deletion Modal state
  const [deletingPost, setDeletingPost] = useState<Post | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Derive stats
  const totalCount = posts.length;
  const publishedCount = posts.filter((p) => !p.frontmatter.draft).length;
  const draftCount = posts.filter((p) => p.frontmatter.draft).length;

  // Perform client-side filter
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.frontmatter.title.toLowerCase().includes(search.toLowerCase()) ||
      post.frontmatter.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.frontmatter.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
      post.content.toLowerCase().includes(search.toLowerCase());

    const isDraft = post.frontmatter.draft;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && !isDraft) ||
      (statusFilter === 'draft' && isDraft);

    const matchesCategory =
      categoryFilter === 'all' || post.frontmatter.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleDelete = async () => {
    if (!deletingPost) return;
    setIsDeleting(true);
    try {
      const success = await deletePostAction(deletingPost.slug);
      if (success) {
        setPosts(posts.filter((p) => p.slug !== deletingPost.slug));
        setDeletingPost(null);
      } else {
        alert('Failed to delete post from GitHub repository.');
      }
    } catch (_e) {
      alert('An error occurred during deletion.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface px-margin-mobile py-xxl md:px-margin-desktop font-inter text-primary">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-outline-variant/40 pb-lg mb-xl gap-md">
        <div>
          <h1 className="text-[32px] font-black uppercase tracking-tight">CMS Dashboard</h1>
          <p className="text-label-sm uppercase text-on-surface-variant mt-xs">
            Manage your publication content
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <Link
            href="/admin/blogs/new"
            className="text-label-bold inline-flex items-center gap-xs bg-primary px-lg py-sm text-on-primary uppercase hover:bg-secondary cursor-pointer"
          >
            <span className="material-symbols-outlined !text-[18px]">add</span>
            New Post
          </Link>
          <button
            onClick={() => logoutAction()}
            className="text-label-bold inline-flex items-center gap-xs border border-outline-variant px-lg py-sm uppercase hover:bg-surface-container cursor-pointer"
          >
            <span className="material-symbols-outlined !text-[18px]">logout</span>
            Logout
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mb-xl">
        <div className="hairline-a bg-surface-container-lowest p-lg">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-label-bold uppercase">Total Posts</span>
            <span className="material-symbols-outlined text-[20px]">article</span>
          </div>
          <div className="text-[36px] font-black tracking-tight mt-xs">{totalCount}</div>
        </div>
        <div className="hairline-a bg-surface-container-lowest p-lg">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-label-bold uppercase">Published</span>
            <span className="material-symbols-outlined text-[20px] text-secondary">check_circle</span>
          </div>
          <div className="text-[36px] font-black tracking-tight mt-xs">{publishedCount}</div>
        </div>
        <div className="hairline-a bg-surface-container-lowest p-lg">
          <div className="flex items-center justify-between text-on-surface-variant">
            <span className="text-label-bold uppercase">Drafts</span>
            <span className="material-symbols-outlined text-[20px] text-outline">description</span>
          </div>
          <div className="text-[36px] font-black tracking-tight mt-xs">{draftCount}</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-md mb-lg">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-md top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search title, excerpt, tags, or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-[40px] pr-md py-sm border border-outline-variant bg-surface-container-lowest placeholder:text-outline/70 focus:border-primary focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex border border-outline-variant">
          {(['all', 'published', 'draft'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`text-label-bold px-lg py-sm uppercase transition-all cursor-pointer ${
                statusFilter === status
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="border border-outline-variant px-lg py-sm bg-surface-container-lowest uppercase text-label-bold outline-none focus:border-primary"
        >
          <option value="all">All Pillars</option>
          <option value="build-log">Build Log</option>
          <option value="tutorial">Tutorial</option>
          <option value="experiment">Experiment</option>
        </select>
      </div>

      {/* List Container */}
      <div className="hairline-a bg-surface-container-lowest">
        {filteredPosts.length === 0 ? (
          <div className="p-xxl text-center text-on-surface-variant">
            <span className="material-symbols-outlined !text-[48px] text-outline/50 mb-sm">
              find_in_page
            </span>
            <p className="text-body-md uppercase font-bold">No posts found matching the criteria.</p>
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/30">
            {filteredPosts.map((post) => (
              <div key={post.slug} className="flex flex-col md:flex-row md:items-center md:justify-between p-lg gap-md hover:bg-surface-container-low/30 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-sm mb-xs">
                    <span className={`text-[12px] font-bold tracking-wide rounded-full border px-sm py-[2px] uppercase ${
                      post.frontmatter.draft
                        ? 'border-outline text-on-surface-variant bg-surface-container'
                        : 'border-secondary text-secondary bg-secondary-container/20'
                    }`}>
                      {post.frontmatter.draft ? 'Draft' : 'Published'}
                    </span>
                    <span className="text-[12px] uppercase text-outline font-bold tracking-wider">
                      {post.frontmatter.category}
                    </span>
                    <span className="text-[12px] text-on-surface-variant">
                      {post.frontmatter.published}
                    </span>
                  </div>
                  <h3 className="text-[20px] font-bold leading-tight text-primary truncate">
                    {post.frontmatter.title}
                  </h3>
                  <p className="text-body-md mt-2xs text-on-surface-variant line-clamp-1">
                    {post.frontmatter.excerpt}
                  </p>
                </div>
                
                <div className="flex items-center gap-sm shrink-0">
                  <Link
                    href={`/admin/blogs/${post.slug}/edit`}
                    className="text-label-bold inline-flex items-center gap-xs border border-outline-variant px-md py-xs uppercase hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined !text-[16px]">edit</span>
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeletingPost(post)}
                    className="text-label-bold inline-flex items-center gap-xs border border-error/30 text-error bg-error-container/10 px-md py-xs uppercase hover:bg-error hover:text-on-error transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined !text-[16px]">delete</span>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs px-margin-mobile">
          <div className="w-full max-w-md hairline-a bg-surface p-xl font-inter">
            <div className="mb-lg">
              <h2 className="text-[24px] font-black uppercase tracking-tight text-error flex items-center gap-sm">
                <span className="material-symbols-outlined !text-[28px]">warning</span>
                Confirm Deletion
              </h2>
              <p className="text-body-md mt-sm text-on-surface-variant">
                Are you absolutely sure you want to delete the post <span className="font-bold text-primary">&quot;{deletingPost.frontmatter.title}&quot;</span>? This will permanently delete the file on GitHub and trigger a rebuild.
              </p>
            </div>
            <div className="flex justify-end gap-sm">
              <button
                disabled={isDeleting}
                onClick={() => setDeletingPost(null)}
                className="text-label-bold border border-outline-variant px-lg py-sm uppercase hover:bg-surface-container disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDelete}
                className="text-label-bold bg-error text-on-error px-lg py-sm uppercase hover:bg-red-700 disabled:opacity-50 cursor-pointer"
              >
                {isDeleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
