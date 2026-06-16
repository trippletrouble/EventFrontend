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
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Pakete');
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
