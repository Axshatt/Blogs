'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
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
    return () => window.removeEventListener('bookmarks-updated', loadBookmarkCount);
  }, []);


  const handleItemClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      onClose();
    }
  };

  const NAV_ITEMS = [
    {
      href: '/',
      label: 'Home',
      icon: 'home',
      isActive: pathname === '/',
    },
    {
      href: '/blog',
      label: 'Builds',
      icon: 'construction',
      isActive: pathname.startsWith('/blog'),
      mobileOnly: true,
    },
    {
      href: '/about',
      label: 'About',
      icon: 'person',
      isActive: pathname.startsWith('/about'),
      mobileOnly: true,
    },
    {
      href: '/library',
      label: 'Library',
      icon: 'bookmark',
      isActive: pathname === '/library',
      badge: bookmarkCount > 0 ? bookmarkCount : undefined,
    },
  ];

  return (
    <aside
      className={`fixed top-[57px] left-0 z-[45] md:z-30 h-[calc(100vh-57px)] w-[260px] bg-surface border-r border-outline-variant/20 transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* Navigation Items */}
      <nav className="flex-1 px-md py-xl">
        <ul className="space-y-xs">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className={item.mobileOnly ? 'md:hidden' : ''}>
              <Link
                href={item.href}
                onClick={handleItemClick}
                className={`flex items-center gap-md px-md py-sm rounded-lg transition-all duration-200 group ${item.isActive
                    ? 'bg-surface-container-high text-primary font-bold'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                  }`}
              >
                <span
                  className={`material-symbols-outlined !text-[22px] transition-colors ${item.isActive ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'
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
  );
}
