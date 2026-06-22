'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SideDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const pathname = usePathname();

  const loadBookmarkCount = () => {
    const saved = localStorage.getItem('bookmarked_posts');
    if (saved) {
      try {
        const list = JSON.parse(saved) as string[];
        setBookmarkCount(list.length);
      } catch {
        setBookmarkCount(0);
      }
    } else {
      setBookmarkCount(0);
    }
  };

  useEffect(() => {
    loadBookmarkCount();
    window.addEventListener('bookmarks-updated', loadBookmarkCount);

    // Listen for toggle events from the Header hamburger icon
    const handleToggle = () => setIsOpen((prev) => !prev);
    window.addEventListener('toggle-sidebar', handleToggle);

    return () => {
      window.removeEventListener('bookmarks-updated', loadBookmarkCount);
      window.removeEventListener('toggle-sidebar', handleToggle);
    };
  }, []);

  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const NAV_ITEMS = [
    {
      href: '/',
      label: 'Home',
      icon: 'home',
      isActive: pathname === '/',
    },
    {
      href: '/blog',
      label: 'Reading List',
      icon: 'bookmark',
      isActive: pathname === '/blog',
      badge: bookmarkCount > 0 ? bookmarkCount : undefined,
    },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer Panel — slides in from LEFT */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-[260px] bg-surface border-r border-outline-variant/30 shadow-xl transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant/20">
          <span className="text-[20px] font-black tracking-tighter text-primary">
            AKSHATCODES
          </span>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors cursor-pointer"
            aria-label="Close sidebar"
          >
            <span className="material-symbols-outlined !text-[20px] text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-md py-xl">
          <ul className="space-y-xs">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-md px-md py-sm rounded-lg transition-all duration-200 group ${
                    item.isActive
                      ? 'bg-surface-container-high text-primary font-bold'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined !text-[22px] transition-colors ${
                      item.isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'
                    }`}
                    style={item.isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                  >
                    {item.icon}
                  </span>
                  <span className="text-body-md">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="ml-auto text-[11px] font-bold bg-secondary-container text-on-secondary-container rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Drawer Footer */}
        <div className="px-lg py-md border-t border-outline-variant/15 text-[11px] text-on-surface-variant/50 uppercase font-semibold">
          Designed with discipline.
        </div>
      </aside>
    </>
  );
}
