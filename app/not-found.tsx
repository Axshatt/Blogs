import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] py-xxl px-margin-mobile md:px-margin-desktop text-center font-inter flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center justify-center">
        {/* 404 Number */}
        <h1 className="text-[120px] md:text-[180px] font-black tracking-tighter text-primary leading-none select-none">
          404<span className="text-secondary">.</span>
        </h1>

        {/* Message */}
        <h2 className="mt-md text-[24px] md:text-[32px] font-bold text-primary tracking-tight uppercase leading-tight">
          Lost in the code
        </h2>
        <p className="mt-sm text-body-md text-on-surface-variant leading-relaxed">
          The page you are looking for has either been refactored, deleted, or never existed in this branch.
        </p>

        {/* Actions */}
        <div className="mt-xl flex flex-col sm:flex-row items-center gap-md w-full justify-center">
          <Link
            href="/"
            className="w-full sm:w-auto text-label-bold rounded-full bg-primary text-on-primary border border-primary px-xl py-md uppercase transition-all duration-300 hover:bg-secondary hover:text-on-secondary hover:border-secondary shadow-md hover:scale-105 active:scale-95 text-center cursor-pointer"
          >
            Return Home
          </Link>
          <Link
            href="/blog"
            className="w-full sm:w-auto text-label-bold rounded-full bg-transparent text-primary border border-primary px-xl py-md uppercase transition-all duration-300 hover:bg-primary hover:text-on-primary text-center cursor-pointer"
          >
            Browse Builds
          </Link>
        </div>
      </div>
    </div>
  );
}
