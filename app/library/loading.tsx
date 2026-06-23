export default function Loading() {
  return (
    <div className="px-margin-mobile md:px-margin-desktop pt-[110px] pb-xl max-w-[800px] mx-auto font-sans px-lg md:px-xl animate-pulse">
      {/* Page Header */}
      <div className="flex items-center justify-between mb-xl">
        <h1 className="h-10 w-44 bg-surface-container-highest rounded-sm" />
        <div className="w-24 h-9 bg-surface-container-high rounded-full" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-xl border-b border-outline-variant/30 mb-xl">
        <div className="pb-md h-6 w-24 bg-surface-container-highest rounded-sm" />
        <div className="pb-md h-6 w-32 bg-surface-container-high rounded-sm" />
      </div>

      {/* Grid of lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div
            key={idx}
            className="border border-outline-variant/20 rounded-lg overflow-hidden bg-surface-container-low flex flex-col justify-between h-[280px]"
          >
            {/* Header */}
            <div className="p-lg space-y-sm">
              <div className="flex items-center gap-sm">
                <div className="w-6 h-6 rounded-full bg-surface-container-highest border border-outline-variant/40" />
                <div className="h-4 w-24 bg-surface-container-high rounded-sm" />
              </div>

              <div className="h-7 w-2/3 bg-surface-container-highest rounded-sm mt-sm" />
              <div className="h-4 w-16 bg-surface-container-high rounded-sm" />
            </div>

            {/* Thumbnail collage */}
            <div className="flex border-t border-outline-variant/20 h-[100px]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-surface-container h-full border-r border-outline-variant/25 last:border-r-0"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
