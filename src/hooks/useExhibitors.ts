'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { CompanyDto } from '@/types/api.types';
import * as eventService from '@/services/event.service';
import { mockCompanies } from '@/__tests__/mocks/data/companies';

export const EXHIBITOR_CATEGORIES = [
  'IT & Software',
  'Gesundheitswesen & Soziales',
  'Logistik & Transport',
  'Versicherungen & Finanzen',
  'Industrie & Maschinenbau',
  'Öffentlicher Dienst',
  'Sonstige'
] as const;

export type ExhibitorCategory = typeof EXHIBITOR_CATEGORIES[number];

/**
 * Future-proof helper for company category assignment.
 * Checks for existing fields first, then falls back to client-side heuristics.
 */
export function getCompanyCategory(company: CompanyDto & { industry?: string; category?: string }): string {
  if (company.industry) return company.industry;
  if (company.category) return company.category;
  
  const name = company.name.toLowerCase();
  if (name.includes('netzsch') || name.includes('ceramtec') || name.includes('wilo') || name.includes('sandler') || name.includes('viessmann') || name.includes('rehau') || name.includes('lamilux')) {
    return 'Industrie & Maschinenbau';
  }
  if (name.includes('aok') || name.includes('techniker') || name.includes('krankenkasse')) {
    return 'Gesundheitswesen & Soziales';
  }
  if (name.includes('sap') || name.includes('datev') || name.includes('hetzner') || name.includes('software') || name.includes('test')) {
    return 'IT & Software';
  }
  if (name.includes('huk-coburg') || name.includes('versicherung') || name.includes('finanz') || name.includes('bank') || name.includes('sponsor')) {
    return 'Versicherungen & Finanzen';
  }
  if (name.includes('dhl') || name.includes('weiss') || name.includes('logistik') || name.includes('transport') || name.includes('pending')) {
    return 'Logistik & Transport';
  }
  if (name.includes('bundeswehr') || name.includes('agentur') || name.includes('stadt') || name.includes('hochschule')) {
    return 'Öffentlicher Dienst';
  }
  return 'Sonstige';
}

export function useExhibitors() {
  const [exhibitors, setExhibitors] = useState<CompanyDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('Alle');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const [favorites, setFavorites] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('exhibitor_favorites');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse favorites', e);
        }
      }
    }
    return [];
  });

  const fetchExhibitors = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await eventService.getExhibitors();
      // In production, we only list VERIFIED exhibitors
      setExhibitors(data.filter((c) => c.status === 'VERIFIED'));
      setError(null);
    } catch (err) {
      console.warn('API call failed, falling back to mock data in development:', err);
      if (process.env.NODE_ENV === 'development') {
        setExhibitors(mockCompanies.filter((c) => c.status === 'VERIFIED'));
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : 'Fehler beim Laden der Aussteller');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchExhibitors();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchExhibitors]);

  const changeSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const changeCategory = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  }, []);

  const changeLetter = useCallback((letter: string) => {
    setSelectedLetter(letter);
    setCurrentPage(1);
  }, []);

  const toggleFavorite = useCallback((companyId: number) => {
    setFavorites((prev) => {
      const next = prev.includes(companyId)
        ? prev.filter((id) => id !== companyId)
        : [...prev, companyId];
      if (typeof window !== 'undefined') {
        localStorage.setItem('exhibitor_favorites', JSON.stringify(next));
      }
      return next;
    });
  }, []);

  // Filter and Sort logic
  const filteredExhibitors = useMemo(() => {
    const filtered = exhibitors.filter((exhibitor) => {
      const matchesSearch = exhibitor.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      
      const matchesCategory =
        !selectedCategory || getCompanyCategory(exhibitor) === selectedCategory;

      const matchesLetter =
        selectedLetter === 'Alle' ||
        (selectedLetter === '0-9'
          ? /^[0-9]/.test(exhibitor.name)
          : selectedLetter === 'Sonstige'
          ? /^[^a-zA-Z0-9]/.test(exhibitor.name)
          : exhibitor.name.toUpperCase().startsWith(selectedLetter));

      return matchesSearch && matchesCategory && matchesLetter;
    });

    // Sort alphabetically by name
    return [...filtered].sort((a, b) => a.name.localeCompare(b.name, 'de'));
  }, [exhibitors, searchQuery, selectedCategory, selectedLetter]);

  // Pagination logic
  const totalCount = filteredExhibitors.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  const paginatedExhibitors = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredExhibitors.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredExhibitors, currentPage, itemsPerPage]);

  return {
    exhibitors,
    filteredExhibitors,
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
    setSearchQuery: changeSearchQuery,
    setSelectedCategory: changeCategory,
    setSelectedLetter: changeLetter,
    toggleFavorite,
    setCurrentPage,
    refetch: fetchExhibitors,
  };
}
