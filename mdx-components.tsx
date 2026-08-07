import type { MDXComponents } from 'mdx/types';
import { CodeBlock } from '@/components/mdx/CodeBlock';
import { Callout } from '@/components/mdx/Callout';
import { Steps, Step } from '@/components/mdx/Steps';
import { SafeImage } from '@/components/ui/SafeImage';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    // Override default HTML elements for editorial theme
    img: ({ src, alt }) => {
      if (!src) return null;
      return (
        <span className="block my-lg relative w-full aspect-[16/10] overflow-hidden rounded border border-outline-variant/20 bg-surface-container">
          <SafeImage
            src={src}
            alt={alt || ''}
            fill
            sizes="(max-width: 768px) calc(100vw - 32px), 768px"
            className="object-cover"
          />
        </span>
      );
    },
    h1: ({ children }) => (
      <h1 className="text-headline-xl mb-md mt-xl tracking-tight text-primary first:mt-0">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-headline-lg mb-sm mt-xl text-primary">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-sm mt-lg text-[20px] font-bold text-primary">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="text-body-lg mb-md text-on-surface-variant">{children}</p>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-secondary underline decoration-secondary/30 underline-offset-2 transition-colors hover:text-primary hover:decoration-primary/50"
        target={href?.startsWith('http') ? '_blank' : undefined}
        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
      >
        {children}
      </a>
    ),
    ul: ({ children }) => (
      <ul className="text-body-md mb-md ml-md list-disc space-y-xs text-on-surface-variant marker:text-outline">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="text-body-md mb-md ml-md list-decimal space-y-xs text-on-surface-variant">
        {children}
      </ol>
    ),
    li: ({ children }) => <li className="leading-7">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="my-md border-l-2 border-primary pl-md italic text-on-surface-variant">
        {children}
      </blockquote>
    ),
    code: ({ children, className }) => {
      if (className) {
        return <CodeBlock className={className}>{children}</CodeBlock>;
      }
      return (
        <code className="rounded bg-surface-container px-1.5 py-0.5 font-mono text-[0.85em] text-primary">
          {children}
        </code>
      );
    },
    pre: ({ children }) => <>{children}</>,
    hr: () => <hr className="my-xl border-outline-variant" />,
    strong: ({ children }) => (
      <strong className="font-bold text-primary">{children}</strong>
    ),
    // Custom MDX components available in posts
    Callout,
    CodeBlock,
    Steps,
    Step,
  };
}
