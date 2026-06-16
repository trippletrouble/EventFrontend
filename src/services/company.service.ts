import { apiFetch } from './api';
import type {
  CompanyDto,
  RegisterCompanyRequestDto,
  UpdateCompanyRequestDto,
} from '@/types/api.types';

/** POST /companies — Firma registrieren */
export async function registerCompany(data: RegisterCompanyRequestDto): Promise<CompanyDto> {
  return apiFetch<CompanyDto>('/companies', { method: 'POST', body: data });
}

/** GET /companies/:id — Firma abrufen */
export async function getCompany(companyId: number): Promise<CompanyDto> {
  return apiFetch<CompanyDto>(`/companies/${companyId}`);
}

/** PATCH /companies/:id — Firma aktualisieren */
export async function updateCompany(companyId: number, data: UpdateCompanyRequestDto): Promise<CompanyDto> {
  return apiFetch<CompanyDto>(`/companies/${companyId}`, { method: 'PATCH', body: data });
}

/** GET /auth/me — Eigenes Firmenprofil */
export async function getMyCompany(): Promise<CompanyDto> {
  return apiFetch<CompanyDto>('/auth/me');
}
