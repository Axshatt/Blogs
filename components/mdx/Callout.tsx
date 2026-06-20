import type { ReactNode } from 'react';

interface CalloutProps {
  type?: 'info' | 'warning' | 'tip' | 'danger';
  title?: string;
  children: ReactNode;
}

const CALLOUT_STYLES = {
  info: {
    wrapper: 'border-outline-variant bg-surface-container-low',
    icon: '💡',
    title: 'text-primary',
  },
  warning: {
    wrapper: 'border-amber-600/30 bg-amber-50',
    icon: '⚠️',
    title: 'text-amber-800',
  },
  tip: {
    wrapper: 'border-secondary/30 bg-secondary-container/20',
    icon: '✅',
    title: 'text-secondary',
  },
  danger: {
    wrapper: 'border-error/30 bg-error-container/30',
    icon: '🚨',
    title: 'text-error',
  },
};

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const styles = CALLOUT_STYLES[type];
  return (
    <aside
      className={`my-lg rounded-lg border p-lg ${styles.wrapper}`}
      role="note"
    >
      <div className="flex items-start gap-sm">
        <span className="mt-0.5 text-base leading-none">{styles.icon}</span>
        <div>
          {title && (
            <p className={`text-label-bold mb-xs ${styles.title}`}>
              {title}
            </p>
          )}
          <div className="text-body-md text-on-surface-variant [&>p]:mb-0">{children}</div>
        </div>
      </div>
    </aside>
  );
}
