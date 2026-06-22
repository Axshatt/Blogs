'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to unsubscribe.');
      }

      setStatus('success');
      setMessage(data.message);
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'An error occurred.');
    }
  };

  return (
    <div className="w-full max-w-md bg-surface border border-outline-variant/35 rounded-lg p-lg md:p-xl shadow-sm text-center">
      <h1 className="text-headline-lg font-black tracking-tighter text-primary mb-sm">
        Unsubscribe
      </h1>
      
      {status === 'success' ? (
        <div className="space-y-md">
          <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mx-auto">
            <span className="material-symbols-outlined !text-[28px]">done</span>
          </div>
          <p className="text-body-md text-on-surface-variant leading-relaxed">
            {message}
          </p>
          <div className="pt-md">
            <Link
              href="/"
              className="text-label-bold uppercase border-b border-primary hover:text-secondary hover:border-secondary transition-colors"
            >
              Go to Home
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-md">
          <p className="text-body-md text-on-surface-variant mb-md">
            We are sorry to see you go. Confirm your email address below to unsubscribe from our weekly newsletter.
          </p>
          
          <div className="text-left space-y-xs">
            <label htmlFor="email" className="text-label-sm font-semibold text-on-surface-variant uppercase">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-md px-md py-sm text-body-md text-primary focus:outline-none focus:border-primary focus:ring-0"
            />
          </div>

          {status === 'error' && (
            <p className="text-body-md text-error font-medium">{message}</p>
          )}

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full bg-primary text-on-primary hover:bg-primary/90 text-label-bold uppercase py-sm rounded-md transition-colors duration-200 cursor-pointer flex items-center justify-center"
          >
            {status === 'loading' ? (
              <span className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></span>
            ) : (
              'Confirm Unsubscribe'
            )}
          </button>

          <div className="pt-sm">
            <Link
              href="/"
              className="text-label-sm uppercase text-on-surface-variant/80 hover:text-primary transition-colors"
            >
              Nevermind, take me back
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-md py-xxl bg-background">
      <Suspense fallback={
        <div className="flex justify-center items-center h-[200px]">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <UnsubscribeForm />
      </Suspense>
    </div>
  );
}
