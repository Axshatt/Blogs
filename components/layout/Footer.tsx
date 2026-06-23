'use client';

import Link from 'next/link';

const SOCIAL_LINKS = [
  { href: 'https://github.com', label: 'Github' },
  { href: 'https://x.com', label: 'X / Twitter' },
  { href: 'https://www.instagram.com/code.akshat.in/', label: 'Instagram' },
  { href: 'https://linkedin.com', label: 'LinkedIn' },
  { href: 'mailto:hello@akshatcodes.dev', label: 'Email' },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-outline-variant px-margin-mobile py-xl md:px-margin-desktop">
      <div className="flex flex-col items-start justify-between space-y-lg md:flex-row md:items-center md:space-y-0">
        {/* Brand */}
        <div className="text-[24px] font-black tracking-tighter text-primary">
          AKSHATCODES © {year}
        </div>

        {/* Social Links */}
        <div className="flex flex-wrap gap-xl">
          {SOCIAL_LINKS.map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-label-bold uppercase transition-colors hover:text-secondary"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Tagline */}
        <div className="text-label-sm uppercase text-on-surface-variant">
          Designed with discipline.
        </div>
      </div>
    </footer>
  );
}
