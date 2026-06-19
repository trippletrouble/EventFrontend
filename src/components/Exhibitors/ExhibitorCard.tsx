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

const getCategoryStyles = (category: string) => {
  switch (category) {
    case 'IT & Software':
      return 'bg-blue-500/10 text-blue-500 border border-blue-500/20';
    case 'Industrie & Maschinenbau':
      return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20';
    case 'Gesundheitswesen & Soziales':
      return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    case 'Versicherungen & Finanzen':
      return 'bg-red-500/10 text-red-500 border border-red-500/20';
    case 'Logistik & Transport':
      return 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20';
    case 'Öffentlicher Dienst':
      return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
    default:
      return 'bg-foreground-muted/10 text-foreground-muted border border-foreground-muted/20';
  }
};

export function ExhibitorCard({ exhibitor }: ExhibitorCardProps) {
  const category = getCompanyCategory(exhibitor);
  const initial = exhibitor.name.trim().charAt(0).toUpperCase();
  const gradientClass = getGradientByName(exhibitor.name);

  return (
    <article
      className={`bg-surface-raised border-2 rounded-xl p-8 flex flex-col justify-between shadow-md transition-all duration-200 relative group min-h-[250px] ${
        exhibitor.isSponsor
          ? 'border-primary shadow-xl scale-[1.01] ring-1 ring-primary/10'
          : 'border-surface-border hover:border-primary/40 hover:scale-[1.01] hover:shadow-lg'
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

      <div className="space-y-5">
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
              className="text-lg font-extrabold text-foreground line-clamp-1 group-hover:text-primary transition-colors"
            >
              {exhibitor.name}
            </h2>
            <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full ${getCategoryStyles(category)}`}>
              <Building2 className="w-3.5 h-3.5" aria-hidden="true" />
              {category}
            </span>
          </div>
        </div>

        {/* Info list */}
        <div className="space-y-2.5 text-sm text-foreground-muted border-t border-surface-border/40 pt-4">
          <div className="flex items-start gap-2.5">
            <MapPin className="w-4 h-4 shrink-0 text-foreground-muted/65 mt-0.5" aria-hidden="true" />
            <span>
              {exhibitor.address}, {exhibitor.zip} {exhibitor.city}
            </span>
          </div>
          <div className="flex items-start gap-2.5">
            <Mail className="w-4 h-4 shrink-0 text-foreground-muted/65 mt-0.5" aria-hidden="true" />
            <span className="break-all">{exhibitor.email}</span>
          </div>
        </div>
      </div>

      {/* Button link */}
      <div className="pt-6">
        <Link
          href={`/company/${exhibitor.companyId}`}
          className={`inline-flex items-center justify-center gap-2 w-full h-11 px-4 text-sm rounded-lg transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 outline-none ${
            exhibitor.isSponsor
              ? 'bg-primary text-black font-bold hover:scale-[1.04] hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(234,179,8,0.45)] border-2 border-transparent'
              : 'bg-surface-overlay border-2 border-surface-border text-foreground font-semibold hover:border-primary/50 hover:bg-surface-overlay/85 hover:scale-[1.01] hover:shadow-md'
          }`}
          aria-label={`Profil von ${exhibitor.name} ansehen`}
        >
          <span>Profil ansehen</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default ExhibitorCard;
