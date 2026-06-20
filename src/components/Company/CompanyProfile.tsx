'use client';

import type { CompanyDto } from '@/types/api.types';
import { Building2, MapPin, Mail, Check, Star } from 'lucide-react';

interface CompanyProfileProps {
  company: CompanyDto;
}

const statusLabels: Record<string, { label: string; className: string }> = {
  VERIFIED: { label: 'Verifiziert', className: 'bg-emerald-100 text-emerald-700' },
  PENDING: { label: 'Ausstehend', className: 'bg-amber-100 text-amber-700' },
  REJECTED: { label: 'Abgelehnt', className: 'bg-red-100 text-red-700' },
};

export function CompanyProfile({ company }: CompanyProfileProps) {
  const status = statusLabels[company.status] ?? statusLabels.PENDING;

  return (
    <section aria-labelledby="company-profile-heading" className="bg-white pb-6 space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-end gap-5">
          <div className="flex h-28 w-28 shrink-0 flex-col items-center justify-center bg-[#2860F9]/10 rounded-sm gap-1">
            <Building2 className="h-10 w-10 text-[#2860F9]" aria-hidden="true" />
            <span className="text-[9px] font-medium text-[#2860F9] leading-tight text-center px-1">Ihr Firmenlogo / Profilbild</span>
          </div>
          <h2 id="company-profile-heading" className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {company.name}
          </h2>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start mt-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold ${status.className}`}>
            <Check className="h-3 w-3" aria-hidden="true" />
            {status.label}
          </span>
          {company.isSponsor && (
            <span className="inline-flex items-center gap-1 bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
              <Star className="h-3 w-3" aria-hidden="true" />
              Sponsor
            </span>
          )}
        </div>
      </div>

      <hr className="border-[#2860F9]/20" aria-hidden="true" />

      <dl className="space-y-3 text-sm">
        <div className="flex items-center gap-3">
          <dt className="sr-only">Adresse</dt>
          <MapPin className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
          <dd className="text-slate-700">{company.address}, {company.zip} {company.city}</dd>
        </div>
        <div className="flex items-center gap-3">
          <dt className="sr-only">E-Mail</dt>
          <Mail className="h-4 w-4 text-slate-400 shrink-0" aria-hidden="true" />
          <dd>
            <a href={`mailto:${company.email}`} className="text-[#2860F9] hover:underline focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary">
              {company.email}
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
