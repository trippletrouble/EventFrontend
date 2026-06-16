'use client';

import { useState, useEffect, useCallback } from 'react';
import type {
  TierDto,
  BookingDto,
  CreateBookingRequestDto,
  UpgradeBookingRequestDto,
  UpgradeBookingResponseDto,
} from '@/types/api.types';
import * as bookingService from '@/services/booking.service';
import { mockTiers } from '@/__tests__/mocks/data/bookings';

export function useTiers(eventId?: number) {
  const [tiers, setTiers] = useState<TierDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTiers = useCallback(async () => {
    if (!eventId) return;
    setIsLoading(true);
    try {
      const { data } = await bookingService.getTiers(eventId);
      setTiers(data);
      setError(null);
    } catch (err) {
      console.warn('API call failed, falling back to mock data in development:', err);
      if (process.env.NODE_ENV === 'development') {
        setTiers(mockTiers);
        setError(null);
      } else {
        setError(err instanceof Error ? err.message : 'Fehler beim Laden der Pakete');
      }
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  const createBooking = useCallback(async (data: CreateBookingRequestDto): Promise<BookingDto> => {
    setIsLoading(true);
    try {
      const result = await bookingService.createBooking(data);
      setError(null);
      return result;
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('createBooking failed, returning mock booking in development:', err);
        setError(null);
        return {
          bookingId: 1,
          companyId: data.companyId,
          eventId: 1,
          tierId: data.tierId,
          bookedBy: 1,
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      }
      setError(err instanceof Error ? err.message : 'Buchung fehlgeschlagen');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const upgradeBooking = useCallback(
    async (bookingId: number, data: UpgradeBookingRequestDto): Promise<UpgradeBookingResponseDto> => {
      setIsLoading(true);
      try {
        const result = await bookingService.upgradeBooking(bookingId, data);
        setError(null);
        return result;
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('upgradeBooking failed, returning mock upgrade in development:', err);
          setError(null);
          return {
            priceDifference: 35000,
            paymentUrl: 'https://checkout.stripe.com/upgrade_session_123',
          };
        }
        setError(err instanceof Error ? err.message : 'Upgrade fehlgeschlagen');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTiers();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchTiers]);

  return { tiers, isLoading, error, createBooking, upgradeBooking, refetch: fetchTiers };
}
