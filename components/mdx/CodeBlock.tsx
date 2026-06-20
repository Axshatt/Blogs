import type { ReactNode } from 'react';

interface CodeBlockProps {
  children: ReactNode;
  className?: string;
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const lang = className?.replace('language-', '') ?? '';
  return (
    <div className="group relative my-lg overflow-hidden rounded-lg border border-outline-variant bg-surface-container-highest">
      {lang && (
        <div className="flex items-center justify-between border-b border-outline-variant bg-surface-container px-lg py-sm">
          <span className="text-label-sm uppercase tracking-widest text-on-surface-variant">
            {lang}
          </span>
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-outline-variant" />
            <span className="h-2.5 w-2.5 rounded-full bg-outline-variant" />
            <span className="h-2.5 w-2.5 rounded-full bg-outline-variant" />
          </div>
        </div>
      )}
      <pre className="overflow-x-auto p-lg text-sm leading-relaxed">
        <code className={className}>{children}</code>
      </pre>
    </div>
  );
}
