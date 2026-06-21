'use client';

import type { CompanyDto } from '@/types/api.types';
import { Building2, MapPin, Mail, Check, Clock, X, Star } from 'lucide-react';
import type { ComponentType } from 'react';

interface CompanyProfileProps {
  company: CompanyDto;
}

const statusLabels: Record<string, { label: string; className: string; icon: ComponentType<{ className?: string }> }> = {
  VERIFIED: { label: 'Verifiziert', className: 'bg-success/20 text-success', icon: Check },
  PENDING: { label: 'Ausstehend', className: 'bg-warning/20 text-warning', icon: Clock },
  REJECTED: { label: 'Abgelehnt', className: 'bg-destructive/20 text-destructive', icon: X },
};

export function CompanyProfile({ company }: CompanyProfileProps) {
  const status = statusLabels[company.status] ?? statusLabels.PENDING;

  return (
    <section aria-labelledby="company-profile-heading" className="pb-6 space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-end gap-5">
          <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center bg-brand-blue/10 rounded-sm gap-1">
            <Building2 className="h-10 w-10 text-brand-blue" aria-hidden="true" />
            <span className="text-[11px] font-medium text-brand-blue leading-tight text-center px-1">Ihr Firmenlogo / Profilbild</span>
          </div>
          <h2 id="company-profile-heading" className="text-3xl font-extrabold text-foreground tracking-tight">
            {company.name}
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start mt-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold ${status.className}`}>
            <status.icon className="h-3 w-3" aria-hidden="true" />
            {status.label}
          </span>
          {company.isSponsor && (
            <span className="inline-flex items-center gap-1 bg-warning/20 px-2.5 py-0.5 text-xs font-semibold text-warning">
              <Star className="h-3 w-3" aria-hidden="true" />
              Sponsor
            </span>
          )}
        </div>
      </div>

      <hr className="border-surface-border" aria-hidden="true" />

      <dl className="space-y-3 text-sm">
        <div className="flex items-center gap-3">
          <dt className="sr-only">Adresse</dt>
          <MapPin className="h-4 w-4 text-foreground-muted shrink-0" aria-hidden="true" />
          <dd className="text-foreground-muted">{company.address}, {company.zip} {company.city}</dd>
        </div>
        <div className="flex items-center gap-3">
          <dt className="sr-only">E-Mail</dt>
          <Mail className="h-4 w-4 text-foreground-muted shrink-0" aria-hidden="true" />
          <dd>
            <a href={`mailto:${company.email}`} className="relative text-foreground-link hover:underline focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary after:content-[''] after:absolute after:inset-0 after:min-h-11 after:min-w-11">
              {company.email}
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
