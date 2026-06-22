'use client';

import { useState, useEffect, useRef } from 'react';
import { getLibraryLists, createNewList, togglePostInList, type LibraryList } from '@/lib/library';

interface BookmarkPopoverProps {
  slug: string;
  onClose: () => void;
  onStateChange: () => void;
}

export function BookmarkPopover({ slug, onClose, onStateChange }: BookmarkPopoverProps) {
  const [lists, setLists] = useState<LibraryList[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newListName, setNewListName] = useState('');
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLists(getLibraryLists());

    // Handle clicks outside of popover to close it
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleToggle = (listName: string) => {
    togglePostInList(listName, slug);
    setLists(getLibraryLists());
    onStateChange();
  };

  const handleCreateList = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;

    const updated = createNewList(newListName.trim(), true);
    setLists(updated);
    
    // Automatically add current post to the newly created list
    togglePostInList(newListName.trim(), slug);
    setLists(getLibraryLists());

    setNewListName('');
    setIsCreating(false);
    onStateChange();
  };

  return (
    <div
      ref={popoverRef}
      className="absolute bottom-full right-0 mb-sm z-50 w-[280px] bg-surface border border-outline-variant/30 rounded-lg shadow-xl py-md text-primary font-sans animate-fade-in"
    >
      {/* Small triangle arrow */}
      <div className="absolute top-full right-3 -mt-[1px] w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-surface" />
      <div className="absolute top-full right-3 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-outline-variant/30 -z-10" />

      {/* List items */}
      <div className="max-h-[180px] overflow-y-auto px-md space-y-sm">
        {lists.map((list) => {
          const isChecked = list.slugs.includes(slug);
          return (
            <label
              key={list.name}
              className="flex items-center justify-between py-xs hover:bg-surface-container-lowest rounded px-xs cursor-pointer select-none"
            >
              <div className="flex items-center gap-sm">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleToggle(list.name)}
                  className="w-4.5 h-4.5 accent-[#1a8917] rounded cursor-pointer border-outline-variant"
                />
                <span className="text-body-md font-medium text-on-surface">{list.name}</span>
              </div>
              {list.isPrivate && (
                <span className="material-symbols-outlined !text-[16px] text-on-surface-variant/70">
                  lock
                </span>
              )}
            </label>
          );
        })}
      </div>

      <hr className="my-sm border-outline-variant/20" />

      {/* Create list section */}
      <div className="px-lg">
        {!isCreating ? (
          <button
            onClick={() => setIsCreating(true)}
            className="text-[14px] font-medium text-[#1a8917] hover:text-green-800 transition-colors cursor-pointer"
          >
            Create new list
          </button>
        ) : (
          <form onSubmit={handleCreateList} className="space-y-sm">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Name your list..."
              autoFocus
              className="w-full text-body-md border border-outline-variant/50 rounded px-sm py-xs focus:border-[#1a8917] focus:outline-none bg-surface-container-lowest"
            />
            <div className="flex justify-end gap-sm">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-label-sm text-on-surface-variant hover:text-primary cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="text-label-sm text-[#1a8917] font-bold hover:text-green-800 cursor-pointer"
              >
                Create
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
