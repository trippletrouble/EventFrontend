import { apiFetch } from './api';

export async function renewInvitationCode(): Promise<string> {
  return apiFetch<string>('/invitations/renew', { method: 'PATCH' });
}