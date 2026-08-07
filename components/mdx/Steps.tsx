import type { ReactNode } from 'react';

interface StepsProps {
  children: ReactNode;
  className?: string;
}

export function Steps({ children, className = '' }: StepsProps) {
  return (
    <div
      className={`my-lg ml-4 border-l-2 border-outline-variant pl-6 [counter-reset:step] [&>h3]:step [&>h3]:relative [&>h3]:before:absolute [&>h3]:before:-left-[2.15rem] [&>h3]:before:top-1 [&>h3]:before:flex [&>h3]:before:h-7 [&>h3]:before:w-7 [&>h3]:before:items-center [&>h3]:before:justify-center [&>h3]:before:rounded-full [&>h3]:before:border [&>h3]:before:border-outline-variant [&>h3]:before:bg-surface-container-high [&>h3]:before:font-mono [&>h3]:before:text-xs [&>h3]:before:font-bold [&>h3]:before:text-primary [&>h3]:before:content-[counter(step)] [&>h3]:before:[counter-increment:step] ${className}`}
    >
      {children}
    </div>
  );
}

interface StepProps {
  children: ReactNode;
  title?: string;
  className?: string;
}

export function Step({ children, title, className = '' }: StepProps) {
  return (
    <div className={`relative mb-8 last:mb-0 ${className}`}>
      {title && (
        <h3 className="mb-2 text-headline-sm font-bold text-primary">
          {title}
        </h3>
      )}
      <div className="text-body-md text-on-surface-variant [&>p]:mb-3">{children}</div>
    </div>
  );
}
