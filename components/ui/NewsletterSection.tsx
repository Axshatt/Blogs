'use client';

import { useState } from 'react';

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
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Something went wrong.');
    }
  };

  return (
    <section className="bg-[#1c1c1a] border border-outline-variant/30 p-lg md:p-xl my-xxl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-lg max-w-5xl mx-auto py-md">
        {/* Left Side: Call to Action */}
        <div className="flex flex-col font-inter">
          <h3 className="text-[28px] md:text-[38px] font-bold tracking-tight text-secondary-container leading-tight">
            Sign up for our newsletter.
          </h3>
          <p className="text-[28px] md:text-[38px] font-bold tracking-tight text-white leading-tight mt-xs md:mt-0">
            Sent every Saturday morning.
          </p>
        </div>

        {/* Right Side: Email Form */}
        <div className="flex flex-col w-full md:w-[360px] lg:w-[420px] shrink-0 gap-sm font-inter">
          <span className="text-[14px] text-white/70 pl-xs">Enter your email</span>
          
          <form
            className="flex items-center w-full bg-surface rounded-full p-[4px] pl-md border border-outline-variant"
            onSubmit={handleSubmit}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@company.com"
              disabled={status === 'loading'}
              required
              className="w-full bg-transparent border-none outline-none text-primary placeholder:text-outline-variant/80 text-[16px] md:text-[18px] focus:ring-0 py-xs disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-[44px] h-[44px] rounded-full bg-secondary-container flex items-center justify-center shrink-0 hover:bg-secondary-fixed transition-colors duration-200 cursor-pointer disabled:bg-surface-container disabled:cursor-not-allowed"
              aria-label="Subscribe"
            >
              {status === 'loading' ? (
                <span className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span className="material-symbols-outlined text-primary font-bold !text-[24px]">
                  chevron_right
                </span>
              )}
            </button>
          </form>

          {/* Feedback messages */}
          {status === 'success' && (
            <p className="text-body-sm text-secondary-container pl-xs font-semibold animate-fade-in">
              {message}
            </p>
          )}
          {status === 'error' && (
            <p className="text-body-sm text-error-container pl-xs font-semibold animate-fade-in">
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
