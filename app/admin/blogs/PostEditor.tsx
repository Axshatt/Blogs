'use client';

import { useState, useActionState, useEffect } from 'react';
import Link from 'next/link';
import type { Post, Category } from '@/types/post';
import { savePostAction, uploadImageAction, compileMdxAction } from '../actions';
import { MDXRemote } from 'next-mdx-remote';
import { useMDXComponents } from '@/mdx-components';

interface PostEditorProps {
  initialPost?: Post;
}

export function PostEditor({ initialPost }: PostEditorProps) {
  const isEdit = !!initialPost;
  const originalSlug = initialPost?.slug || '';

  // Local Form States
  const [title, setTitle] = useState(initialPost?.frontmatter.title || '');
  const [slug, setSlug] = useState(initialPost?.slug || '');
  const [excerpt, setExcerpt] = useState(initialPost?.frontmatter.excerpt || '');
  const [category, setCategory] = useState(initialPost?.frontmatter.category || 'build-log');
  const [tags, setTags] = useState(initialPost?.frontmatter.tags.join(', ') || '');
  const [publishedDate, setPublishedDate] = useState(
    initialPost?.frontmatter.published || new Date().toISOString().split('T')[0]
  );
  const [author, setAuthor] = useState(initialPost?.frontmatter.author || 'Akshat Singh');
  const [coverImage, setCoverImage] = useState(initialPost?.frontmatter.coverImage || '');
  const [featured, setFeatured] = useState(initialPost?.frontmatter.featured || false);
  const [publishedStatus, setPublishedStatus] = useState(
    initialPost ? !initialPost.frontmatter.draft : true
  );
  const [content, setContent] = useState(initialPost?.content || '');

  // Tab State
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  // Image Upload State
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // MDX Compiler State
  const [compiledContent, setCompiledContent] = useState<any>(null);
  const [compiling, setCompiling] = useState(false);
  const [compileError, setCompileError] = useState('');

  const components = useMDXComponents({});

  useEffect(() => {
    if (activeTab === 'preview' && content) {
      setCompiling(true);
      setCompileError('');
      compileMdxAction(content)
        .then((res) => {
          if (res.serialized) {
            setCompiledContent(res.serialized);
          } else if (res.error) {
            setCompileError(res.error);
          }
        })
        .catch(() => {
          setCompileError('Error compiling MDX content.');
        })
        .finally(() => {
          setCompiling(false);
        });
    }
  }, [activeTab, content]);

  // Image Upload handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadImageAction(null, formData);
      if (res.url) {
        setCoverImage(res.url);
      } else if (res.error) {
        setUploadError(res.error);
      }
    } catch (_err) {
      setUploadError('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  // Bind server action
  const [state, formAction, isSaving] = useActionState(savePostAction, null);

  return (
    <div className="min-h-screen bg-surface px-margin-mobile py-xxl md:px-margin-desktop font-inter text-primary">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-outline-variant/40 pb-lg mb-xl gap-md">
        <div>
          <h1 className="text-[32px] font-black uppercase tracking-tight">
            {isEdit ? 'Edit Post' : 'New Post'}
          </h1>
          <p className="text-label-sm uppercase text-on-surface-variant mt-xs">
            {isEdit ? `Modifying: ${originalSlug}` : 'Publish a new entry'}
          </p>
        </div>
        <div>
          <Link
            href="/admin"
            className="text-label-bold inline-flex items-center gap-xs border border-outline-variant px-lg py-sm uppercase hover:bg-surface-container"
          >
            <span className="material-symbols-outlined !text-[18px]">arrow_back</span>
            Back to Dashboard
          </Link>
        </div>
      </div>

      <form action={formAction} className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
        {/* Hidden inputs to pass state */}
        <input type="hidden" name="isEdit" value={String(isEdit)} />
        <input type="hidden" name="originalSlug" value={originalSlug} />
        <input type="hidden" name="featured" value={String(featured)} />
        <input type="hidden" name="publishedStatus" value={String(publishedStatus)} />
        <input type="hidden" name="content" value={content} />
        <input type="hidden" name="coverImage" value={coverImage} />

        {/* LEFT COLUMN: Main Editor Area (Col span 8) */}
        <div className="lg:col-span-8 space-y-lg flex flex-col">
          {/* Title input */}
          <div>
            <label htmlFor="title" className="text-label-bold block uppercase text-primary mb-xs">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={title}
              onChange={(e) => {
                const val = e.target.value;
                setTitle(val);
                if (!isEdit) {
                  const generated = val
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
                  setSlug(generated);
                }
              }}
              placeholder="Enter post title..."
              className="w-full border border-outline-variant bg-surface-container-lowest px-md py-sm text-[20px] font-bold focus:border-primary focus:outline-none"
            />
          </div>

          {/* Editor and Preview tabs */}
          <div className="flex-1 flex flex-col min-h-[500px] border border-outline-variant/50 bg-surface-container-lowest">
            <div className="flex border-b border-outline-variant/30 bg-surface-container-low/40">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`text-label-bold px-lg py-sm uppercase cursor-pointer ${
                  activeTab === 'write'
                    ? 'border-b-2 border-primary bg-surface-container-lowest text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`text-label-bold px-lg py-sm uppercase cursor-pointer ${
                  activeTab === 'preview'
                    ? 'border-b-2 border-primary bg-surface-container-lowest text-primary'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                Preview
              </button>
            </div>

            <div className="flex-1 flex flex-col p-lg">
              {activeTab === 'write' ? (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your MDX content here..."
                  className="flex-1 w-full min-h-[400px] bg-transparent border-none outline-none font-mono text-[14px] leading-relaxed resize-y focus:ring-0"
                />
              ) : (
                <div className="prose-content max-w-none min-h-[400px] overflow-y-auto font-sans leading-relaxed">
                  {compiling ? (
                    <div className="flex items-center gap-sm text-label-sm text-outline">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      Compiling preview...
                    </div>
                  ) : compileError ? (
                    <p className="text-label-sm text-error bg-error-container/20 border border-error/20 p-sm uppercase">
                      {compileError}
                    </p>
                  ) : compiledContent ? (
                    <MDXRemote {...compiledContent} components={components} />
                  ) : (
                    <p className="text-label-sm text-outline italic">Nothing to preview yet.</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Settings Panel (Col span 4) */}
        <div className="lg:col-span-4 space-y-lg">
          <div className="hairline-a bg-surface-container-lowest p-lg space-y-md">
            <h2 className="text-label-bold uppercase border-b border-outline-variant/20 pb-xs mb-md text-primary">
              Post Configurations
            </h2>

            {/* Slug input */}
            <div>
              <label htmlFor="slug" className="text-label-bold block uppercase text-primary mb-xs">
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                placeholder="slug-path-format"
                className="w-full border border-outline-variant/50 bg-surface-container-lowest px-md py-xs text-[14px] font-mono focus:border-primary focus:outline-none"
              />
            </div>

            {/* Meta Description / Excerpt */}
            <div>
              <label htmlFor="excerpt" className="text-label-bold block uppercase text-primary mb-xs">
                Meta Description / Excerpt
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Brief summary for list cards and search engines..."
                className="w-full border border-outline-variant/50 bg-surface-container-lowest px-md py-xs text-[14px] focus:border-primary focus:outline-none resize-none"
              />
            </div>

            {/* Category / Pillar */}
            <div>
              <label htmlFor="category" className="text-label-bold block uppercase text-primary mb-xs">
                Content Pillar
              </label>
              <select
                id="category"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full border border-outline-variant/50 bg-surface-container-lowest px-md py-xs text-[14px] uppercase text-label-bold outline-none focus:border-primary"
              >
                <option value="build-log">Build Log</option>
                <option value="tutorial">Tutorial</option>
                <option value="experiment">Experiment</option>
              </select>
            </div>

            {/* Tags Input */}
            <div>
              <label htmlFor="tags" className="text-label-bold block uppercase text-primary mb-xs">
                Tags (Comma-separated)
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ai, dev, tutorials"
                className="w-full border border-outline-variant/50 bg-surface-container-lowest px-md py-xs text-[14px] focus:border-primary focus:outline-none"
              />
            </div>

            {/* Published Date */}
            <div>
              <label htmlFor="publishedDate" className="text-label-bold block uppercase text-primary mb-xs">
                Publish Date
              </label>
              <input
                id="publishedDate"
                name="publishedDate"
                type="date"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
                className="w-full border border-outline-variant/50 bg-surface-container-lowest px-md py-xs text-[14px] focus:border-primary focus:outline-none"
              />
            </div>

            {/* Author */}
            <div>
              <label htmlFor="author" className="text-label-bold block uppercase text-primary mb-xs">
                Author
              </label>
              <input
                id="author"
                name="author"
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full border border-outline-variant/50 bg-surface-container-lowest px-md py-xs text-[14px] focus:border-primary focus:outline-none"
              />
            </div>

            {/* Cover Image Upload */}
            <div>
              <label className="text-label-bold block uppercase text-primary mb-xs">
                Cover Image
              </label>
              
              {/* Display existing or uploaded cover image path */}
              <input
                type="text"
                readOnly
                placeholder="/blog-images/example.jpg"
                value={coverImage}
                className="w-full border border-outline-variant/50 bg-surface-container-lowest px-md py-xs text-[12px] text-on-surface-variant outline-none font-mono mb-sm"
              />

              <div className="flex gap-sm">
                <input
                  type="file"
                  id="imageFile"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="imageFile"
                  className="text-label-bold border border-outline-variant/50 px-md py-xs uppercase bg-surface-container-lowest hover:bg-surface-container cursor-pointer text-[12px] inline-flex items-center gap-xs"
                >
                  <span className="material-symbols-outlined !text-[16px]">upload_file</span>
                  {uploading ? 'Uploading...' : 'Upload Image'}
                </label>
                {coverImage && (
                  <button
                    type="button"
                    onClick={() => setCoverImage('')}
                    className="text-label-bold border border-error/20 text-error bg-error-container/10 px-md py-xs uppercase hover:bg-error hover:text-on-error cursor-pointer text-[12px]"
                  >
                    Clear
                  </button>
                )}
              </div>

              {uploadError && <p className="text-[12px] text-error mt-xs uppercase">{uploadError}</p>}

              {/* Cover Image Preview */}
              {coverImage && (
                <div className="mt-sm border border-outline-variant/30 p-xs bg-surface-container">
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full max-h-[140px] object-cover"
                  />
                </div>
              )}
            </div>

            {/* Featured Post Toggle */}
            <div className="flex items-center justify-between py-xs border-t border-outline-variant/20 pt-md">
              <span className="text-label-bold uppercase text-primary">Featured Post</span>
              <button
                type="button"
                onClick={() => setFeatured(!featured)}
                className={`w-[48px] h-[26px] rounded-full p-[3px] transition-colors duration-200 cursor-pointer ${
                  featured ? 'bg-secondary' : 'bg-outline-variant'
                }`}
              >
                <div
                  className={`w-[20px] h-[20px] rounded-full bg-white transition-transform duration-200 ${
                    featured ? 'translate-x-[22px]' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Published Toggle */}
            <div className="flex items-center justify-between py-xs border-t border-outline-variant/20 pt-md">
              <span className="text-label-bold uppercase text-primary">Published Status</span>
              <button
                type="button"
                onClick={() => setPublishedStatus(!publishedStatus)}
                className={`w-[48px] h-[26px] rounded-full p-[3px] transition-colors duration-200 cursor-pointer ${
                  publishedStatus ? 'bg-secondary' : 'bg-outline-variant'
                }`}
              >
                <div
                  className={`w-[20px] h-[20px] rounded-full bg-white transition-transform duration-200 ${
                    publishedStatus ? 'translate-x-[22px]' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {state?.error && (
              <p className="text-label-sm text-error bg-error-container/20 border border-error/20 p-sm uppercase">
                {state.error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSaving || uploading}
              className="text-label-bold w-full bg-primary py-md text-on-primary uppercase transition-all duration-200 hover:bg-secondary disabled:opacity-50 mt-lg cursor-pointer"
            >
              {isSaving ? 'Saving back to GitHub...' : isEdit ? 'Update Post' : 'Publish Post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
