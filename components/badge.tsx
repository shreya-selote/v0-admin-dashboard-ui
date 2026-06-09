import React from 'react';

type BadgeVariant =
  | 'default'
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'secondary';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-muted text-muted-foreground',
  success: 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300',
  warning:
    'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-300',
  error: 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300',
  info: 'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
  secondary: 'bg-secondary text-secondary-foreground',
};

const sizeStyles = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
};

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium transition-colors ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </span>
  );
}
