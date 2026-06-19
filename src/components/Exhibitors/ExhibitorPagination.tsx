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

  return (
    <nav aria-label="Aussteller Seitennavigation" className="flex items-center gap-1.5">
      {/* Previous Page Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn btn-outline btn-sm h-9 w-9 rounded-lg flex items-center justify-center p-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none disabled:opacity-40"
        aria-label="Vorherige Seite"
        type="button"
      >
        <ChevronLeft className="w-5 h-5" aria-hidden="true" />
      </button>

      {/* Page Numbers */}
      <div className="join gap-1">
        {pages.map((page) => {
          const isCurrent = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`join-item btn btn-sm h-9 min-w-[36px] rounded-lg font-bold focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none border transition-colors ${
                isCurrent
                  ? 'bg-primary text-black hover:bg-primary-dark border-transparent'
                  : 'btn-outline border-surface-border text-foreground hover:bg-surface-border'
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
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn btn-outline btn-sm h-9 w-9 rounded-lg flex items-center justify-center p-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none disabled:opacity-40"
        aria-label="Nächste Seite"
        type="button"
      >
        <ChevronRight className="w-5 h-5" aria-hidden="true" />
      </button>
    </nav>
  );
}

export default ExhibitorPagination;
