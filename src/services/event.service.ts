import { apiFetch } from './api';
import type { EventInfoDto, CompanyDto } from '@/types/api.types';

/** GET /events/infos — Event-Info (öffentlich) */
export async function getEventInfo(): Promise<EventInfoDto> {
  return apiFetch<EventInfoDto>('/events/infos');
}

/** GET /events/exhibitors — Ausstellerliste (öffentlich) */
export async function getExhibitors(): Promise<{ data: CompanyDto[] }> {
  return apiFetch<{ data: CompanyDto[] }>('/events/exhibitors');
}
