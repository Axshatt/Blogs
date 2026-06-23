export default function Loading() {
  return (
    <div className="min-h-screen px-margin-mobile py-lg md:px-margin-desktop font-sans text-primary animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-xl lg:gap-x-0">
        
        {/* LEFT COLUMN: Posts Listing */}
        <div className="lg:col-span-8 flex flex-col space-y-md lg:pr-xl lg:border-r lg:border-outline-variant/20">
          
          {/* Page Title skeleton */}
          <div className="border-b border-outline-variant/20 mb-lg px-xl md:px-[56px]">
            <h2 className="pb-md text-body-md font-bold text-primary relative inline-block">
              <div className="h-6 w-20 bg-surface-container-highest rounded-sm" />
            </h2>
          </div>

          {/* Skeletons of PostCards */}
          <div className="flex flex-col bg-transparent px-xl md:px-[56px] py-xs divide-y divide-outline-variant/10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="group flex flex-col gap-md py-lg bg-transparent">
                {/* Top Row: Author & Meta info */}
                <div className="flex items-center gap-xs">
                  <div className="w-6 h-6 rounded-full bg-surface-container-high border border-outline-variant/40 shrink-0" />
                  <div className="h-4 w-24 bg-surface-container-high rounded-sm" />
                  <span className="text-on-surface-variant/30">·</span>
                  <div className="h-4 w-12 bg-surface-container-high rounded-sm" />
                </div>

                {/* Main Content: Title, Excerpt, Image */}
                <div className="flex flex-row gap-lg justify-between items-start">
                  {/* Left Side: Title & Subtitle */}
                  <div className="flex-1 space-y-sm min-w-0">
                    <div className="h-7 w-11/12 bg-surface-container-highest rounded-sm" />
                    <div className="h-4 w-full bg-surface-container-high rounded-sm" />
                    <div className="h-4 w-5/6 bg-surface-container-high rounded-sm" />
                  </div>
                  {/* Right Side: Image Placeholder */}
                  <div className="w-[110px] h-[75px] sm:w-[150px] sm:h-[100px] shrink-0 bg-surface-container-highest border border-outline-variant/20 rounded-sm" />
                </div>

                {/* Bottom Action Row */}
                <div className="flex items-center justify-end">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high" />
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* RIGHT COLUMN: Sidebar Filters */}
        <div className="lg:col-span-4 space-y-lg lg:pl-xl">
          
          {/* Categories Sidebar Box */}
          <div className="hairline-a p-lg bg-surface-container-low space-y-md">
            <div className="h-5 w-24 bg-surface-container-highest rounded-sm mb-md" />
            <div className="space-y-sm">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex justify-between items-center py-xs border-b border-outline-variant/20 last:border-b-0">
                  <div className="h-5 w-20 bg-surface-container-high rounded-sm" />
                  <div className="h-5 w-8 bg-surface-container-high rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Box */}
          <div className="hairline-a p-lg bg-surface-container-low space-y-md">
            <div className="h-6 w-40 bg-surface-container-highest rounded-sm" />
            <div className="h-4 w-full bg-surface-container-high rounded-sm" />
            <div className="h-10 w-full bg-surface-container-high rounded-sm" />
            <div className="h-10 w-full bg-primary rounded-sm" />
          </div>

          {/* Popular Tags Box */}
          <div className="hairline-a p-lg bg-surface-container-low space-y-md">
            <div className="h-5 w-28 bg-surface-container-highest rounded-sm mb-md" />
            <div className="flex flex-wrap gap-xs">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className="h-6 w-16 bg-surface-container-high rounded-full" />
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
