import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Developer, AI content creator, and agency owner building in public.',
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <div className="mb-2 font-mono text-xs uppercase tracking-widest text-zinc-600">
        /about
      </div>
      <h1 className="mb-6 text-4xl font-bold tracking-tight text-zinc-100">
        Hey, I&apos;m a developer building in public.
      </h1>

      <div className="space-y-4 text-base leading-7 text-zinc-400">
        <p>
          I run a web dev + AI automation agency by day, build an indie game by
          night, and write about all of it here. This blog is my public working
          document — a mix of honest retrospectives, step-by-step tutorials, and
          weird experiments at the edge of AI and creativity.
        </p>
        <p>
          The three content pillars are{' '}
          <span className="font-mono text-amber-400">build-log</span>{' '}
          (progress updates on the agency and the game),{' '}
          <span className="font-mono text-sky-400">tutorial</span> (practical
          how-tos for n8n, OpenAI, Next.js, and more), and{' '}
          <span className="font-mono text-violet-400">experiment</span>{' '}
          (creative coding and AI side projects).
        </p>
        <p>
          Posts here are the canonical source — I cross-post to Dev.to and
          Hashnode afterwards, but the original always lives here.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: 'Stack', value: 'Next.js · TypeScript · n8n · OpenAI' },
          { label: 'Focus', value: 'AI automation · Web dev · Game dev' },
          { label: 'Status', value: 'Building in public 🚀' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg border border-white/5 bg-white/[0.02] p-4"
          >
            <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
              {label}
            </div>
            <div className="text-sm text-zinc-300">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
