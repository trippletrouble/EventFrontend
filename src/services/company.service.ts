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

/** POST /companies/:id/logo-upload-url — Presigned URL für Logo-Upload anfordern */
export async function getLogoUploadUrl(
  companyId: number,
  filename: string,
  contentType: string
): Promise<{ uploadUrl: string; logoUrl: string }> {
  return apiFetch<{ uploadUrl: string; logoUrl: string }>(`/companies/${companyId}/logo-upload-url`, {
    method: 'POST',
    body: { filename, contentType },
  });
}

/** GET /auth/me — Eigenes Firmenprofil */
export async function getMyCompany(): Promise<CompanyDto> {
  return apiFetch<CompanyDto>('/auth/me');
}
