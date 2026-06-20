import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Developer, AI content creator, and agency owner building in public.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-margin-mobile py-xxl md:px-margin-desktop">
      <div className="text-label-sm mb-sm uppercase text-on-surface-variant">
        /about
      </div>
      <h1 className="text-headline-xl mb-lg tracking-tight text-primary md:text-display-lg-mobile">
        Hey, I&apos;m a developer building in public.
      </h1>

      <div className="text-body-lg space-y-md leading-relaxed text-on-surface-variant">
        <p>
          I run a web dev + AI automation agency by day, build an indie game by
          night, and write about all of it here. This blog is my public working
          document — a mix of honest retrospectives, step-by-step tutorials, and
          weird experiments at the edge of AI and creativity.
        </p>
        <p>
          The three content pillars are{' '}
          <span className="text-label-bold uppercase text-primary">build-log</span>{' '}
          (progress updates on the agency and the game),{' '}
          <span className="text-label-bold uppercase text-secondary">tutorial</span>{' '}
          (practical how-tos for n8n, OpenAI, Next.js, and more), and{' '}
          <span className="text-label-bold uppercase text-on-tertiary-container">experiment</span>{' '}
          (creative coding and AI side projects).
        </p>
        <p>
          Posts here are the canonical source — I cross-post to Dev.to and
          Hashnode afterwards, but the original always lives here.
        </p>
      </div>

      <div className="mt-xl grid grid-cols-1 gap-gutter sm:grid-cols-3">
        {[
          { label: 'Stack', value: 'Next.js · TypeScript · n8n · OpenAI' },
          { label: 'Focus', value: 'AI automation · Web dev · Game dev' },
          { label: 'Status', value: 'Building in public 🚀' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="hairline-a bg-surface-container-low p-lg"
          >
            <div className="text-label-sm mb-xs uppercase text-on-surface-variant">
              {label}
            </div>
            <div className="text-body-md text-primary">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
