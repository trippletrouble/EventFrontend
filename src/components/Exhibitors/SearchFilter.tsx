'use client';

import React, { useState, useEffect } from 'react';
import { EXHIBITOR_CATEGORIES } from '@/hooks/useExhibitors';
import { Search, Filter, X } from 'lucide-react';

interface SearchFilterProps {
  searchQuery: string;
  selectedCategory: string;
  onSearchChange: (query: string) => void;
  onCategoryChange: (category: string) => void;
}

export function SearchFilter({
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
}: SearchFilterProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [prevSearchQuery, setPrevSearchQuery] = useState(searchQuery);

  if (searchQuery !== prevSearchQuery) {
    setPrevSearchQuery(searchQuery);
    setLocalSearch(searchQuery);
  }

  // Handle local debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  const handleClearSearch = () => {
    setLocalSearch('');
  };

  return (
    <div className="bg-surface-raised border border-surface-border p-6 shadow-sm flex flex-col md:flex-row gap-6 items-stretch md:items-end">
      {/* Search Input */}
      <div className="w-full md:flex-1 flex flex-col">
        <label htmlFor="search-input" className="text-sm font-bold text-foreground block mb-1.5">
          Nach Ausstellern suchen
        </label>
        <div className="relative w-full">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none">
            <Search className="h-4 w-4" aria-hidden="true" />
          </div>
          <input
            id="search-input"
            type="text"
            className="h-11 w-full text-sm rounded-none bg-black border border-surface-border text-foreground pl-10 pr-10 placeholder:text-foreground-muted/50 transition-all duration-150 block focus:outline-none focus:border-primary hover:border-foreground-muted/65"
            placeholder="Firmenname eingeben..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          {localSearch && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-foreground-muted hover:text-foreground rounded-full hover:bg-surface-border transition-colors outline-none focus-visible:ring-1 focus-visible:ring-primary"
              aria-label="Suchbegriff löschen"
              type="button"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Category Dropdown */}
      <div className="w-full md:w-80 flex flex-col">
        <label htmlFor="category-select" className="text-sm font-bold text-foreground block mb-1.5">
          Branche filtern
        </label>
        <div className="relative w-full">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none">
            <Filter className="h-4 w-4" aria-hidden="true" />
          </div>
          <select
            id="category-select"
            className={`h-11 w-full text-sm rounded-none bg-black border border-surface-border text-foreground pl-10 transition-all duration-150 block focus:outline-none focus:border-primary hover:border-foreground-muted/65 appearance-none cursor-pointer ${
              selectedCategory ? 'pr-16' : 'pr-10'
            }`}
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">Alle Branchen</option>
            {EXHIBITOR_CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {selectedCategory && (
            <button
              onClick={() => onCategoryChange('')}
              className="absolute right-9 top-1/2 -translate-y-1/2 p-1 text-foreground-muted hover:text-foreground rounded-full hover:bg-surface-border transition-colors outline-none focus-visible:ring-1 focus-visible:ring-primary z-10 cursor-pointer"
              aria-label="Kategorie-Filter zurücksetzen"
              type="button"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-foreground-muted pointer-events-none">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchFilter;
