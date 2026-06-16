import { apiFetch } from './api';
import type { TierDto } from '@/types/api.types';

/** GET /bookings?eventId=X — Verfügbare Tiers (Pakete) */
export async function getTiers(eventId: number): Promise<{ data: TierDto[] }> {
  return apiFetch<{ data: TierDto[] }>(`/bookings?eventId=${eventId}`);
}
