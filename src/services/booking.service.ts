import { apiFetch } from './api';
import type {
  TierDto,
  BookingDto,
  CreateBookingRequestDto,
  UpgradeBookingRequestDto,
  UpgradeBookingResponseDto,
} from '@/types/api.types';

/** GET /bookings?eventId=X — Verfügbare Tiers (Pakete) */
export async function getTiers(eventId: number): Promise<{ data: TierDto[] }> {
  return apiFetch<{ data: TierDto[] }>(`/bookings?eventId=${eventId}`);
}

/** POST /bookings — Tier (Paket) buchen */
export async function createBooking(data: CreateBookingRequestDto): Promise<BookingDto> {
  return apiFetch<BookingDto>('/bookings', { method: 'POST', body: data });
}

/** POST /bookings/:id/upgrade — Standplatz upgraden */
export async function upgradeBooking(
  bookingId: number,
  data: UpgradeBookingRequestDto
): Promise<UpgradeBookingResponseDto> {
  return apiFetch<UpgradeBookingResponseDto>(`/bookings/${bookingId}/upgrade`, {
    method: 'POST',
    body: data,
  });
}
