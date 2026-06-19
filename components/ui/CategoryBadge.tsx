import type { Category } from '@/types/post';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

const CATEGORY_STYLES: Record<Category, string> = {
  'build-log': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  tutorial: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  experiment: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
};

const CATEGORY_LABELS: Record<Category, string> = {
  'build-log': 'Build Log',
  tutorial: 'Tutorial',
  experiment: 'Experiment',
};

export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const baseClasses = 'inline-flex items-center border font-mono font-medium tracking-wider uppercase rounded';
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs';
  return (
    <span className={`${baseClasses} ${sizeClasses} ${CATEGORY_STYLES[category]}`}>
      {CATEGORY_LABELS[category]}
    </span>
  );
}
