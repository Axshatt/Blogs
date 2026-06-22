'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const SOCIAL_LINKS = [
  { href: 'https://github.com', label: 'Github' },
  { href: 'https://x.com', label: 'X / Twitter' },
  { href: 'https://www.instagram.com/code.akshat.in/', label: 'Instagram' },
  { href: 'https://linkedin.com', label: 'LinkedIn' },
  { href: 'mailto:hello@akshatcodes.dev', label: 'Email' },
];

export function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed.');
      }

      setStatus('success');
      setMessage(data.message || 'Confirmation sent!');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Error occurred.');
    }
  };

  return (
    <footer className="border-t border-outline-variant px-margin-mobile py-xl md:px-margin-desktop">
      {/* Conditionally render mini newsletter if NOT on base route (/) and NOT on admin routes */}
      {pathname !== '/' && !pathname.startsWith('/admin') && (
        <div className="mb-lg pb-lg border-b border-outline-variant/30 flex flex-col md:flex-row md:items-center md:justify-between gap-md">
          <div className="flex flex-col font-inter">
            <h4 className="text-[18px] md:text-[20px] font-bold uppercase tracking-tight text-primary">
              Sign up for our newsletter.
            </h4>
            <p className="text-[12px] uppercase text-on-surface-variant mt-[2px]">
              Sent every Saturday morning.
            </p>
          </div>
          <div className="flex flex-col gap-xs w-full md:w-[320px]">
            <form
              className="flex items-center w-full bg-surface rounded-full p-[3px] pl-md border border-outline-variant/30"
              onSubmit={handleSubmit}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@company.com"
                disabled={status === 'loading'}
                required
                className="w-full bg-transparent border-none outline-none text-primary placeholder:text-outline-variant/70 text-[14px] focus:ring-0 py-[2px] disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-[32px] h-[32px] rounded-full bg-secondary-container flex items-center justify-center shrink-0 hover:bg-secondary-fixed transition-colors duration-200 cursor-pointer disabled:bg-surface-container disabled:cursor-not-allowed"
                aria-label="Subscribe"
              >
                {status === 'loading' ? (
                  <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span className="material-symbols-outlined text-primary font-bold !text-[18px]">
                    chevron_right
                  </span>
                )}
              </button>
            </form>
            {status === 'success' && (
              <p className="text-[11px] text-[#566500] font-semibold pl-xs animate-fade-in">{message}</p>
            )}
            {status === 'error' && (
              <p className="text-[11px] text-error font-semibold pl-xs animate-fade-in">{message}</p>
            )}
          </div>
        </div>
      )}

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
