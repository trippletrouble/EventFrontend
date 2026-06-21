'use client';

import { use } from 'react';
import { useCompany } from '@/hooks/useCompany';
import { CompanyProfile } from '@/components/Company/CompanyProfile';
import { MemberList } from '@/components/Company/MemberList';
import { BookingStatus } from '@/components/Company/BookingStatus';
import { InvitationCode } from '@/components/Company/InvitationCode';

type Props = {
  params: Promise<{ id: string }>;
};

export default function CompanyPage({ params }: Props) {
  const { id } = use(params);
  const { company, isLoading, error } = useCompany(id);

  if (isLoading) {
    return (
      <main id="main-content" className="flex justify-center items-center min-h-[50vh] bg-surface" aria-label="Firmenprofil wird geladen">
        <svg className="h-10 w-10 animate-spin text-primary" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </main>
    );
  }

  if (error || !company) {
    return (
      <main id="main-content" className="container mx-auto px-4 py-8 max-w-6xl bg-surface" aria-label="Fehler">
        <div className="border border-destructive/30 bg-destructive/10 p-6 text-center" role="alert">
          <p className="text-sm text-destructive">{error ?? 'Firma nicht gefunden.'}</p>
        </div>
      </main>
    );
  }

  return (
    <main id="main-content" className="min-h-screen bg-surface py-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h1 className="text-sm font-semibold text-foreground-muted tracking-wide font-(family-name:--font-lexend)">Ihr Firmenprofil</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <CompanyProfile company={company} />
            <BookingStatus bookings={company.bookings} />
          </div>
          <div className="lg:col-span-1 lg:border-l-4 lg:border-surface-border lg:pl-8 lg:ml-4 space-y-8">
            {company.inviteCode && <InvitationCode code={company.inviteCode} />}
            <MemberList members={company.members ?? []} />
          </div>
        </div>
      </div>
    </main>
  );
}
