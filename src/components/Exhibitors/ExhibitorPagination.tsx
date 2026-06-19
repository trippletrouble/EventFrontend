'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ExhibitorPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ExhibitorPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ExhibitorPaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const handlePageChange = (page: number) => {
    onPageChange(page);
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav aria-label="Aussteller Seitennavigation" className="flex items-center gap-3">
      {/* Previous Page Button */}
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-10 w-10 rounded-lg border border-surface-border bg-surface-raised text-foreground hover:bg-surface-overlay hover:text-primary hover:border-foreground-muted flex items-center justify-center p-0 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none disabled:opacity-30 disabled:hover:bg-surface-raised disabled:hover:text-foreground disabled:hover:border-surface-border cursor-pointer disabled:cursor-not-allowed"
        aria-label="Vorherige Seite"
        type="button"
      >
        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {pages.map((page) => {
          const isCurrent = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`h-10 min-w-[40px] rounded-lg font-bold text-sm transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none border flex items-center justify-center cursor-pointer ${
                isCurrent
                  ? 'bg-primary text-black border-transparent scale-105 shadow-md shadow-primary/10'
                  : 'border-surface-border bg-surface-raised text-foreground hover:bg-surface-overlay hover:text-primary hover:border-foreground-muted'
              }`}
              aria-label={`Gehe zu Seite ${page}`}
              aria-current={isCurrent ? 'page' : undefined}
              type="button"
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next Page Button */}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-10 w-10 rounded-lg border border-surface-border bg-surface-raised text-foreground hover:bg-surface-overlay hover:text-primary hover:border-foreground-muted flex items-center justify-center p-0 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none disabled:opacity-30 disabled:hover:bg-surface-raised disabled:hover:text-foreground disabled:hover:border-surface-border cursor-pointer disabled:cursor-not-allowed"
        aria-label="Nächste Seite"
        type="button"
      >
        <ChevronRight className="w-5 h-5" aria-hidden="true" />
      </button>
    </nav>
  );
}

export default ExhibitorPagination;

