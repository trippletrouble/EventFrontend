import { apiFetch } from './api';
import type { TierDto, BookingDto, CreateBookingRequestDto } from '@/types/api.types';

/** GET /bookings?eventId=X — Verfügbare Tiers (Pakete) */
export async function getTiers(eventId: number): Promise<{ data: TierDto[] }> {
  return apiFetch<{ data: TierDto[] }>(`/bookings?eventId=${eventId}`);
}

/** POST /bookings — Tier (Paket) buchen */
export async function createBooking(data: CreateBookingRequestDto): Promise<BookingDto> {
  return apiFetch<BookingDto>('/bookings', { method: 'POST', body: data });
}
