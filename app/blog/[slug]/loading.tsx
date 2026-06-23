export default function Loading() {
  return (
    <article className="mx-auto max-w-3xl px-margin-mobile py-xxl md:px-margin-desktop animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-sm mb-lg text-label-sm text-on-surface-variant/40">
        <span className="h-4 w-12 bg-surface-container-high rounded-sm" />
        <span>/</span>
        <span className="h-4 w-24 bg-surface-container-high rounded-sm" />
      </div>

      {/* Post Header Skeleton */}
      <header className="mb-xl space-y-md">
        <div className="flex items-center gap-lg mb-md">
          <div className="h-6 w-20 bg-surface-container-high rounded-full" />
          <div className="h-4 w-28 bg-surface-container-high rounded-sm" />
          <span className="text-on-surface-variant/30">·</span>
          <div className="h-4 w-16 bg-surface-container-high rounded-sm" />
        </div>

        {/* Large pulsing title */}
        <div className="space-y-sm">
          <div className="h-10 w-full bg-surface-container-highest rounded-sm" />
          <div className="h-10 w-4/5 bg-surface-container-highest rounded-sm" />
        </div>

        {/* Excerpt */}
        <div className="space-y-xs pt-xs">
          <div className="h-5 w-full bg-surface-container-high rounded-sm" />
          <div className="h-5 w-5/6 bg-surface-container-high rounded-sm" />
        </div>
      </header>

      <hr className="mb-xl border-outline-variant/30" />

      {/* MDX Content Skeleton (multiple paragraph block lines) */}
      <div className="space-y-lg mb-xxl">
        {/* Paragraph 1 */}
        <div className="space-y-sm">
          <div className="h-4 w-full bg-surface-container-high rounded-sm" />
          <div className="h-4 w-11/12 bg-surface-container-high rounded-sm" />
          <div className="h-4 w-full bg-surface-container-high rounded-sm" />
          <div className="h-4 w-4/5 bg-surface-container-high rounded-sm" />
        </div>

        {/* Heading 2 Skeleton */}
        <div className="h-7 w-1/3 bg-surface-container-highest rounded-sm pt-xs" />

        {/* Paragraph 2 */}
        <div className="space-y-sm">
          <div className="h-4 w-full bg-surface-container-high rounded-sm" />
          <div className="h-4 w-full bg-surface-container-high rounded-sm" />
          <div className="h-4 w-5/6 bg-surface-container-high rounded-sm" />
        </div>

        {/* Image/Callout block */}
        <div className="h-40 w-full bg-surface-container-low border border-outline-variant/20 rounded-sm" />

        {/* Paragraph 3 */}
        <div className="space-y-sm">
          <div className="h-4 w-full bg-surface-container-high rounded-sm" />
          <div className="h-4 w-11/12 bg-surface-container-high rounded-sm" />
          <div className="h-4 w-4/5 bg-surface-container-high rounded-sm" />
        </div>
      </div>

      {/* Author Box Skeleton */}
      <div className="border-t border-b border-outline-variant/20 py-xl my-xl">
        <div className="flex flex-col sm:flex-row gap-lg items-start">
          {/* Avatar Circle */}
          <div className="shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full bg-surface-container-highest border border-outline-variant/30" />
          
          {/* Content Area */}
          <div className="flex-1 w-full space-y-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-md">
              <div className="space-y-xs">
                <div className="h-6 w-44 bg-surface-container-highest rounded-sm" />
                <div className="h-4 w-24 bg-surface-container-high rounded-sm" />
              </div>
              {/* Social links */}
              <div className="flex gap-sm">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/20" />
                ))}
              </div>
            </div>
            {/* Bio text */}
            <div className="space-y-sm">
              <div className="h-4 w-full bg-surface-container-high rounded-sm" />
              <div className="h-4 w-5/6 bg-surface-container-high rounded-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Skeleton */}
      <div className="mt-xxl border-t border-outline-variant/20 pt-xl">
        <div className="grid grid-cols-2 gap-gutter">
          <div className="space-y-sm">
            <div className="h-4 w-16 bg-surface-container-high rounded-sm" />
            <div className="h-5 w-4/5 bg-surface-container-highest rounded-sm" />
          </div>
          <div className="space-y-sm text-right flex flex-col items-end">
            <div className="h-4 w-16 bg-surface-container-high rounded-sm" />
            <div className="h-5 w-4/5 bg-surface-container-highest rounded-sm" />
          </div>
        </div>
      </div>
    </article>
  );
}
