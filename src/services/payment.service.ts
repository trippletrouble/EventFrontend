import { apiFetch } from './api';
import type { CheckoutRequestDto, CheckoutResponseDto } from '@/types/api.types';

/** POST /payments/checkout — Stripe Checkout starten */
export async function createCheckout(data: CheckoutRequestDto): Promise<CheckoutResponseDto> {
  return apiFetch<CheckoutResponseDto>('/payments/checkout', { method: 'POST', body: data });
}
