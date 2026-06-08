import React from 'react';
import { ChevronRight, Bell, Settings } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function DashboardHeader({
  title,
  description,
  breadcrumbs,
  action,
}: DashboardHeaderProps) {
  return (
    <div className="border-b border-border bg-card sticky top-0 z-10">
      <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-2 mb-3 text-xs sm:text-sm overflow-x-auto pb-2">
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                {index > 0 && (
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                )}
                <span
                  className={`whitespace-nowrap ${
                    crumb.href
                      ? 'text-primary hover:underline cursor-pointer'
                      : 'text-muted-foreground'
                  }`}
                >
                  {crumb.label}
                </span>
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-balance">{title}</h1>
            {description && (
              <p className="text-sm sm:text-base text-muted-foreground mt-1 line-clamp-1 sm:line-clamp-none">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {action && (
              <button
                onClick={action.onClick}
                className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity duration-200 whitespace-nowrap min-h-10"
              >
                {action.label}
              </button>
            )}
            <button className="p-2 hover:bg-muted rounded-lg transition-colors hidden sm:inline-flex min-h-10 min-w-10">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </button>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors hidden sm:inline-flex min-h-10 min-w-10">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
