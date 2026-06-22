'use client';

import { useState, useEffect, useCallback } from 'react';
import type { CompanyDto, BookingDto } from '@/types/api.types';
import { apiFetch } from '@/services/api';
import { mockCompanies, mockCompany, mockPendingCompany, mockSponsorCompany } from '@/__tests__/mocks/data/companies';
import { getCompanyLogo } from '@/components/Exhibitors/ExhibitorCard';

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
        const tierMap: Record<number, number> = {
          1: 1, 10: 4, 11: 2, 12: 3, 13: 1, 14: 2, 20: 3, 21: 4, 22: 2, 23: 1,
          30: 4, 31: 3, 32: 2, 40: 1, 50: 4, 51: 2, 52: 3, 53: 1, 60: 3, 61: 1,
          70: 2, 72: 4,
        };
        const tierId = tierMap[data.companyId] ?? ((data.companyId % 4) + 1);
        const bookings = (data as CompanyDto & { bookings?: BookingDto[] }).bookings || [
          {
            bookingId: data.companyId * 100,
            companyId: data.companyId,
            eventId: 1,
            tierId,
            bookedBy: 1,
            status: 'CONFIRMED',
            createdAt: '2026-03-15T10:00:00Z',
            updatedAt: '2026-03-15T10:00:00Z',
          }
        ];
        setCompany({
          ...data,
          logoUrl: data.logoUrl || getCompanyLogo(data.name),
          bookings,
        } as CompanyData);
        setError(null);
      })
      .catch((err: unknown) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('API call failed, falling back to mock company in development:', err);
          const found = mockCompanies.find(c => String(c.companyId) === String(companyId)) || 
                        [mockCompany, mockPendingCompany, mockSponsorCompany].find(c => String(c.companyId) === String(companyId)) || 
                        mockCompany;
          
          // Explicit mapping for various mock companies to ensure realistic and varied booking tiers
          const tierMap: Record<number, number> = {
            1: 1,  // Test GmbH -> Basis
            10: 4, // SAP -> Premium Deluxe
            11: 2, // DATEV -> Basis Plus
            12: 3, // Hetzner -> Premium
            13: 1, // adesso -> Basis
            14: 2, // NeoIT -> Basis Plus
            20: 3, // AOK Bayern -> Premium
            21: 4, // Techniker KK -> Premium Deluxe
            22: 2, // Klinikum Hof -> Basis Plus
            23: 1, // Diakonie -> Basis
            30: 4, // Gebrüder Weiss -> Premium Deluxe
            31: 3, // DHL -> Premium
            32: 2, // Schenker -> Basis Plus
            40: 1, // HUK-Coburg -> Basis
            50: 4, // Wilo -> Premium Deluxe
            51: 2, // NETZSCH -> Basis Plus
            52: 3, // Lamilux -> Premium
            53: 1, // Sandler -> Basis
            60: 3, // Bundeswehr -> Premium
            61: 1, // Agentur für Arbeit -> Basis
            70: 2, // Dennree -> Basis Plus
            72: 4, // Enterprise -> Premium Deluxe
          };
          const tierId = tierMap[found.companyId] ?? ((found.companyId % 4) + 1);

          const mockBooking: BookingDto = {
            bookingId: found.companyId * 100,
            companyId: found.companyId,
            eventId: 1,
            tierId,
            bookedBy: 1,
            status: 'CONFIRMED',
            createdAt: '2026-03-15T10:00:00Z',
            updatedAt: '2026-03-15T10:00:00Z',
          };
          
          const companyWithLogo = {
            ...found,
            logoUrl: found.logoUrl || getCompanyLogo(found.name),
            bookings: [mockBooking],
          };
          
          setCompany(companyWithLogo);
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
