import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - AkshatCodes',
  description: "Building in Public. Learning Out Loud. Hey, I'm Akshat — a full-stack dev, AI tinkerer, and relentless builder.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-margin-mobile py-xxl md:px-margin-desktop font-sans">
      <div className="text-label-sm mb-sm uppercase text-on-surface-variant font-inter">
        /about
      </div>
      <h1 className="text-headline-xl mb-lg tracking-tight text-primary md:text-[44px] md:leading-[1.1] font-black">
        Building in Public. Learning Out Loud.
      </h1>

      <div className="text-body-lg space-y-md leading-relaxed text-on-surface-variant font-inter font-normal">
        <p>
          Hey, I&apos;m Akshat — a full-stack dev, AI tinkerer, and relentless builder who documents every step of the journey.
        </p>
        <p>
          With 35K+ followers across platforms, I share what I learn in real-time — from hackathons and side projects to design breakdowns and the latest in tech. No gatekeeping, just raw progress.
        </p>
        <p>
          This blog is for the curious ones just getting started — covering dev tutorials, design insights, and what&apos;s actually happening in the AI + tech world right now.
        </p>
        <p>
          If you&apos;re building, learning, or just exploring — you&apos;re in the right place.
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
            className="hairline-a bg-surface-container-low p-lg rounded"
          >
            <div className="text-label-sm mb-xs uppercase text-on-surface-variant font-bold">
              {label}
            </div>
            <div className="text-body-md text-primary font-medium">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
