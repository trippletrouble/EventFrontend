'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CompanyDto, BookingDto } from '@/types/api.types';
import { apiFetch } from '@/services/api';
import { mockCompany } from '@/__tests__/mocks/data/companies';
import { mockBooking } from '@/__tests__/mocks/data/bookings';
import { mockUser, mockAdmin } from '@/__tests__/mocks/data/users';

interface CompanyData extends CompanyDto {
  bookings: BookingDto[];
}

export function useCompany(companyId: string) {
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCompany = useCallback(() => {
    return apiFetch<CompanyDto>(`/companies/${companyId}`)
      .then((data) => {
        setCompany({ ...data, bookings: [] });
        setError(null);
      })
      .catch((err: unknown) => {
        if (process.env.NODE_ENV === 'development') {
          setCompany({
            ...mockCompany,
            companyId: Number(companyId),
            members: [mockUser, mockAdmin],
            bookings: [mockBooking],
          });
          setError(null);
        } else {
          setError(err instanceof Error ? err.message : 'Fehler beim Laden der Firmendaten');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [companyId]);

  const refetch = useCallback(() => {
    setIsLoading(true);
    return fetchCompany();
  }, [fetchCompany]);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  return { company, isLoading, error, refetch };
}
