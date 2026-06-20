import Link from 'next/link';
import type { ReactNode } from 'react';

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

export function Button({
  href,
  onClick,
  variant = 'primary',
  size = 'md',
  children,
  className = '',
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-sm font-bold uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary/50';

  const variants = {
    primary:
      'bg-primary hover:bg-on-surface-variant text-on-primary',
    ghost: 'text-on-surface-variant hover:text-primary hover:bg-surface-container',
    outline:
      'hairline-a text-primary hover:bg-surface-container-low',
  };

  const sizes = {
    sm: 'px-md py-xs text-label-sm',
    md: 'px-xl py-md text-label-bold',
    lg: 'px-xxl py-lg text-body-md',
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
