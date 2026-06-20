import type { ReactNode } from 'react';
import Link from 'next/link';

interface HeroSectionProps {
  /** Pass JSX for rich formatting (italic, colored spans, etc.) */
  title: ReactNode;
  categories: { value: string; label: string; href: string }[];
}

export function HeroSection({ title, categories }: HeroSectionProps) {
  return (
    <header className="mb-xxl border-b border-outline-variant pb-xxl">
      <div className="flex flex-col gap-xl md:flex-row md:items-start md:justify-between">
        {/* Left: Large title */}
        <h1 className="font-inter text-[56px] md:text-[96px] font-black uppercase leading-[0.85] tracking-tighter max-w-[55%] shrink-0">
          {title}
        </h1>

        {/* Right: Category tag pills */}
        <div className="flex flex-wrap items-start justify-end gap-sm md:max-w-[40%]">
          {categories.map((cat) => (
            <Link
              key={cat.value}
              href={cat.href}
              className="text-label-bold rounded-full border border-primary px-lg py-sm uppercase transition-all duration-200 hover:bg-primary hover:text-on-primary"
            >
              {cat.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
