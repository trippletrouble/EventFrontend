'use client';

import type { CompanyDto } from '@/types/api.types';
import { Building2, MapPin, Mail, Check, Clock, X, Star } from 'lucide-react';
import type { ComponentType } from 'react';

const statusLabels: Record<string, { label: string; className: string; icon: ComponentType<{ className?: string }> }> = {
  VERIFIED: { label: 'Verifiziert', className: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20', icon: Check },
  PENDING: { label: 'Ausstehend', className: 'bg-amber-500/10 text-amber-400 border border-amber-500/20', icon: Clock },
  REJECTED: { label: 'Abgelehnt', className: 'bg-red-500/10 text-red-400 border border-red-500/20', icon: X },
};

export function CompanyProfile({ company }: CompanyProfileProps) {
  const status = statusLabels[company.status] ?? statusLabels.PENDING;

  return (
    <section
      aria-labelledby="company-profile-heading"
      className="bg-surface-raised border border-surface-border rounded-xl p-6 md:p-8 shadow-xl relative overflow-hidden space-y-6"
    >

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="flex h-24 w-24 md:h-28 md:w-28 shrink-0 flex-col items-center justify-center bg-surface border border-surface-border rounded-xl gap-1 transition-all duration-300 hover:border-[#EAB308]/40 group shadow-inner relative overflow-hidden">
            <Building2 className="h-10 w-10 text-[#EAB308] group-hover:scale-105 transition-transform duration-300" aria-hidden="true" />
            <span className="text-[10px] font-medium text-zinc-400 leading-tight text-center px-1">Ihr Firmenlogo / Profilbild</span>
          </div>
          <div className="space-y-2">
            <h2 id="company-profile-heading" className="text-2xl md:text-3xl font-extrabold text-white tracking-tight font-sans">
              {company.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider border ${status.className}`}>
                <status.icon className="h-3.5 w-3.5" aria-hidden="true" />
                {status.label}
              </span>
              {company.isSponsor && (
                <span className="inline-flex items-center gap-1.5 bg-[#EAB308]/10 px-3 py-1 rounded-full text-xs font-semibold text-[#EAB308] border border-[#EAB308]/20">
                  <Star className="h-3.5 w-3.5 fill-[#EAB308]/20" aria-hidden="true" />
                  Sponsor
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <hr className="border-surface-border" aria-hidden="true" />

      <dl className="flex flex-col md:flex-row md:items-center gap-y-3 gap-x-8 text-sm">
        <div className="flex items-center gap-3">
          <dt className="flex items-center">
            <span className="sr-only">Adresse</span>
            <span className="p-1.5 rounded-lg bg-surface border border-surface-border text-[#EAB308] inline-flex">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
            </span>
          </dt>
          <dd className="text-zinc-300">{company.address}, {company.zip} {company.city}</dd>
        </div>

        <div className="flex items-center gap-3">
          <dt className="flex items-center">
            <span className="sr-only">E-Mail</span>
            <span className="p-1.5 rounded-lg bg-surface border border-surface-border text-[#EAB308] inline-flex">
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
            </span>
          </dt>
          <dd>
            <a
              href={`mailto:${company.email}`}
              className="relative text-[#3B82F6] hover:text-[#3B82F6]/80 font-medium hover:underline focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-primary after:content-[''] after:absolute after:inset-0 after:min-h-11 after:min-w-11 break-all"
            >
              {company.email}
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}

interface CompanyProfileProps {
  company: CompanyDto;
}
