import type { ReactNode } from 'react';

interface CodeBlockProps {
  children: ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const lang = className?.replace('language-', '') ?? '';
  return (
    <div className="group relative my-6 overflow-hidden rounded-lg border border-white/5 bg-zinc-900">
      {lang && (
        <div className="flex items-center justify-between border-b border-white/5 bg-white/[0.02] px-4 py-2">
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
            {lang}
          </span>
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
          </div>
        </div>
      )}
      <pre className="overflow-x-auto p-5 text-sm leading-relaxed">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}
