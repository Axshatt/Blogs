'use client';

import Image from 'next/image';

export function AuthorBox() {
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
                {/* Verified badge */}
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-secondary fill-current shrink-0" aria-label="Verified Author">
                  <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.7l-3.6.81.34 3.7L1 12l2.44 2.79-.34 3.69 3.61.82 1.89 3.2 3.4-1.46 3.4 1.46 1.89-3.2 3.61-.82-.34-3.69L23 12zm-13 5l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
                </svg>
              </div>
              <div className="text-label-sm text-on-surface-variant/80 mt-1 uppercase font-semibold">
                35K+ followers
              </div>
            </div>

            {/* Social Links Buttons */}
            <div className="flex items-center gap-sm mt-xs md:mt-0">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-outline-variant bg-white text-primary hover:bg-surface-container-low transition-all duration-300 flex items-center justify-center cursor-pointer"
                title="GitHub"
              >
                <span className="material-symbols-outlined !text-[20px]">code</span>
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-outline-variant bg-white text-primary hover:bg-surface-container-low transition-all duration-300 flex items-center justify-center cursor-pointer"
                title="X / Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-outline-variant bg-white text-primary hover:bg-surface-container-low transition-all duration-300 flex items-center justify-center cursor-pointer"
                title="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Bio Text */}
          <p className="text-body-md text-on-surface-variant leading-relaxed mt-sm max-w-2xl">
            Hey, I&apos;m Akshat — a full-stack dev, AI tinkerer, and relentless builder who documents every step of the journey. I share what I learn in real-time — dev tutorials, design insights, and AI + tech news.
          </p>
        </div>
      </div>
    </div>
  );
}
