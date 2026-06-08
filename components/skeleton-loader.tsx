import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
  variant?: 'card' | 'table-row' | 'list-item';
}

export function SkeletonLoader({
  count = 3,
  variant = 'card',
}: SkeletonLoaderProps) {
  if (variant === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="skeleton h-32 rounded-lg border border-border"
          />
        ))}
      </div>
    );
  }

  if (variant === 'table-row') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton h-16 rounded-lg border border-border" />
        ))}
      </div>
    );
  }

  if (variant === 'list-item') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex gap-3 p-4 border border-border rounded-lg"
          >
            <div className="skeleton w-12 h-12 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-4 w-3/4 rounded" />
              <div className="skeleton h-4 w-1/2 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}
