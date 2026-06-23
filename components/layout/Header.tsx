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
        <div className="relative group flex items-center justify-center">
          <button
            onClick={() => window.dispatchEvent(new Event('toggle-sidebar'))}
            className="flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200 ease-in-out hover:bg-surface-container active:bg-surface-container-high cursor-pointer"
            aria-label="Toggle sidebar"
          >
            <span className="material-symbols-outlined text-primary !text-[24px] leading-none">menu</span>
          </button>
          
          {/* Tooltip */}
          <div className="pointer-events-none absolute top-full mt-2 left-1/2 -translate-x-1/2 hidden md:group-hover:flex flex-col items-center z-50 animate-fade-in">
            <div className="w-2 h-2 bg-[#191919] rotate-45 -mb-[4px] z-10" />
            <div className="bg-[#191919] text-white text-[12px] font-medium px-[10px] py-[6px] rounded-lg whitespace-nowrap shadow-md">
              Menu
            </div>
          </div>
        </div>

        <Link
          href="/"
          className="text-headline-lg font-black tracking-tighter text-primary flex items-center leading-none"
        >
          AkshatCodes
        </Link>
      </div>

      {/* Right side navigation & controls */}
      <div className="flex items-center gap-md">
        {/* Desktop Navigation */}
        <ul className="hidden items-center space-x-lg md:flex h-11">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive =
              href === '/' ? pathname === '/' : pathname.startsWith(href);
            return (
              <li key={href} className="flex items-center h-full">
                <Link
                  href={href}
                  className={`text-body-md font-medium tracking-wide transition-colors duration-200 ease-in-out border-b-2 pb-1 ${isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-on-surface-variant hover:text-primary'
                    }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Theme Toggle */}
        <div className="relative group flex items-center justify-center">
          <button
            onClick={toggleTheme}
            className="flex h-11 w-11 items-center justify-center rounded-full transition-colors duration-200 ease-in-out hover:bg-surface-container active:bg-surface-container-high cursor-pointer"
            aria-label="Toggle theme"
          >
            <span className="material-symbols-outlined text-primary !text-[24px] leading-none">
              {theme === 'dark' ? 'light_mode' : 'dark_mode'}
            </span>
          </button>

          {/* Tooltip */}
          <div className="pointer-events-none absolute top-full mt-2 left-1/2 -translate-x-1/2 hidden md:group-hover:flex flex-col items-center z-50 animate-fade-in">
            <div className="w-2 h-2 bg-[#191919] rotate-45 -mb-[4px] z-10" />
            <div className="bg-[#191919] text-white text-[12px] font-medium px-[10px] py-[6px] rounded-lg whitespace-nowrap shadow-md">
              {theme === 'dark' ? 'Use light theme' : 'Use dark theme'}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
