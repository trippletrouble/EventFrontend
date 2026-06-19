'use client';

import React from 'react';
import Header from '@/components/Layout/Header';
import { useExhibitors } from '@/hooks/useExhibitors';
import {
  SearchFilter,
  ExhibitorCard,
  ExhibitorPagination,
  ExhibitorSkeleton,
} from '@/components/Exhibitors';
import { Alert } from '@/components/UI';

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
    setSearchQuery,
    setSelectedCategory,
    setCurrentPage,
  } = useExhibitors();

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
          <SearchFilter
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
          />

          {/* Fehleranzeige */}
          {error && (
            <Alert variant="error" title="Fehler beim Laden">
              {error}
            </Alert>
          )}

          {/* Aussteller-Grid / Lade-Zustand */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Aussteller werden geladen">
              <ExhibitorSkeleton count={6} />
            </div>
          ) : paginatedExhibitors.length === 0 ? (
            <div className="bg-surface-raised border border-surface-border rounded-xl p-12 text-center space-y-4 shadow-md">
              <p className="text-foreground font-semibold text-lg">Keine Aussteller gefunden</p>
              <p className="text-foreground-muted text-sm max-w-md mx-auto">
                Für deine Suche &quot;{searchQuery}&quot; in der Kategorie &quot;{selectedCategory || 'Alle Branchen'}&quot; wurden keine Ergebnisse gefunden. 
                Versuche es mit anderen Suchbegriffen oder setze die Filter zurück.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                className="btn btn-primary rounded-lg font-semibold px-6 py-2"
                type="button"
              >
                Filter zurücksetzen
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
                aria-label={`Ausstellerliste: ${totalCount} Firmen gefunden`}
              >
                {paginatedExhibitors.map((exhibitor) => (
                  <ExhibitorCard key={exhibitor.companyId} exhibitor={exhibitor} />
                ))}
              </div>

              {/* Seitennavigation */}
              {totalPages > 1 && (
                <div className="flex justify-center pt-4">
                  <ExhibitorPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          )}
      </main>
    </>
  );
}
