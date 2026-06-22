import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - AkshatCodes',
  description: "Building in Public. Learning Out Loud. Hey, I'm Akshat — a full-stack dev, AI tinkerer, and relentless builder.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-margin-mobile py-xxl md:px-margin-desktop font-sans">
      <div className="text-label-sm mb-sm uppercase text-on-surface-variant font-inter">
        /about
      </div>
      <h1 className="text-headline-xl mb-lg tracking-tight text-primary md:text-[44px] md:leading-[1.1] font-black">
        Building in Public. Learning Out Loud.
      </h1>

      <div className="text-body-lg space-y-md leading-relaxed text-on-surface-variant font-inter font-normal">
        <p>
          Hey, I&apos;m Akshat — a full-stack dev, AI tinkerer, and relentless builder who documents every step of the journey.
        </p>
        <p>
          With 35K+ followers across platforms, I share what I learn in real-time — from hackathons and side projects to design breakdowns and the latest in tech. No gatekeeping, just raw progress.
        </p>
        <p>
          This blog is for the curious ones just getting started — covering dev tutorials, design insights, and what&apos;s actually happening in the AI + tech world right now.
        </p>
        <p>
          If you&apos;re building, learning, or just exploring — you&apos;re in the right place.
        </p>
      </div>

      {/* Social Links Section */}
      <div className="mt-xl border-t border-outline-variant/20 pt-lg font-sans">
        <h3 className="text-label-bold uppercase text-primary mb-md font-bold">
          Connect with me
        </h3>
        <div className="flex items-center gap-md">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border border-outline-variant bg-white text-primary hover:bg-surface-container-low hover:text-secondary transition-all duration-300 flex items-center justify-center cursor-pointer"
            title="GitHub"
          >
            <span className="material-symbols-outlined !text-[24px]">code</span>
          </a>
          <a
            href="https://x.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border border-outline-variant bg-white text-primary hover:bg-surface-container-low hover:text-secondary transition-all duration-300 flex items-center justify-center cursor-pointer"
            title="X / Twitter"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a
            href="https://www.instagram.com/code.akshat.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border border-outline-variant bg-white text-primary hover:bg-surface-container-low hover:text-secondary transition-all duration-300 flex items-center justify-center cursor-pointer"
            title="Instagram"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border border-outline-variant bg-white text-primary hover:bg-surface-container-low hover:text-secondary transition-all duration-300 flex items-center justify-center cursor-pointer"
            title="LinkedIn"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
            </svg>
          </a>
          <a
            href="mailto:hello@akshatcodes.dev"
            className="w-12 h-12 rounded-full border border-outline-variant bg-white text-primary hover:bg-surface-container-low hover:text-secondary transition-all duration-300 flex items-center justify-center cursor-pointer"
            title="Email"
          >
            <span className="material-symbols-outlined !text-[24px]">mail</span>
          </a>
        </div>
      </div>
    </div>
  );
}
