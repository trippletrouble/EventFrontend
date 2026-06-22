'use client';

import React from 'react';
import Header from '@/components/Layout/Header';
import { useExhibitors } from '@/hooks/useExhibitors';
import {
  SearchFilter,
  ExhibitorCard,
  ExhibitorSkeleton,
  AlphabetFilter,
} from '@/components/Exhibitors';
import { Alert, Button } from '@/components/UI';

function getGroupingLetter(name: string): string {
  const char = name.trim().charAt(0).toUpperCase();
  if (/^[0-9]/.test(char)) return '0-9';
  if (/^[A-Z]/.test(char)) return char;
  return 'Sonstige';
}

function getGroupHeaderStyle(group: string) {
  const colors = [
    'bg-[#FE3D4E] text-black border-[#FE3D4E]', // Red
    'bg-[#FCCD01] text-black border-[#FCCD01]', // Yellow
    'bg-[#2860F8] text-white border-[#2860F8]', // Blue
    'bg-[#0AD88E] text-black border-[#0AD88E]', // Green
  ];
  const charCode = group.charCodeAt(0) || 0;
  return colors[charCode % colors.length];
}

export default function ExhibitorsPage() {
  const {
    paginatedExhibitors,
    isLoading,
    error,
    currentPage,
    totalPages,
    totalCount,
    searchQuery,
    selectedCategory,
    selectedLetter,
    favorites,
    setSearchQuery,
    setSelectedCategory,
    setSelectedLetter,
    toggleFavorite,
    setCurrentPage,
  } = useExhibitors();

  const observerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (currentPage >= totalPages) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setCurrentPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerRef.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [currentPage, totalPages, setCurrentPage]);

  return (
    <>
      <Header />
      <main id="main-content" className="container mx-auto px-4 py-8 max-w-6xl space-y-6 pt-24">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Unsere Aussteller</h1>
          <p className="text-foreground-muted text-sm mt-1">
            Lernen Sie die Partner und Aussteller der Unternehmerbörse 2026 kennen. 
            Nutzen Sie die Filter, um nach bestimmten Branchen oder Firmennamen zu suchen.
          </p>
        </div>

        {/* Suche & Filter */}
        <div className="space-y-4 flex flex-col">
          <SearchFilter
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
          />

          <a
            href="#exhibitor-results"
            className="sr-only focus:not-sr-only focus:block focus:p-3 focus:bg-surface-raised focus:border focus:border-primary focus:text-primary focus:rounded-lg focus:text-center focus:font-semibold text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 self-center w-full max-w-xs"
          >
            Alphabetischen Filter überspringen
          </a>

          <AlphabetFilter
            selectedLetter={selectedLetter}
            onLetterChange={setSelectedLetter}
          />
        </div>

        {/* Fehleranzeige */}
        {error && (
          <Alert variant="error" title="Fehler beim Laden">
            {error}
          </Alert>
        )}

        {/* Aussteller-Liste / Lade-Zustand */}
        <div id="exhibitor-results" tabIndex={-1} className="focus:outline-none focus-ring rounded-lg">
          {isLoading ? (
            <div role="status" aria-live="polite" aria-label="Aussteller werden geladen" className="divide-y divide-surface-border border border-surface-border overflow-hidden bg-surface-raised">
              <ExhibitorSkeleton count={6} />
            </div>
          ) : paginatedExhibitors.length === 0 ? (
            <div className="bg-surface-raised border border-surface-border p-12 text-center space-y-4 shadow-sm">
              <p className="text-foreground font-semibold text-lg">Keine Aussteller gefunden</p>
              <p className="text-foreground-muted text-sm max-w-md mx-auto">
                Für deine Suche &quot;{searchQuery}&quot; in der Kategorie &quot;{selectedCategory || 'Alle Branchen'}&quot; und Buchstabe &quot;{selectedLetter}&quot; wurden keine Ergebnisse gefunden. 
                Versuche es mit anderen Suchbegriffen oder setze die Filter zurück.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                  setSelectedLetter('Alle');
                }}
                variant="primary"
                className="px-6 py-2"
              >
                Filter zurücksetzen
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div 
                className="flex flex-col gap-1" 
                aria-label={`Ausstellerliste: ${totalCount} Firmen gefunden`}
                role="list"
              >
                {(() => {
                  let lastGroup = '';
                  return paginatedExhibitors.map((exhibitor, index) => {
                    const group = getGroupingLetter(exhibitor.name);
                    const showHeader = group !== lastGroup;
                    lastGroup = group;
                    return (
                      <React.Fragment key={exhibitor.companyId}>
                        {showHeader && (
                          <div className="flex pt-6 first:pt-0 mb-2">
                            <div className={`h-10 px-4 min-w-10 flex items-center justify-center font-black text-base select-none uppercase border ${getGroupHeaderStyle(group)}`}>
                              {group}
                            </div>
                          </div>
                        )}
                        <ExhibitorCard
                          exhibitor={exhibitor}
                          index={index}
                          isFavorite={favorites.includes(exhibitor.companyId)}
                          onToggleFavorite={() => toggleFavorite(exhibitor.companyId)}
                          onCategoryClick={setSelectedCategory}
                        />
                      </React.Fragment>
                    );
                  });
                })()}
              </div>

              {/* Barrierefreies Infinite Scroll & Screen-Reader Live-Region */}
              <div className="sr-only" role="status" aria-live="polite">
                {`${paginatedExhibitors.length} von ${totalCount} Ausstellern geladen.`}
              </div>

              {currentPage < totalPages && (
                <div ref={observerRef} className="flex flex-col items-center gap-4 pt-8 pb-4">
                  {/* Visueller Ladebalken/Puls */}
                  <div 
                    className="h-1.5 w-24 bg-surface-border overflow-hidden rounded-full relative"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-[#EAB308] rounded-full motion-safe:animate-[pulse_1.5s_infinite]" />
                  </div>
                  
                  {/* Tastatur-fokussierbarer Button für Barrierefreiheit */}
                  <Button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    variant="outline"
                    className="border-2 border-surface-border hover:border-[#EAB308] text-foreground hover:text-white px-8 py-2.5 rounded-lg text-sm font-bold transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none cursor-pointer"
                    type="button"
                  >
                    Mehr laden
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
