import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; direction: 'up' | 'down' };
  icon?: React.ReactNode;
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
}: StatCardProps) {
  return (
    <div className="card-elevated border border-border rounded-lg p-4 sm:p-6 bg-card">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-foreground mt-1 sm:mt-2 truncate">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 p-2 sm:p-3 rounded-lg bg-muted">
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 sm:mt-4 flex items-center gap-2 text-xs sm:text-sm">
          <span
            className={`font-semibold whitespace-nowrap ${
              trend.direction === 'up'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            }`}
          >
            {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
          </span>
          <span className="text-muted-foreground">vs last month</span>
        </div>
      )}
    </div>
  );
}
