'use client';

import { use, useState, useEffect } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { useTiers } from '@/hooks/useTiers';
import { CompanyProfile } from '@/components/Company/CompanyProfile';
import { MemberList } from '@/components/Company/MemberList';
import { BookingStatus } from '@/components/Company/BookingStatus';
import { InvitationCode } from '@/components/Company/InvitationCode';
import { useSession } from '@/hooks/useSession';
import { cn } from '@/utils/cn';

type Props = {
  params: Promise<{ id: string }>;
};

export default function CompanyPage({ params }: Props) {
  const { id } = use(params);
  const { company, isLoading, error, refetch } = useCompany(id);
  const { tiers } = useTiers(company?.bookings[0]?.eventId);

  const { user, isAuthenticated, isAdmin } = useSession();
  const [currentUserCompanyId, setCurrentUserCompanyId] = useState<number | null>(null);
  const [simulatedRole, setSimulatedRole] = useState<'owner' | 'guest' | 'session'>('session');

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      import('@/services/company.service')
        .then((m) => m.getMyCompany())
        .then((comp) => {
          if (comp?.companyId) {
            setCurrentUserCompanyId(comp.companyId);
          }
        })
        .catch((err) => {
          console.error('Failed to load user company:', err);
        });
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCurrentUserCompanyId(null);
    }
  }, [isAuthenticated, isAdmin]);

  if (isLoading) {
    return (
      <main id="main-content" tabIndex={-1} className="flex justify-center items-center min-h-[50vh] pt-28 bg-surface" aria-label="Firmenprofil wird geladen">
        <svg className="h-10 w-10 animate-spin text-primary" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </main>
    );
  }

  if (error || !company) {
    return (
      <main id="main-content" tabIndex={-1} className="container mx-auto px-4 pt-28 pb-8 max-w-6xl bg-surface" aria-label="Fehler">
        <div className="border border-destructive/30 bg-destructive/10 p-6 text-center" role="alert">
          <p className="text-sm text-destructive">{error ?? 'Firma nicht gefunden.'}</p>
        </div>
      </main>
    );
  }

  const isMember = !!company.members?.some((m) => m.userId === user?.userId);
  const isSessionOwner = !!(isAdmin || (isAuthenticated && (currentUserCompanyId === company.companyId || isMember)));

  let isWritable = false;
  if (simulatedRole === 'owner') {
    isWritable = true;
  } else if (simulatedRole === 'guest') {
    isWritable = false;
  } else {
    isWritable = isSessionOwner;
  }

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-surface pt-28 pb-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Real-time Role Simulator bar */}
        <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <p className="text-xs font-bold text-amber-500 uppercase tracking-wider">Rollen-Simulator</p>
            <p className="text-xs text-zinc-400">Tauschen Sie die Ansicht, um die Seite als berechtigter Partner oder externer Gast zu testen.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSimulatedRole('owner')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border focus:outline-none focus:ring-2 focus:ring-amber-500",
                simulatedRole === 'owner'
                  ? "bg-amber-500 border-amber-500 text-black shadow-md font-extrabold"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
              )}
            >
              Firma & Admin (Editierrechte)
            </button>
            <button
              type="button"
              onClick={() => setSimulatedRole('guest')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border focus:outline-none focus:ring-2 focus:ring-amber-500",
                simulatedRole === 'guest'
                  ? "bg-amber-500 border-amber-500 text-black shadow-md font-extrabold"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
              )}
            >
              Nicht angemeldet / Gast (Schreibgeschützt)
            </button>
            <button
              type="button"
              onClick={() => setSimulatedRole('session')}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all border focus:outline-none focus:ring-2 focus:ring-amber-500",
                simulatedRole === 'session'
                  ? "bg-amber-500 border-amber-500 text-black shadow-md font-extrabold"
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
              )}
            >
              System-Session ({isSessionOwner ? 'Partner' : 'Gast'})
            </button>
          </div>
        </div>

        <h1 className="text-sm font-semibold text-foreground-muted tracking-wide font-(family-name:--font-lexend)">
          {isWritable ? 'Ihr Firmenprofil' : 'Aussteller-Profil'}
        </h1>

        <CompanyProfile company={company} onUpdate={refetch} isWritable={isWritable} />

        <div className={cn(
          "grid grid-cols-1 gap-8",
          isWritable ? "lg:grid-cols-3" : "lg:grid-cols-1 max-w-2xl mx-auto w-full"
        )}>
          {isWritable && <BookingStatus bookings={company.bookings} tiers={tiers} />}
          {isWritable && company.inviteCode && <InvitationCode code={company.inviteCode} />}
          <MemberList members={company.members ?? []} isWritable={isWritable} />
        </div>
      </div>
    </main>
  );
}
