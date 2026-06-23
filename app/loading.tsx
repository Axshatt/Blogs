export default function Loading() {
  return (
    <div className="min-h-screen px-margin-mobile py-xxl md:px-margin-desktop animate-pulse">
      {/* Hero Section Skeleton */}
      <div className="mb-xxl max-w-4xl">
        {/* Pulsing Title */}
        <div className="h-16 w-3/4 bg-surface-container-highest mb-lg rounded-sm" />
        
        {/* Category list */}
        <div className="flex flex-wrap gap-sm mt-md">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 bg-surface-container-high rounded-full border border-outline-variant/30"
            />
          ))}
        </div>
      </div>

      {/* Bento Grid Skeleton */}
      <section className="mb-xxl">
        <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-outline-variant/40 bg-surface">
          
          {/* COLUMN 1 */}
          <div className="flex flex-col border-b md:border-b-0 border-outline-variant/40">
            {/* Card 1 Skeleton */}
            <div className="flex flex-row items-start p-lg border-b border-outline-variant/40 min-h-[190px] gap-md">
              <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] shrink-0 bg-surface-container-highest rounded-sm" />
              <div className="flex-1 space-y-xs min-w-0">
                <div className="h-4 w-16 bg-surface-container-high rounded-sm" />
                <div className="h-6 w-11/12 bg-surface-container-highest rounded-sm mt-sm" />
                <div className="h-4 w-full bg-surface-container-high rounded-sm mt-xs" />
              </div>
            </div>

            {/* Card 2 Skeleton */}
            <div className="flex flex-col p-lg mt-md">
              <div className="w-full aspect-[16/10] bg-surface-container-highest border border-outline-variant/20 mb-lg" />
              <div className="flex gap-xs mb-sm">
                <div className="h-6 w-20 bg-surface-container-high rounded-full" />
                <div className="h-6 w-16 bg-surface-container-high rounded-full" />
              </div>
              <div className="space-y-sm">
                <div className="h-8 w-11/12 bg-surface-container-highest rounded-sm" />
                <div className="h-8 w-3/4 bg-surface-container-highest rounded-sm" />
              </div>
            </div>
          </div>

          {/* COLUMN 2 */}
          <div className="flex flex-col border-b md:border-b-0 md:border-x border-outline-variant/40">
            {/* Card 3 Skeleton */}
            <div className="flex flex-row items-start p-lg border-b border-outline-variant/40 min-h-[190px] gap-md">
              <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] shrink-0 bg-surface-container-highest rounded-sm" />
              <div className="flex-1 space-y-xs min-w-0">
                <div className="h-4 w-16 bg-surface-container-high rounded-sm" />
                <div className="h-6 w-11/12 bg-surface-container-highest rounded-sm mt-sm" />
                <div className="h-4 w-full bg-surface-container-high rounded-sm" />
              </div>
            </div>

            {/* Card 4 Skeleton */}
            <div className="flex flex-col p-lg border-b border-outline-variant/40 space-y-sm">
              <div className="h-4 w-20 bg-surface-container-high rounded-full" />
              <div className="h-6 w-11/12 bg-surface-container-highest rounded-sm" />
              <div className="h-4 w-full bg-surface-container-high rounded-sm" />
            </div>

            {/* Card 5 Skeleton */}
            <div className="flex flex-col p-lg border-b border-outline-variant/40 space-y-sm">
              <div className="h-4 w-20 bg-surface-container-high rounded-full" />
              <div className="h-6 w-11/12 bg-surface-container-highest rounded-sm" />
              <div className="h-4 w-full bg-surface-container-high rounded-sm" />
            </div>

            {/* Card 6 Skeleton */}
            <div className="flex flex-col p-lg space-y-sm">
              <div className="h-4 w-20 bg-surface-container-high rounded-full" />
              <div className="h-6 w-11/12 bg-surface-container-highest rounded-sm" />
              <div className="h-4 w-full bg-surface-container-high rounded-sm" />
            </div>
          </div>

          {/* COLUMN 3 */}
          <div className="flex flex-col">
            {/* Card 7 Skeleton */}
            <div className="flex flex-row items-start p-lg border-b border-outline-variant/40 min-h-[190px] gap-md">
              <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] shrink-0 bg-surface-container-highest rounded-sm" />
              <div className="flex-1 space-y-xs min-w-0">
                <div className="h-4 w-16 bg-surface-container-high rounded-sm" />
                <div className="h-6 w-11/12 bg-surface-container-highest rounded-sm mt-sm" />
                <div className="h-4 w-full bg-surface-container-high rounded-sm" />
              </div>
            </div>

            {/* Card 8 Skeleton (Podcast Cover) */}
            <div className="p-lg border-b border-outline-variant/40 flex items-center justify-center bg-surface-container-lowest">
              <div className="w-full aspect-square bg-[#1e2722] border border-outline-variant/20 rounded-sm" />
            </div>

            {/* Card 9 Skeleton */}
            <div className="flex flex-col p-lg space-y-sm">
              <div className="h-4 w-20 bg-surface-container-high rounded-full" />
              <div className="h-7 w-11/12 bg-surface-container-highest rounded-sm" />
              <div className="h-4 w-full bg-surface-container-high rounded-sm" />
            </div>
          </div>

        </div>
      </section>

      {/* Newsletter Section Skeleton */}
      <div className="hairline-a bg-surface-container-low p-xl flex flex-col md:flex-row md:items-center justify-between gap-lg">
        <div className="max-w-xl space-y-sm">
          <div className="h-8 w-2/3 bg-surface-container-highest rounded-sm" />
          <div className="h-4 w-full bg-surface-container-high rounded-sm" />
        </div>
        <div className="flex flex-col sm:flex-row gap-md shrink-0 w-full md:w-auto">
          <div className="h-12 w-full sm:w-64 bg-surface-container-highest rounded-sm" />
          <div className="h-12 w-full sm:w-32 bg-primary rounded-sm" />
        </div>
      </div>
    </div>
  );
}
