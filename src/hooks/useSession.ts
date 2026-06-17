'use client';

import { useSessionContext } from '@/providers/SessionProvider';
import type { UserRole } from '@/types/common.types';

/**
 * Convenience-Hook für Session-Zugriff.
 * Leitet an SessionContext weiter + bietet role-checks.
 */
export function useSession() {
  const context = useSessionContext();

  return {
    ...context,
    isAdmin: context.user?.role === 'ADMIN' as UserRole,
    isCompanyUser: context.user?.role === 'COMPANY_USER' as UserRole,
  };
}
