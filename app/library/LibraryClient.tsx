'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getLibraryLists, saveLibraryLists, type LibraryList } from '@/lib/library';

interface PostData {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  published: string;
  category: string;
  tags: string[];
  readingTime: string;
}

type Tab = 'your-lists' | 'reading-history';

export function LibraryClient({ posts }: { posts: PostData[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('your-lists');
  const [lists, setLists] = useState<LibraryList[]>([]);
  const [historySlugs, setHistorySlugs] = useState<string[]>([]);
  
  // Drill-down view state for a single list
  const [selectedListName, setSelectedListName] = useState<string | null>(null);
  
  // Create list state
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');

  // More options state
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editListName, setEditListName] = useState('');
  const [isReordering, setIsReordering] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const loadData = () => {
    setLists(getLibraryLists());

    // Load reading history
    const history = localStorage.getItem('reading_history');
    if (history) {
      try {
        setHistorySlugs(JSON.parse(history) as string[]);
      } catch {
        setHistorySlugs([]);
      }
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('bookmarks-updated', loadData);
    return () => window.removeEventListener('bookmarks-updated', loadData);
  }, []);

  // Close more menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    if (lists.some((l) => l.name.toLowerCase() === newListName.trim().toLowerCase())) {
      alert('A list with this name already exists.');
      return;
    }

    const newList: LibraryList = {
      name: newListName.trim(),
      slugs: [],
      isPrivate: true,
    };
    const updated = [...lists, newList];
    saveLibraryLists(updated);
    setLists(updated);

    setNewListName('');
    setIsCreating(false);
  };

  const deleteList = (listName: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (listName === 'Reading list') {
      alert('The default Reading list cannot be deleted.');
      return;
    }
    if (!confirm(`Are you sure you want to delete "${listName}"?`)) return;

    const updated = lists.filter((l) => l.name !== listName);
    saveLibraryLists(updated);
    setLists(updated);
    if (selectedListName === listName) {
      setSelectedListName(null);
    }
  };

  const removePostFromList = (listName: string, slug: string) => {
    const updated = lists.map((list) => {
      if (list.name === listName) {
        list.slugs = list.slugs.filter((s) => s !== slug);
      }
      return list;
    });
    saveLibraryLists(updated);
    setLists(updated);
  };

  // Toggle list privacy (public/private)
  const toggleListPrivacy = (listName: string) => {
    const updated = lists.map((list) => {
      if (list.name === listName) {
        list.isPrivate = !list.isPrivate;
      }
      return list;
    });
    saveLibraryLists(updated);
    setLists(updated);
    setShowMoreMenu(false);
  };

  // Copy list link
  const copyListLink = (listName: string) => {
    const url = `${window.location.origin}/library?list=${encodeURIComponent(listName)}`;
    navigator.clipboard.writeText(url).then(() => {
      alert('Link copied to clipboard!');
    });
    setShowMoreMenu(false);
  };

  // Start editing list name
  const startEditingList = () => {
    if (selectedListName) {
      setEditListName(selectedListName);
      setIsEditingInfo(true);
    }
    setShowMoreMenu(false);
  };

  // Rename list
  const handleRenameList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editListName.trim() || !selectedListName) return;

    if (
      lists.some(
        (l) =>
          l.name.toLowerCase() === editListName.trim().toLowerCase() &&
          l.name !== selectedListName
      )
    ) {
      alert('A list with this name already exists.');
      return;
    }

    const updated = lists.map((list) => {
      if (list.name === selectedListName) {
        list.name = editListName.trim();
      }
      return list;
    });
    saveLibraryLists(updated);
    setLists(updated);
    setSelectedListName(editListName.trim());
    setIsEditingInfo(false);
  };

  // Move items (reorder slugs)
  const moveItem = (listName: string, slug: string, direction: 'up' | 'down') => {
    const list = lists.find((l) => l.name === listName);
    if (!list) return;
    const index = list.slugs.indexOf(slug);
    if (index === -1) return;
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= list.slugs.length) return;

    const newSlugs = [...list.slugs];
    // Swap items
    const temp = newSlugs[index];
    newSlugs[index] = newSlugs[newIndex];
    newSlugs[newIndex] = temp;

    const updated = lists.map((l) => {
      if (l.name === listName) {
        l.slugs = newSlugs;
      }
      return l;
    });
    saveLibraryLists(updated);
    setLists(updated);
  };

  const historyPosts = posts.filter((p) => historySlugs.includes(p.slug));
  
  // Get active posts depending on tab & selected list
  const currentList = lists.find((l) => l.name === selectedListName);
  
  // Maintain the custom order of slugs in the selected list
  const activeListPosts = currentList
    ? currentList.slugs
        .map((slug) => posts.find((p) => p.slug === slug))
        .filter((p): p is PostData => !!p)
    : [];

  const TABS = [
    { id: 'your-lists' as Tab, label: 'Your lists' },
    { id: 'reading-history' as Tab, label: 'Reading history' },
  ];

  return (
    <div className="px-margin-mobile md:px-margin-desktop pt-[110px] pb-xl max-w-[800px] mx-auto font-sans px-lg md:px-xl">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-xl">
        <h1 className="text-headline-lg md:text-[42px] font-black tracking-tight text-primary">
          Your library
        </h1>
        {activeTab === 'your-lists' && !selectedListName && (
          <button
            onClick={() => setIsCreating(true)}
            className="bg-[#1a8917] hover:bg-green-800 text-white text-label-bold px-lg py-sm rounded-full transition-colors cursor-pointer"
          >
            New list
          </button>
        )}
      </div>

      {/* Create New List Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
          <div className="bg-surface border border-outline-variant/30 rounded-lg p-xl w-full max-w-[400px] shadow-2xl animate-fade-in text-primary">
            <h3 className="text-title-lg font-extrabold mb-md">Create new list</h3>
            <form onSubmit={handleCreateList} className="space-y-md">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Give your list a name..."
                autoFocus
                className="w-full text-body-md border border-outline-variant/50 rounded px-md py-sm focus:border-[#1a8917] focus:outline-none bg-surface-container-lowest"
              />
              <div className="flex justify-end gap-md">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="text-label-bold text-on-surface-variant hover:text-primary cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#1a8917] hover:bg-green-800 text-white text-label-bold px-md py-xs rounded-full transition-colors cursor-pointer"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabs */}
      {!selectedListName && (
        <div className="flex items-center gap-xl border-b border-outline-variant/30 mb-xl">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-md text-body-md font-medium transition-all duration-200 cursor-pointer relative ${
                activeTab === tab.id
                  ? 'text-primary font-bold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}

      {/* Tab Contents: Your Lists */}
      {activeTab === 'your-lists' && !selectedListName && (
        <div className="space-y-lg">
          {lists.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-4xl text-center">
              <span className="material-symbols-outlined !text-[64px] text-on-surface-variant/30 mb-lg">
                bookmark
              </span>
              <h3 className="text-title-lg font-bold text-primary mb-sm">No lists created</h3>
              <p className="text-body-md text-on-surface-variant max-w-[380px]">
                Create a new list or add bookmarks to start building your personal library.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              {lists.map((list) => {
                const listPosts = list.slugs
                  .map((slug) => posts.find((p) => p.slug === slug))
                  .filter((p): p is PostData => !!p);
                const count = list.slugs.length;

                return (
                  <div
                    key={list.name}
                    onClick={() => setSelectedListName(list.name)}
                    className="border border-outline-variant/20 rounded-lg overflow-hidden bg-surface-container-low cursor-pointer hover:border-outline-variant transition-colors flex flex-col justify-between h-[280px]"
                  >
                    {/* Header */}
                    <div className="p-lg">
                      <div className="flex items-center justify-between mb-sm">
                        <div className="flex items-center gap-sm">
                          <div className="relative w-6 h-6 rounded-full overflow-hidden border border-outline-variant/40">
                            <Image
                              src="/images/akshat_profile.png"
                              alt="Akshat Singh"
                              fill
                              sizes="24px"
                              className="object-cover"
                            />
                          </div>
                          <span className="text-[13px] font-bold text-primary">Akshat Singh</span>
                        </div>
                        {list.name !== 'Reading list' && (
                          <button
                            onClick={(e) => deleteList(list.name, e)}
                            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant/60 hover:text-error transition-colors cursor-pointer"
                            title="Delete List"
                          >
                            <span className="material-symbols-outlined !text-[18px]">delete</span>
                          </button>
                        )}
                      </div>

                      <h3 className="text-title-lg font-extrabold text-primary mb-xs">{list.name}</h3>
                      <p className="text-label-sm text-on-surface-variant flex items-center gap-xs">
                        <span>{count} {count === 1 ? 'story' : 'stories'}</span>
                        {list.isPrivate && (
                          <span className="material-symbols-outlined !text-[14px]">lock</span>
                        )}
                      </p>
                    </div>

                    {/* Thumbnail collage */}
                    <div className="flex border-t border-outline-variant/20 h-[100px]">
                      {listPosts.slice(0, 3).map((post) => (
                        <div
                          key={post.slug}
                          className="flex-1 relative bg-surface-container h-full border-r border-outline-variant/25 last:border-r-0"
                        >
                          {post.coverImage ? (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-surface-container-high">
                              <span className="material-symbols-outlined !text-[24px] text-on-surface-variant/20">article</span>
                            </div>
                          )}
                        </div>
                      ))}
                      {listPosts.length < 3 &&
                        Array.from({ length: 3 - listPosts.length }).map((_, i) => (
                          <div
                            key={`empty-${i}`}
                            className="flex-1 h-full bg-surface-container-high border-r border-outline-variant/25 last:border-r-0"
                          />
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Detailed List View */}
      {activeTab === 'your-lists' && selectedListName && currentList && (
        <div>
          {/* Back button */}
          <div className="flex items-center justify-between mb-lg">
            <button
              onClick={() => {
                setSelectedListName(null);
                setIsReordering(false);
                setIsEditingInfo(false);
              }}
              className="flex items-center gap-xs text-[#1a8917] hover:text-green-800 transition-colors cursor-pointer font-bold text-body-md"
            >
              <span className="material-symbols-outlined !text-[20px]">arrow_back</span>
              Back to library
            </button>
          </div>

          {/* List Title Card */}
          <div className="border border-outline-variant/20 rounded-lg p-lg bg-surface-container-low mb-xl relative">
            <div className="flex justify-between items-start">
              <div className="flex-1 mr-xl">
                <div className="flex items-center gap-sm mb-xs">
                  <div className="relative w-6 h-6 rounded-full overflow-hidden border border-outline-variant/40">
                    <Image
                      src="/images/akshat_profile.png"
                      alt="Akshat Singh"
                      fill
                      sizes="24px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-[13px] font-bold text-primary">Akshat Singh</span>
                </div>

                {isEditingInfo ? (
                  <form onSubmit={handleRenameList} className="flex gap-sm items-center mt-xs">
                    <input
                      type="text"
                      value={editListName}
                      onChange={(e) => setEditListName(e.target.value)}
                      className="text-body-md border border-outline-variant/50 rounded px-sm py-xs bg-surface text-primary focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="text-label-bold text-[#1a8917] hover:text-green-800 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingInfo(false)}
                      className="text-label-bold text-on-surface-variant hover:text-primary cursor-pointer"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <h2 className="text-headline-md font-extrabold text-primary mb-xs">
                      {selectedListName}
                    </h2>
                    <p className="text-label-sm text-on-surface-variant flex items-center gap-xs">
                      <span>
                        {activeListPosts.length}{' '}
                        {activeListPosts.length === 1 ? 'story' : 'stories'}
                      </span>
                      {currentList.isPrivate && (
                        <span className="material-symbols-outlined !text-[14px]">lock</span>
                      )}
                    </p>
                  </>
                )}
              </div>

              {/* More options menu */}
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setShowMoreMenu((prev) => !prev)}
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-container-high text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  aria-label="More options"
                >
                  <span className="material-symbols-outlined !text-[22px]">more_horiz</span>
                </button>

                {showMoreMenu && (
                  <div className="absolute right-0 top-full mt-xs z-50 w-[180px] bg-surface border border-outline-variant/35 rounded-lg shadow-xl py-sm animate-fade-in text-primary text-body-md">
                    <button
                      onClick={startEditingList}
                      className="w-full text-left px-md py-sm hover:bg-surface-container-low transition-colors cursor-pointer flex items-center gap-sm"
                    >
                      <span className="material-symbols-outlined !text-[18px]">edit</span>
                      Edit list info
                    </button>
                    <button
                      onClick={() => {
                        setIsReordering((prev) => !prev);
                        setShowMoreMenu(false);
                      }}
                      className="w-full text-left px-md py-sm hover:bg-surface-container-low transition-colors cursor-pointer flex items-center gap-sm"
                    >
                      <span className="material-symbols-outlined !text-[18px]">reorder</span>
                      {isReordering ? 'Done reordering' : 'Reorder items'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Posts inside this list */}
          {activeListPosts.length === 0 ? (
            <div className="text-center py-xxl">
              <span className="material-symbols-outlined !text-[48px] text-on-surface-variant/30 mb-md">
                article
              </span>
              <p className="text-body-md text-on-surface-variant">This list is empty.</p>
              <Link
                href="/blog"
                className="mt-md inline-flex items-center gap-xs bg-primary text-on-primary px-lg py-sm rounded-full text-label-bold hover:opacity-90 transition-opacity"
              >
                Browse posts
              </Link>
            </div>
          ) : (
            <div className="space-y-0">
              {activeListPosts.map((post, idx) => {
                const date = new Date(post.published).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <div
                    key={post.slug}
                    className="group flex flex-col gap-md py-lg border-b border-outline-variant/20 last:border-b-0"
                  >
                    {/* Reorder layout when active */}
                    <div className="flex items-center gap-md">
                      {isReordering && (
                        <div className="flex flex-col gap-xs shrink-0">
                          <button
                            onClick={() => moveItem(selectedListName, post.slug, 'up')}
                            disabled={idx === 0}
                            className={`w-7 h-7 flex items-center justify-center rounded-full border border-outline-variant/30 hover:bg-surface-container transition-colors cursor-pointer ${
                              idx === 0 ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                            title="Move Up"
                          >
                            <span className="material-symbols-outlined !text-[16px]">arrow_upward</span>
                          </button>
                          <button
                            onClick={() => moveItem(selectedListName, post.slug, 'down')}
                            disabled={idx === activeListPosts.length - 1}
                            className={`w-7 h-7 flex items-center justify-center rounded-full border border-outline-variant/30 hover:bg-surface-container transition-colors cursor-pointer ${
                              idx === activeListPosts.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                            title="Move Down"
                          >
                            <span className="material-symbols-outlined !text-[16px]">arrow_downward</span>
                          </button>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        {/* Author meta */}
                        <div className="flex items-center gap-xs text-label-sm text-primary mb-xs">
                          <span className="font-extrabold">Akshat Singh</span>
                          <span className="text-on-surface-variant/50">·</span>
                          <span className="text-on-surface-variant/80 font-medium">{date}</span>
                        </div>

                        {/* Title + Cover */}
                        <div className="flex flex-row gap-lg justify-between items-start">
                          <div className="flex-1 min-w-0">
                            <Link href={`/blog/${post.slug}`} className="block group/link">
                              <h3 className="text-[18px] md:text-[20px] font-extrabold leading-snug tracking-tight text-primary group-hover/link:text-secondary transition-colors">
                                {post.title}
                              </h3>
                              <p className="text-body-md text-on-surface-variant line-clamp-2 mt-xs">
                                {post.excerpt}
                              </p>
                            </Link>
                          </div>

                          {post.coverImage && (
                            <Link href={`/blog/${post.slug}`} className="shrink-0">
                              <div className="w-[110px] h-[75px] sm:w-[130px] sm:h-[85px] relative overflow-hidden bg-surface-container rounded">
                                <img
                                  src={post.coverImage}
                                  alt={post.title}
                                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                              </div>
                            </Link>
                          )}
                        </div>

                        {/* Bottom row */}
                        <div className="flex items-center justify-between text-label-sm text-on-surface-variant/70 mt-sm">
                          <div className="flex items-center gap-sm">
                            <span className="bg-surface-container-high text-on-surface-variant px-sm py-0.5 rounded-full text-[11px] font-semibold uppercase">
                              {post.category}
                            </span>
                            <span>{post.readingTime}</span>
                          </div>

                          <button
                            onClick={() => removePostFromList(selectedListName, post.slug)}
                            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-low hover:text-primary transition-colors cursor-pointer text-primary"
                            title="Remove from list"
                          >
                            <span className="material-symbols-outlined !text-[18px] fill-current">bookmark</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Contents: Reading History */}
      {activeTab === 'reading-history' && (
        <div>
          {historyPosts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-4xl text-center">
              <span className="material-symbols-outlined !text-[64px] text-on-surface-variant/30 mb-lg">
                history
              </span>
              <h3 className="text-title-lg font-bold text-primary mb-sm">No reading history yet</h3>
              <p className="text-body-md text-on-surface-variant max-w-[380px]">
                Posts you read on the blog will show up here automatically.
              </p>
            </div>
          ) : (
            <div className="space-y-0">
              {historyPosts.map((post) => {
                const date = new Date(post.published).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });

                return (
                  <div
                    key={post.slug}
                    className="group flex flex-col gap-md py-lg border-b border-outline-variant/20 last:border-b-0"
                  >
                    {/* Author meta */}
                    <div className="flex items-center gap-xs text-label-sm text-primary">
                      <span className="font-extrabold">Akshat Singh</span>
                      <span className="text-on-surface-variant/50">·</span>
                      <span className="text-on-surface-variant/80 font-medium">{date}</span>
                    </div>

                    {/* Title + Cover */}
                    <div className="flex flex-row gap-lg justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <Link href={`/blog/${post.slug}`} className="block group/link">
                          <h3 className="text-[18px] md:text-[20px] font-extrabold leading-snug tracking-tight text-primary group-hover/link:text-secondary transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-body-md text-on-surface-variant line-clamp-2 mt-xs">
                            {post.excerpt}
                          </p>
                        </Link>
                      </div>

                      {post.coverImage && (
                        <Link href={`/blog/${post.slug}`} className="shrink-0">
                          <div className="w-[110px] h-[75px] sm:w-[130px] sm:h-[85px] relative overflow-hidden bg-surface-container rounded">
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        </Link>
                      )}
                    </div>

                    {/* Bottom row */}
                    <div className="flex items-center justify-between text-label-sm text-on-surface-variant/70">
                      <div className="flex items-center gap-sm">
                        <span className="bg-surface-container-high text-on-surface-variant px-sm py-0.5 rounded-full text-[11px] font-semibold uppercase">
                          {post.category}
                        </span>
                        <span>{post.readingTime}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
