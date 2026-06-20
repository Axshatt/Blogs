import type { Category } from '@/types/post';

interface CategoryBadgeProps {
  category: Category;
  size?: 'sm' | 'md';
}

const CATEGORY_LABELS: Record<Category, string> = {
  'build-log': 'Build Log',
  tutorial: 'Tutorial',
  experiment: 'Experiment',
};

export function CategoryBadge({ category, size = 'sm' }: CategoryBadgeProps) {
  const sizeClasses =
    size === 'sm'
      ? 'px-sm py-0.5 text-label-sm'
      : 'px-md py-1 text-label-bold';

  return (
    <span
      className={`inline-flex items-center rounded-full border border-outline-variant uppercase ${sizeClasses}`}
    >
      {CATEGORY_LABELS[category]}
    </span>
  );
}
