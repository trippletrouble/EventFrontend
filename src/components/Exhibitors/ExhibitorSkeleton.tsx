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
          className="bg-surface-raised border border-surface-border rounded-xl p-6 flex flex-col justify-between shadow-md h-[240px] animate-pulse"
          data-testid="exhibitor-skeleton"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {/* Logo placeholder */}
              <div className="w-14 h-14 rounded-xl bg-surface-border shrink-0" />
              {/* Title & Tag placeholder */}
              <div className="space-y-2 flex-grow">
                <div className="h-5 bg-surface-border rounded-md w-3/4" />
                <div className="h-4 bg-surface-border rounded-md w-1/3" />
              </div>
            </div>
            {/* Info list placeholder */}
            <div className="space-y-2 pt-2">
              <div className="h-4 bg-surface-border rounded-md w-5/6" />
              <div className="h-4 bg-surface-border rounded-md w-2/3" />
            </div>
          </div>
          {/* Button placeholder */}
          <div className="h-11 bg-surface-border rounded-lg w-full mt-4" />
        </div>
      ))}
    </>
  );
}

export default ExhibitorSkeleton;
