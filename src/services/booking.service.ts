import { apiClient } from './api';
import type {
  TierDto,
  BookingDto,
  CreateBookingRequestDto,
  UpgradeBookingRequestDto,
  UpgradeBookingResponseDto,
} from '@/types/api.types';

/** GET /bookings?eventId=X — Verfügbare Tiers (Pakete) */
export async function getTiers(eventId: number): Promise<{ data: TierDto[] }> {
  return apiClient.get<{ data: TierDto[] }>(`/bookings?eventId=${eventId}`);
}

/** POST /bookings — Tier (Paket) buchen */
export async function createBooking(data: CreateBookingRequestDto): Promise<BookingDto> {
  return apiClient.post<BookingDto>('/bookings', data);
}

/** POST /bookings/:id/upgrade — Standplatz upgraden */
export async function upgradeBooking(
  bookingId: number,
  data: UpgradeBookingRequestDto
): Promise<UpgradeBookingResponseDto> {
  return apiClient.post<UpgradeBookingResponseDto>(`/bookings/${bookingId}/upgrade`, data);
}
