import React from 'react';
import Link from 'next/link';
import type { CompanyDto } from '@/types/api.types';
import { getCompanyCategory } from '@/hooks/useExhibitors';
import { Building2, Mail, MapPin, ArrowRight } from 'lucide-react';

interface ExhibitorCardProps {
  exhibitor: CompanyDto;
}

// Generate a visually pleasing, deterministic gradient for initials badge
const getGradientByName = (name: string) => {
  const gradients = [
    'from-yellow-400 to-amber-500 text-black',
    'from-emerald-400 to-teal-500 text-black',
    'from-blue-400 to-indigo-500 text-white',
    'from-rose-400 to-pink-500 text-white',
    'from-purple-400 to-violet-500 text-white',
    'from-cyan-400 to-sky-500 text-black',
  ];
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return gradients[sum % gradients.length];
};

export function ExhibitorCard({ exhibitor }: ExhibitorCardProps) {
  const category = getCompanyCategory(exhibitor);
  const initial = exhibitor.name.trim().charAt(0).toUpperCase();
  const gradientClass = getGradientByName(exhibitor.name);

  return (
    <article
      className={`bg-surface-raised border rounded-xl p-6 flex flex-col justify-between shadow-md transition-all duration-200 hover:shadow-lg hover:border-primary/40 relative group ${
        exhibitor.isSponsor ? 'border-primary/30 ring-1 ring-primary/10' : 'border-surface-border'
      }`}
      aria-labelledby={`exhibitor-title-${exhibitor.companyId}`}
    >
      {/* Sponsor Ribbon */}
      {exhibitor.isSponsor && (
        <div className="absolute top-3 right-3">
          <span 
            className="bg-primary/10 text-primary text-xs font-bold px-2.5 py-1 rounded-full border border-primary/20 shadow-sm"
            aria-label="Sponsor Status: Freunde & Förderer"
          >
            Freunde & Förderer
          </span>
        </div>
      )}

      <div className="space-y-4">
        {/* Logo / Initials Badge & Name */}
        <div className="flex items-center gap-4">
          <div
            className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center font-black text-xl shadow-inner select-none shrink-0`}
            role="img"
            aria-label={`Logo von ${exhibitor.name}`}
          >
            {initial}
          </div>

          <div className="space-y-1 pr-12">
            <h2 
              id={`exhibitor-title-${exhibitor.companyId}`}
              className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors"
            >
              {exhibitor.name}
            </h2>
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/15">
              <Building2 className="w-3 h-3" aria-hidden="true" />
              {category}
            </span>
          </div>
        </div>

        {/* Info list */}
        <div className="space-y-2 text-sm text-foreground-muted">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 shrink-0 text-foreground-muted/60 mt-0.5" aria-hidden="true" />
            <span>
              {exhibitor.address}, {exhibitor.zip} {exhibitor.city}
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <Mail className="w-4 h-4 shrink-0 text-foreground-muted/60 mt-0.5" aria-hidden="true" />
            <span className="break-all">{exhibitor.email}</span>
          </div>
        </div>
      </div>

      {/* Button link */}
      <div className="pt-6">
        <Link
          href={`/company/${exhibitor.companyId}`}
          className="inline-flex items-center justify-center gap-2 w-full h-11 px-4 text-sm font-semibold rounded-lg bg-surface-overlay hover:bg-primary hover:text-black border border-surface-border hover:border-transparent transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none"
          aria-label={`Profil von ${exhibitor.name} ansehen`}
        >
          <span>Profil ansehen</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default ExhibitorCard;
