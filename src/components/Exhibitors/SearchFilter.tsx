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
    <div className="bg-surface-raised border border-surface-border rounded-xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-end">
      {/* Search Input */}
      <div className="form-control w-full md:flex-1 relative">
        <label htmlFor="search-input" className="label py-1">
          <span className="label-text font-bold text-foreground flex items-center gap-1.5">
            <Search className="w-4 h-4 text-foreground-muted" aria-hidden="true" />
            Nach Ausstellern suchen
          </span>
        </label>
        <div className="relative">
          <input
            id="search-input"
            type="text"
            className="input input-bordered w-full pr-10 pl-4 py-3 rounded-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
            placeholder="Firmenname eingeben..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
          />
          {localSearch && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-foreground-muted hover:text-foreground rounded-full hover:bg-surface-border transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary"
              aria-label="Suchbegriff löschen"
              type="button"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      {/* Category Dropdown */}
      <div className="form-control w-full md:w-80">
        <label htmlFor="category-select" className="label py-1">
          <span className="label-text font-bold text-foreground flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-foreground-muted" aria-hidden="true" />
            Branche filtern
          </span>
        </label>
        <select
          id="category-select"
          className="select select-bordered w-full rounded-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
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
      </div>
    </div>
  );
}

export default SearchFilter;
