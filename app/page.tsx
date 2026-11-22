import { getAllPosts } from '@/lib/posts';
import { HeroSection } from '@/components/ui/HeroSection';
import { PostBentoGrid } from '@/components/ui/PostBentoGrid';
import { NewsletterSection } from '@/components/ui/NewsletterSection';
import { getPersonSchema, getOrganizationSchema } from '@/lib/seo';

const HERO_CATEGORIES = [
  { value: 'build-log', label: 'Build Log', href: '/blog?category=build-log' },
  { value: 'tutorial', label: 'Tutorial', href: '/blog?category=tutorial' },
  { value: 'experiment', label: 'Experiment', href: '/blog?category=experiment' },
  { value: 'ai', label: 'AI & Automation', href: '/blog?category=tutorial' },
  { value: 'web', label: 'Web Dev', href: '/blog?category=build-log' },
  { value: 'design', label: 'Design', href: '/blog?category=experiment' },
];

export default function HomePage() {
  const allPosts = getAllPosts();
  const personSchema = getPersonSchema();
  const orgSchema = getOrganizationSchema();

  return (
    <div className="min-h-screen px-margin-mobile py-xxl md:px-margin-desktop">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(orgSchema),
        }}
      />

      {/* Hero Section: Title + Category Tags */}
      <HeroSection
        title={
          <>
            Builds
            <span className="text-secondary">.</span>
          </>
        }
        categories={HERO_CATEGORIES}
      />

      {/* Posts: Magazine Bento Grid */}
      <PostBentoGrid posts={allPosts} />

      {/* Newsletter — Full Width */}
      {process.env.PAGES_EXPORT !== 'true' && <NewsletterSection />}
    </div>
  );
}
