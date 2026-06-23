'use client';

import { useState } from 'react';
import { trackEvent } from '@/lib/analytics';

export function NewsletterSection() {
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
        throw new Error(data.error || 'Failed to subscribe.');
      }

      setStatus('success');
      setMessage(data.message || 'Verification email sent!');
      setEmail('');
      trackEvent('newsletter_signup', { success: true });
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong.');
    }
  };

  return (
    <section className="bg-surface-container border border-outline-variant p-lg md:p-xl my-xxl transition-all duration-300">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-lg max-w-5xl mx-auto py-md">
        {/* Left Side: Call to Action */}
        <div className="flex flex-col font-inter">
          <h3 className="text-[28px] md:text-[38px] font-black tracking-tighter text-primary leading-tight">
            Sign up for our newsletter.
          </h3>
          <p className="text-[14px] uppercase tracking-widest text-secondary font-extrabold mt-sm">
            Sent every Saturday morning.
          </p>
        </div>

        {/* Right Side: Email Form */}
        <div className="flex flex-col w-full md:w-[360px] lg:w-[420px] shrink-0 gap-sm font-inter">
          <span className="text-[12px] uppercase tracking-wider text-on-surface-variant font-bold pl-xs">
            Enter your email
          </span>
          
          <form
            className="flex items-center w-full bg-surface rounded-full p-[4px] pl-md border border-outline-variant focus-within:border-secondary focus-within:ring-1 focus-within:ring-secondary transition-all duration-200"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@company.com"
              disabled={status === 'loading'}
              required
              className="w-full h-[44px] bg-transparent border-none outline-none text-primary placeholder:text-outline/70 text-[16px] focus:ring-0 py-0 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-[44px] h-[44px] rounded-full bg-primary text-on-primary flex items-center justify-center shrink-0 hover:bg-secondary hover:text-on-secondary transition-all duration-300 cursor-pointer disabled:bg-surface-container disabled:cursor-not-allowed shadow-sm hover:scale-105 active:scale-95"
              aria-label="Subscribe"
            >
              {status === 'loading' ? (
                <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <svg
                  className="w-[20px] h-[20px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              )}
            </button>
          </form>

          {/* Feedback messages */}
          {status === 'success' && (
            <p className="text-body-sm text-secondary pl-xs font-semibold animate-fade-in">
              {message}
            </p>
          )}
          {status === 'error' && (
            <p className="text-body-sm text-error pl-xs font-semibold animate-fade-in">
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
