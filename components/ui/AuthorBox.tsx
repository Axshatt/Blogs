'use client';

import { useState } from 'react';
import Image from 'next/image';

export function AuthorBox() {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(1240);
  const [showSubscribeForm, setShowSubscribeForm] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
    } else {
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
    }
  };

  const handleSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSubmitting(true);
    // Simulate API request
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1000);
  };

  const formattedFollowers = followersCount >= 1000 
    ? `${(followersCount / 1000).toFixed(1)}K` 
    : followersCount;

  return (
    <div className="bg-transparent border-t border-b border-outline-variant/25 py-xl my-xl font-sans text-primary relative overflow-hidden transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-lg items-start relative z-10">
        {/* Avatar */}
        <div className="shrink-0 relative w-20 h-20 md:w-24 md:h-24">
          <Image
            src="/images/akshat_profile.png"
            alt="Akshat Singh"
            fill
            className="rounded-full object-cover border border-outline-variant/30 transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-xs">
            <div>
              <div className="flex items-center gap-xs">
                <h3 className="text-[20px] font-extrabold tracking-tight text-primary">
                  Written by Akshat Singh
                </h3>
                {/* Verified scalloped badge */}
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-secondary fill-current shrink-0" aria-label="Verified Author">
                  <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.7l-3.6.81.34 3.7L1 12l2.44 2.79-.34 3.69 3.61.82 1.89 3.2 3.4-1.46 3.4 1.46 1.89-3.2 3.61-.82-.34-3.69L23 12zm-13 5l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
              </div>
              <div className="text-label-sm text-on-surface-variant/80 mt-1 uppercase font-semibold">
                {formattedFollowers} followers · 182 following
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-sm mt-xs md:mt-0">
              <button
                onClick={handleFollowToggle}
                className={`px-lg py-2 rounded-full text-label-bold uppercase tracking-wider transition-all duration-300 border text-[13px] cursor-pointer ${
                  isFollowing
                    ? 'border-outline-variant bg-transparent text-on-surface-variant hover:bg-surface-container-low'
                    : 'border-primary bg-primary text-on-primary hover:bg-on-surface-variant'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>
              <button
                onClick={() => setShowSubscribeForm(!showSubscribeForm)}
                className={`w-[40px] h-[40px] rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  showSubscribeForm
                    ? 'border-primary bg-primary text-on-primary'
                    : 'border-outline-variant bg-white text-primary hover:bg-surface-container-low'
                }`}
                aria-label="Subscribe to mailing list"
              >
                <span className="material-symbols-outlined !text-[20px]">
                  {showSubscribeForm ? 'close' : 'mail'}
                </span>
              </button>
            </div>
          </div>

          {/* Bio Text */}
          <p className="text-body-md text-on-surface-variant leading-relaxed mt-sm max-w-2xl">
            Developer, AI content creator, and agency owner building in public. Founder @{' '}
            <a href="https://akshatcodes.dev" className="text-secondary hover:underline font-semibold" target="_blank" rel="noopener noreferrer">
              AkshatCodes
            </a>
            . Writing about AI automation, web dev, and indie gaming.
          </p>

          {/* Interactive Subscribe Section */}
          <div 
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showSubscribeForm ? 'max-h-[200px] opacity-100 mt-lg pt-lg border-t border-outline-variant/30' : 'max-h-0 opacity-0'
            }`}
          >
            {isSubscribed ? (
              <div className="flex items-center gap-sm text-secondary font-bold text-body-md">
                <span className="material-symbols-outlined !text-[24px]">check_circle</span>
                <span>Subscribed! Thank you for following Akshat&apos;s journey.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribeSubmit} className="flex flex-col gap-sm max-w-md w-full font-inter">
                <label htmlFor="sub-email" className="text-label-sm leading-normal text-on-surface-variant font-bold uppercase">
                  Get an email whenever Akshat publishes
                </label>
                <div className="flex items-center bg-surface-container-low border border-outline-variant rounded-full p-[3px] pl-md focus-within:border-primary transition-all duration-200 w-full">
                  <input
                    id="sub-email"
                    type="email"
                    required
                    placeholder="email@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isSubmitting}
                    className="flex-1 min-w-0 bg-transparent border-none outline-none text-primary placeholder:text-outline-variant/80 text-[14px] focus:ring-0 py-[2px] disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-md py-sm bg-primary hover:bg-on-surface-variant text-on-primary rounded-full transition-colors text-label-bold uppercase text-[12px] tracking-wide shrink-0 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
