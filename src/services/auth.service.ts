import { apiClient } from './api';
import type { UserDto } from '@/types/api.types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3100';

/**
 * Redirect zu Keycloak OIDC Login.
 * Kein fetch — direkter Browser-Redirect.
 */
export function redirectToLogin(): void {
  window.location.href = `${API_URL}/auth/oauth`;
}

/**
 * Aktuelle Session vom Backend holen.
 * GET /auth/session → UserDto
 * Wirft ApiError bei 401 (nicht eingeloggt).
 */
export async function getSession(): Promise<UserDto> {
  return apiClient.get<UserDto>('/auth/session');
}

/**
 * Session beenden.
 * POST /auth/logout → 204
 */
export async function logout(): Promise<void> {
  await apiClient.post<void>('/auth/logout');
}
