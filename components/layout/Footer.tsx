import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <p className="font-mono text-xs text-zinc-600">
          © {year} Dev &amp; AI Blog — built with Next.js + MDX
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="/blog"
            className="font-mono text-xs text-zinc-600 transition-colors hover:text-zinc-400"
          >
            /blog
          </Link>
          <Link
            href="/rss.xml"
            className="font-mono text-xs text-zinc-600 transition-colors hover:text-zinc-400"
          >
            /rss
          </Link>
          <Link
            href="/about"
            className="font-mono text-xs text-zinc-600 transition-colors hover:text-zinc-400"
          >
            /about
          </Link>
        </div>
      </div>
    </footer>
  );
}
