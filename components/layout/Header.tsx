'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Log' },
  { href: '/blog', label: 'Builds' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const lastScrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const nav = navRef.current;
      if (!nav) return;
      const currentScroll = window.pageYOffset;
      if (currentScroll > lastScrollRef.current && currentScroll > 100) {
        nav.style.transform = 'translateY(-100%)';
      } else {
        nav.style.transform = 'translateY(0)';
      }
      lastScrollRef.current = currentScroll;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-outline-variant bg-background px-margin-mobile py-md md:px-margin-desktop"
    >
      {/* Left: Hamburger + Brand Logo */}
      <div className="flex items-center gap-md">
        <button
          onClick={() => window.dispatchEvent(new Event('toggle-sidebar'))}
          className="flex items-center justify-center rounded-full p-sm transition-colors duration-200 ease-in-out hover:bg-surface-container cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <span className="material-symbols-outlined text-primary !text-[24px]">menu</span>
        </button>
        <Link
          href="/"
          className="text-headline-lg font-black tracking-tighter text-primary"
        >
          AKSHATCODES
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden items-center space-x-xl md:flex">
        <ul className="flex items-center space-x-lg">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-body-md uppercase tracking-widest transition-colors duration-200 ease-in-out ${
                    isActive
                      ? 'border-b-2 border-primary pb-1 text-primary'
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Theme Toggle (placeholder) */}
        <button
          className="flex items-center justify-center rounded-full p-sm transition-colors duration-200 ease-in-out hover:bg-surface-container"
          aria-label="Toggle theme"
        >
          <span className="material-symbols-outlined text-primary">
            dark_mode
          </span>
        </button>
      </div>
    </nav>
  );
}
