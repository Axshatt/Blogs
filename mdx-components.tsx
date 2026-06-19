import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { Callout } from '@/components/mdx/Callout';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Override default HTML elements
    h1: ({ children }) => (
      <h1 className="mb-4 mt-10 text-3xl font-bold tracking-tight text-zinc-100 first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-3 mt-8 text-xl font-semibold text-zinc-100">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-2 mt-6 text-lg font-semibold text-zinc-200">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="mb-4 leading-7 text-zinc-400">{children}</p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-violet-400 underline decoration-violet-400/30 underline-offset-2 transition-colors hover:text-violet-300 hover:decoration-violet-300/50"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="mb-4 ml-4 list-disc space-y-1 text-zinc-400 marker:text-zinc-600">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mb-4 ml-4 list-decimal space-y-1 text-zinc-400">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-7">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="my-4 border-l-2 border-violet-500/40 pl-4 text-zinc-500 italic">
        {children}
      </blockquote>
    ),
    code: ({ children, className }) => {
      if (className) {
        return <CodeBlock className={className}>{children}</CodeBlock>;
      }
      return (
        <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[0.85em] text-violet-300">
          {children}
        </code>
      );
    },
    pre: ({ children }) => <>{children}</>,
    hr: () => <hr className="my-8 border-white/5" />,
    strong: ({ children }) => (
      <strong className="font-semibold text-zinc-200">{children}</strong>
    ),
    // Custom MDX components available in posts
    Callout,
    CodeBlock,
  };
}
