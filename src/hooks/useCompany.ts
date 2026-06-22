'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CompanyDto, BookingDto } from '@/types/api.types';
import { apiFetch } from '@/services/api';
import { mockCompanies, mockCompany, mockPendingCompany, mockSponsorCompany } from '@/__tests__/mocks/data/companies';

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
          console.warn('API call failed, falling back to mock company in development:', err);
          const found = mockCompanies.find(c => String(c.companyId) === String(companyId)) || 
                        [mockCompany, mockPendingCompany, mockSponsorCompany].find(c => String(c.companyId) === String(companyId)) || 
                        mockCompany;
          
          const mockBooking: BookingDto = {
            bookingId: found.companyId * 100,
            companyId: found.companyId,
            eventId: 1,
            tierId: (found.companyId % 4) + 1, // Deterministic tierId (1 to 4)
            bookedBy: 1,
            status: 'CONFIRMED',
            createdAt: '2026-03-15T10:00:00Z',
            updatedAt: '2026-03-15T10:00:00Z',
          };
          
          setCompany({ ...found, bookings: [mockBooking] });
          setError(null);
          return;
        }
        setError(err instanceof Error ? err.message : 'Fehler beim Laden der Firmendaten');
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
