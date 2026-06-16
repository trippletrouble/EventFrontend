'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TierDto } from '@/types/api.types';
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

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTiers();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchTiers]);

  return { tiers, isLoading, error, refetch: fetchTiers };
}
