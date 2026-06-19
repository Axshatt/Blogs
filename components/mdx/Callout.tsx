import type { ReactNode } from 'react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'tip' | 'danger';
  title?: string;
  children: ReactNode;
}

const CALLOUT_STYLES = {
  info: {
    wrapper: 'border-sky-500/30 bg-sky-500/5',
    icon: '💡',
    title: 'text-sky-400',
  },
  warning: {
    wrapper: 'border-amber-500/30 bg-amber-500/5',
    icon: '⚠️',
    title: 'text-amber-400',
  },
  tip: {
    wrapper: 'border-emerald-500/30 bg-emerald-500/5',
    icon: '✅',
    title: 'text-emerald-400',
  },
  danger: {
    wrapper: 'border-red-500/30 bg-red-500/5',
    icon: '🚨',
    title: 'text-red-400',
  },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const styles = CALLOUT_STYLES[type];
  return (
    <aside
      className={`my-6 rounded-lg border p-4 ${styles.wrapper}`}
      role="note"
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 text-base leading-none">{styles.icon}</span>
        <div>
          {title && (
            <p className={`mb-1 text-sm font-semibold ${styles.title}`}>
              {title}
            </p>
          )}
          <div className="text-sm text-zinc-300 [&>p]:mb-0">{children}</div>
        </div>
      </div>
    </aside>
  );
}
