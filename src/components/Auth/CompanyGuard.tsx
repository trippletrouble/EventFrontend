'use client';

import { useAuth } from '@/app/providers/AuthProvider';

interface CompanyGuardProps {
  companyId: string;
  children: React.ReactNode;
}

export function CompanyGuard({ children }: CompanyGuardProps) {
  const { isAuthenticated, isLoading, login } = useAuth();

  if (isLoading) {
    return (
      <main id="main-content" className="flex justify-center items-center min-h-[50vh]" aria-label="Zugriff wird geprüft">
        <svg className="h-10 w-10 animate-spin text-primary" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </main>
    );
  }

  // if (!isAuthenticated) {
  //   return (
  //     <main id="main-content" className="flex flex-col justify-center items-center min-h-[50vh] gap-4" aria-label="Zugriff verweigert">
  //       <p className="text-foreground-muted">Zugriff verweigert.</p>
  //       <button
  //         onClick={login}
  //         className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary"
  //       >
  //         Jetzt anmelden
  //       </button>
  //     </main>
  //   );
  // }

  return <>{children}</>;
}
