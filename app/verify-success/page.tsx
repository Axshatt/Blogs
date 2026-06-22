'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifySuccessContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');

  let title = 'Verify Subscription';
  let message = 'Verifying your email subscription...';
  let isSuccess = false;
  let icon = 'sync';

  if (status === 'verified') {
    title = 'Subscription Confirmed!';
    message = "You're all set! Your email is verified and you are officially subscribed to the AkshatCodes newsletter. Look out for our weekly issue in your inbox every Saturday morning.";
    isSuccess = true;
    icon = 'verified';
  } else if (status === 'expired') {
    title = 'Verification Expired';
    message = 'This confirmation link has expired. Verification links are only valid for 24 hours. Please try subscribing again from the homepage.';
    icon = 'schedule';
  } else if (status === 'not-found' || status === 'invalid') {
    title = 'Link Invalid';
    message = 'We could not find a subscriber matching this verification token. The link may be broken or already used. Please check your email or try signing up again.';
    icon = 'error';
  } else if (status === 'error') {
    title = 'Verification Error';
    message = 'An unexpected error occurred during verification. Please try again later or sign up again.';
    icon = 'warning';
  }

  return (
    <div className="w-full max-w-md bg-surface border border-outline-variant/35 rounded-lg p-lg md:p-xl shadow-sm text-center">
      <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-lg ${
        isSuccess 
          ? 'bg-secondary-container text-on-secondary-container' 
          : 'bg-error-container text-on-error-container'
      }`}>
        <span className="material-symbols-outlined !text-[32px]">{icon}</span>
      </div>

      <h1 className="text-headline-lg font-black tracking-tighter text-primary mb-md">
        {title}
      </h1>

      <p className="text-body-md text-on-surface-variant leading-relaxed mb-xl">
        {message}
      </p>

      <div className="pt-md">
        <Link
          href="/"
          className="text-label-bold uppercase border-b border-primary hover:text-secondary hover:border-secondary transition-colors"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

export default function VerifySuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-md py-xxl bg-background">
      <Suspense fallback={
        <div className="flex justify-center items-center h-[200px]">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <VerifySuccessContent />
      </Suspense>
    </div>
  );
}
