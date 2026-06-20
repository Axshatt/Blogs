interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  variant?: 'light' | 'dark';
}

export function StatCard({
  icon,
  label,
  value,
  variant = 'light',
}: StatCardProps) {
  const isDark = variant === 'dark';

  return (
    <div
      className={`hairline-a flex h-full flex-col justify-between p-lg ${
        isDark
          ? 'bg-primary text-on-primary'
          : 'bg-surface-container-low'
      }`}
    >
      <span
        className={`material-symbols-outlined mb-md ${
          isDark ? 'text-on-primary' : 'text-primary'
        }`}
      >
        {icon}
      </span>
      <div>
        <h3
          className={`text-label-bold mb-xs uppercase ${
            isDark ? 'text-outline-variant' : ''
          }`}
        >
          {label}
        </h3>
        <p className="text-[48px] font-black">{value}</p>
      </div>
    </div>
  );
}
