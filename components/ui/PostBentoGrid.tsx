import Link from 'next/link';
import type { Post } from '@/types/post';

interface PostBentoGridProps {
  posts: Post[];
}

/** Decorative icon per category */
const CATEGORY_ICONS: Record<string, string> = {
  'build-log': 'construction',
  tutorial: 'school',
  experiment: 'science',
};

/** Decorative background colors per category */
const CATEGORY_DECORATIVE_BG: Record<string, string> = {
  'build-log': 'bg-[#c8e6c9]',
  tutorial: 'bg-[#b3e5fc]',
  experiment: 'bg-[#e1bee7]',
};

function CategoryPill({ category, inverted = false }: { category: string; inverted?: boolean }) {
  const labels: Record<string, string> = {
    'build-log': 'Build Log',
    tutorial: 'Tutorial',
    experiment: 'Experiment',
  };
  return (
    <span
      className={`text-label-sm rounded-full border px-sm py-[3px] uppercase ${
        inverted
          ? 'border-on-primary/50 text-on-primary'
          : 'border-primary/80 text-primary'
      }`}
    >
      {labels[category] ?? category}
    </span>
  );
}

export function PostBentoGrid({ posts }: PostBentoGridProps) {
  // Map real posts if they exist, fallback to mock if they don't
  const p0 = posts.find(p => p.slug === 'ai-dungeon-layout-experiment') || posts[1];
  const p1 = posts.find(p => p.slug === 'agency-month-1-retrospective') || posts[0];
  const p2 = posts.find(p => p.slug === 'n8n-client-intake-chatbot') || posts[2];

  return (
    <section className="mb-xxl">
      <div className="grid grid-cols-1 md:grid-cols-3 border-t border-b border-outline-variant/40 bg-surface">
        
        {/* ── COLUMN 1 ── */}
        <div className="flex flex-col border-b md:border-b-0 border-outline-variant/40">
          
          {/* Card 1: Meet Amanda / Dungeon Layouts (Image left, text right) */}
          {p0 ? (
            <Link
              href={`/blog/${p0.slug}`}
              className="group flex flex-row items-start p-lg border-b border-outline-variant/40 min-h-[190px] gap-md"
            >
              <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] shrink-0 relative overflow-hidden bg-surface-container">
                <img
                  src="/images/amanda_portrait.png"
                  alt="Dungeon Layouts"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="flex flex-col justify-center min-w-0">
                <div className="flex flex-wrap gap-xs">
                  <CategoryPill category="Team Spotlight" />
                </div>
                <h3 className="mt-xs text-[20px] font-bold leading-tight tracking-tight text-primary transition-colors duration-200 group-hover:text-secondary line-clamp-2">
                  {p0.frontmatter.title}
                </h3>
                <p className="mt-2xs text-[14px] text-on-surface-variant line-clamp-2 leading-relaxed">
                  {p0.frontmatter.excerpt}
                </p>
              </div>
            </Link>
          ) : (
            <div className="p-lg border-b border-outline-variant/40 text-on-surface-variant">
              Post not found
            </div>
          )}

          {/* Card 2: Train image + Intro to AI Agents / Retrospective (Large image + text) */}
          {p1 ? (
            <Link
              href={`/blog/${p1.slug}`}
              className="group flex flex-col p-lg mt-md"
            >
              <div className="w-full aspect-[16/10] overflow-hidden bg-surface-container mb-lg border border-outline-variant/20">
                <img
                  src="/images/train_motion.png"
                  alt="AI Agency"
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <div className="flex flex-wrap gap-xs mb-sm">
                <CategoryPill category="Product Updates" />
                <CategoryPill category="Design" />
                <CategoryPill category="User Experience" />
              </div>
              <h2 className="text-[32px] md:text-[38px] font-black leading-[1.05] tracking-tighter text-primary transition-colors duration-200 group-hover:text-secondary">
                {p1.frontmatter.title}
              </h2>
            </Link>
          ) : (
            <div className="p-lg text-on-surface-variant">
              Post not found
            </div>
          )}

        </div>

        {/* ── COLUMN 2 ── */}
        <div className="flex flex-col border-b md:border-b-0 md:border-x border-outline-variant/40">
          
          {/* Card 3: Stay the course (Teal graphic + Text) */}
          <Link
            href="#"
            className="group flex flex-row items-start p-lg border-b border-outline-variant/40 min-h-[190px] gap-md"
          >
            <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] shrink-0 bg-[#80cbc4] flex items-center justify-center border border-outline-variant/20">
              <div className="w-[60px] h-[60px] md:w-[76px] md:h-[76px] rounded-full border-[6px] border-white flex items-center justify-center">
                <div className="w-[26px] h-[26px] md:w-[32px] md:h-[32px] rounded-full bg-[#1c2e24]" />
              </div>
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex flex-wrap gap-xs">
                <CategoryPill category="Product Updates" />
              </div>
              <h3 className="mt-xs text-[20px] font-bold leading-tight tracking-tight text-primary transition-colors duration-200 group-hover:text-secondary">
                Stay the course
              </h3>
              <p className="mt-2xs text-[14px] text-on-surface-variant line-clamp-2 leading-relaxed">
                This is some room for some nice text about this blog post
              </p>
            </div>
          </Link>

          {/* Card 4: New CFO (Text only) */}
          <Link
            href="#"
            className="group flex flex-col p-lg border-b border-outline-variant/40"
          >
            <div className="flex flex-wrap gap-xs">
              <CategoryPill category="Intros" />
            </div>
            <h3 className="mt-sm text-[22px] font-bold leading-tight tracking-tight text-primary transition-colors duration-200 group-hover:text-secondary">
              New CFO
            </h3>
            <p className="mt-2xs text-[14px] text-on-surface-variant line-clamp-2 leading-relaxed">
              We welcome Jim Smith to the team this week - here&apos;s more about him
            </p>
          </Link>

          {/* Card 5: Product release / Chatbot (Text only) */}
          {p2 ? (
            <Link
              href={`/blog/${p2.slug}`}
              className="group flex flex-col p-lg border-b border-outline-variant/40"
            >
              <div className="flex flex-wrap gap-xs">
                <CategoryPill category="Product" />
              </div>
              <h3 className="mt-sm text-[22px] font-bold leading-tight tracking-tight text-primary transition-colors duration-200 group-hover:text-secondary">
                {p2.frontmatter.title}
              </h3>
              <p className="mt-2xs text-[14px] text-on-surface-variant line-clamp-2 leading-relaxed">
                {p2.frontmatter.excerpt}
              </p>
            </Link>
          ) : (
            <Link
              href="#"
              className="group flex flex-col p-lg border-b border-outline-variant/40"
            >
              <div className="flex flex-wrap gap-xs">
                <CategoryPill category="Product" />
              </div>
              <h3 className="mt-sm text-[22px] font-bold leading-tight tracking-tight text-primary transition-colors duration-200 group-hover:text-secondary">
                Product release
              </h3>
              <p className="mt-2xs text-[14px] text-on-surface-variant line-clamp-2 leading-relaxed">
                Motion 2.0 is here and we can&apos;t be anymore excited about the updates
              </p>
            </Link>
          )}

          {/* Card 6: Focus is key (Text only) */}
          <Link
            href="#"
            className="group flex flex-col p-lg"
          >
            <div className="flex flex-wrap gap-xs">
              <CategoryPill category="Leadership" />
            </div>
            <h3 className="mt-sm text-[22px] font-bold leading-tight tracking-tight text-primary transition-colors duration-200 group-hover:text-secondary">
              Focus is key
            </h3>
            <p className="mt-2xs text-[14px] text-on-surface-variant line-clamp-2 leading-relaxed">
              We sit down with our CEO Kyle to learn how we stays focused daily
            </p>
          </Link>

        </div>

        {/* ── COLUMN 3 ── */}
        <div className="flex flex-col">
          
          {/* Card 7: Moving fast (Image + Text) */}
          <Link
            href="#"
            className="group flex flex-row items-start p-lg border-b border-outline-variant/40 min-h-[190px] gap-md"
          >
            <div className="w-[100px] h-[100px] md:w-[120px] md:h-[120px] shrink-0 relative overflow-hidden bg-surface-container border border-outline-variant/20">
              <img
                src="/images/neon_abstract.png"
                alt="Moving fast"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
            <div className="flex flex-col justify-center min-w-0">
              <div className="flex flex-wrap gap-xs">
                <CategoryPill category="Leadership" />
              </div>
              <h3 className="mt-xs text-[20px] font-bold leading-tight tracking-tight text-primary transition-colors duration-200 group-hover:text-secondary">
                Moving fast
              </h3>
              <p className="mt-2xs text-[14px] text-on-surface-variant line-clamp-2 leading-relaxed">
                We break down the top 5 things we focus on to move super fast
              </p>
            </div>
          </Link>

          {/* Card 8: Podcast cover image */}
          <div className="p-lg border-b border-outline-variant/40 flex items-center justify-center bg-surface-container-lowest">
            <div className="w-full aspect-square relative overflow-hidden bg-[#1e2722] border border-outline-variant/20">
              <img
                src="/images/ep_107_cover.png"
                alt="Ep. 107"
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          </div>

          {/* Card 9: $12M Raised (Text only) */}
          <Link
            href="#"
            className="group flex flex-col p-lg"
          >
            <div className="flex flex-wrap gap-xs">
              <CategoryPill category="Fundraising Announcement" />
              <CategoryPill category="Company" />
            </div>
            <h3 className="mt-sm text-[28px] md:text-[34px] font-black leading-tight tracking-tight text-primary transition-colors duration-200 group-hover:text-secondary">
              $12M Raised
            </h3>
            <p className="mt-2xs text-[14px] text-on-surface-variant line-clamp-2 leading-relaxed">
              We just wrapped up our Series B
            </p>
          </Link>

        </div>

      </div>
    </section>
  );
}
