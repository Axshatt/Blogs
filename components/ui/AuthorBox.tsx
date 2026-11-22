'use client';

import Image from 'next/image';

export function AuthorBox() {
  return (
    <div className="bg-transparent border-t border-b border-outline-variant/25 py-xl my-xl font-sans text-primary relative overflow-hidden transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-lg items-start relative z-10">
        {/* Avatar */}
        <div className="shrink-0 relative w-20 h-20 md:w-24 md:h-24">
          <Image
            src={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/images/akshat_profile.jpg`}
            alt="Akshat Singh"
            fill
            sizes="(max-width: 768px) 80px, 96px"
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
                href="https://github.com/Axshatt"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-outline-variant bg-surface text-primary hover:bg-surface-container-low transition-all duration-300 flex items-center justify-center cursor-pointer"
                title="GitHub"
              >
                <span className="material-symbols-outlined !text-[20px]">code</span>
              </a>
              <a
                href="https://x.com/axshattt"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-outline-variant bg-surface text-primary hover:bg-surface-container-low transition-all duration-300 flex items-center justify-center cursor-pointer"
                title="X / Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/code.akshat.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-outline-variant bg-surface text-primary hover:bg-surface-container-low transition-all duration-300 flex items-center justify-center cursor-pointer"
                title="Instagram"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/in/axshattt/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-outline-variant bg-surface text-primary hover:bg-surface-container-low transition-all duration-300 flex items-center justify-center cursor-pointer"
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
