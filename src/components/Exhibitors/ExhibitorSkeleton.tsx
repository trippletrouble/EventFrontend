import React from 'react';

interface ExhibitorSkeletonProps {
  count?: number;
}

export function ExhibitorSkeleton({ count = 6 }: ExhibitorSkeletonProps) {
  const skeletons = Array.from({ length: count });

  return (
    <>
      {skeletons.map((_, idx) => (
        <div
          key={idx}
          className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-l-4 border-l-transparent bg-surface-raised animate-pulse h-auto sm:h-26"
          data-testid="exhibitor-skeleton"
        >
          {/* Logo & Name block */}
          <div className="flex items-center gap-4 min-w-[260px] max-w-sm flex-1">
            <div className="w-16 h-16 bg-surface-border/50 shrink-0" />
            <div className="space-y-2 flex-grow">
              <div className="h-4.5 bg-surface-border/50 w-2/3" />
              <div className="sm:hidden h-3 bg-surface-border/50 w-1/2" />
            </div>
          </div>

          {/* Location placeholder */}
          <div className="hidden sm:block h-4 bg-surface-border/50 w-32" />

          {/* Category placeholder */}
          <div className="hidden sm:block h-4 bg-surface-border/50 w-40" />

          {/* Button placeholder */}
          <div className="flex items-center justify-end shrink-0">
            <div className="w-24 h-11 bg-surface-border/50 rounded-lg" />
          </div>
        </div>
      ))}
    </>
  );
}

export default ExhibitorSkeleton;
