'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '/', label: 'Log' },
  { href: '/blog', label: 'Builds' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-outline-variant bg-background px-md py-md"
    >
      {/* Left: Hamburger + Brand Logo */}
      <div className="flex items-center gap-md">
        <button
          onClick={() => window.dispatchEvent(new Event('toggle-sidebar'))}
          className="flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200 ease-in-out hover:bg-surface-container active:bg-surface-container-high cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <span className="material-symbols-outlined text-primary !text-[24px]">menu</span>
        </button>
        <Link
          href="/"
          className="text-headline-lg font-black tracking-tighter text-primary"
        >
          AkshatCodes
        </Link>
      </div>

      {/* Right side navigation & controls */}
      <div className="flex items-center gap-md">
        {/* Desktop Navigation */}
        <ul className="hidden items-center space-x-lg md:flex">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`text-body-md font-medium tracking-wide transition-colors duration-200 ease-in-out ${isActive
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

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center rounded-full p-sm transition-colors duration-200 ease-in-out hover:bg-surface-container active:bg-surface-container-high cursor-pointer"
          aria-label="Toggle theme"
        >
          <span className="material-symbols-outlined text-primary">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>
      </div>
    </nav>
  );
}
