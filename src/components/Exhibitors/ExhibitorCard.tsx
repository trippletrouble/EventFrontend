import React from 'react';
import Link from 'next/link';
import type { CompanyDto } from '@/types/api.types';
import { getCompanyCategory } from '@/hooks/useExhibitors';
import { MapPin, Tag, Star } from 'lucide-react';

interface ExhibitorCardProps {
  exhibitor: CompanyDto;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onCategoryClick?: (category: string) => void;
}

// Map company names to their SVG file paths from landing-page-integration
const LOGO_MAPPINGS: Record<string, string> = {
  'netzsch': '/logos/netzsch.svg',
  'lamilux': '/logos/lamilux.svg',
  'sandler': '/logos/sandler.svg',
  'dennree': '/logos/dennree.png',
  'bundeswehr': '/logos/bundeswehr.svg',
  'agentur für arbeit': '/logos/agentur-fuer-arbeit.svg',
  'aok': '/logos/aok.svg',
  'techniker krankenkasse': '/logos/techniker-krankenkasse.svg',
  'huk-coburg': '/logos/huk-coburg.svg',
  'viessmann': '/logos/viessmann.svg',
  'gebrüder weiss': '/logos/gebrueder-weiss.svg',
  'nkd': '/logos/nkd.svg',
  'hetzner': '/logos/hetzner.svg',
  'wilo': '/logos/wilo.svg',
  'enterprise': '/logos/enterprise.svg',
  'ceramtec': '/logos/ceramtec.svg',
};

export function getCompanyLogo(name: string): string | undefined {
  const normalized = name.toLowerCase().trim();
  for (const [key, val] of Object.entries(LOGO_MAPPINGS)) {
    if (normalized.includes(key)) {
      return val;
    }
  }
  return undefined;
}

// Generate a deterministic gradient for initials fallback
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

export function ExhibitorCard({ exhibitor, index, isFavorite, onToggleFavorite, onCategoryClick }: ExhibitorCardProps) {
  const logoSrc = getCompanyLogo(exhibitor.name);
  const initial = exhibitor.name.trim().charAt(0).toUpperCase();
  const gradientClass = getGradientByName(exhibitor.name);
  const category = getCompanyCategory(exhibitor);

  return (
    <div
      className={`group/row p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-200 relative ${
        index % 2 === 0 ? 'bg-surface' : 'bg-surface-raised'
      } hover:bg-surface-overlay ${
        exhibitor.isSponsor ? 'border-l-4 border-[#EAB308]' : ''
      }`}
      role="listitem"
      aria-labelledby={`exhibitor-title-${exhibitor.companyId}`}
    >
      {/* Linke Spalte: Logo & Name */}
      <div className="flex items-center gap-4 min-w-[260px] max-w-sm flex-1 pr-12 sm:pr-0">
        <Link 
          href={`/company/${exhibitor.companyId}`} 
          className="shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary block"
          aria-label={`Profil von ${exhibitor.name} ansehen`}
        >
          <div className="relative shrink-0 select-none">
            {/* Dynamic offset highlight box on row hover for all logos */}
            <div 
              className="absolute left-0 top-0 w-16 h-16 bg-primary transition-all duration-200 group-hover/row:-left-1.5 group-hover/row:top-1.5" 
              style={{ zIndex: 0 }}
              aria-hidden="true" 
            />
            <div 
              className={`relative w-16 h-16 bg-white flex items-center justify-center p-2 shadow-sm overflow-hidden transition-all duration-300 ${
                exhibitor.isSponsor
                  ? 'border-2 border-amber-400 shadow-[0_0_12px_rgba(234,179,8,0.45)] ring-1 ring-amber-400'
                  : 'border-2 border-surface-border'
              }`}
              style={{ zIndex: 1 }}
            >
              {logoSrc ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={logoSrc}
                  alt={`${exhibitor.name} Logo`}
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${gradientClass} flex items-center justify-center font-black text-xl shadow-inner`}
                  role="img"
                  aria-label={`Platzhalter-Logo von ${exhibitor.name}`}
                >
                  {initial}
                </div>
              )}
            </div>
          </div>
        </Link>

        <div className="space-y-1">
          <h2
            id={`exhibitor-title-${exhibitor.companyId}`}
            className="text-base font-bold text-foreground flex items-center gap-1.5 flex-wrap"
          >
            <Link 
              href={`/company/${exhibitor.companyId}`} 
              className="hover:text-primary hover:underline transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary truncate"
            >
              {exhibitor.name}
            </Link>
          </h2>
          {/* Subtle responsive info for mobile screens */}
          <div className="sm:hidden flex flex-wrap gap-x-3 gap-y-1 text-xs text-foreground-muted">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-foreground-muted/65" />
              {exhibitor.city}
            </span>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onCategoryClick?.(category);
              }}
              className="inline-flex items-center gap-1 text-xs text-foreground-muted hover:text-primary transition-colors focus-visible:ring-1 focus-visible:ring-primary outline-none cursor-pointer group/cat text-left"
              title={`Nach ${category} filtern`}
              type="button"
            >
              <Tag className="w-3.5 h-3.5 text-foreground-muted/65 group-hover/cat:text-primary transition-colors" />
              <span className="hover:underline">{category}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spalte: Standort */}
      <div className="hidden sm:flex items-center gap-2 text-sm text-foreground-muted w-44">
        <MapPin className="w-4 h-4 shrink-0 text-foreground-muted/60" aria-hidden="true" />
        <span className="truncate">{exhibitor.city}</span>
      </div>

      {/* Spalte: Branche */}
      <div className="hidden sm:flex items-center w-52">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onCategoryClick?.(category);
          }}
          className="inline-flex items-center gap-2 text-sm text-foreground-muted hover:text-primary transition-colors focus-visible:ring-1 focus-visible:ring-primary outline-none cursor-pointer group/cat text-left"
          title={`Nach ${category} filtern`}
          type="button"
        >
          <Tag className="w-4 h-4 shrink-0 text-foreground-muted/60 group-hover/cat:text-primary transition-colors" aria-hidden="true" />
          <span className="line-clamp-2 hover:underline">{category}</span>
        </button>
      </div>

      {/* Rechte Spalte: Favoriten-Stern */}
      <div className="absolute right-3 top-3 sm:relative sm:right-auto sm:top-auto flex items-center justify-end shrink-0">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleFavorite();
          }}
          className="inline-flex items-center justify-center h-11 w-11 text-foreground-muted hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary outline-none cursor-pointer"
          aria-label={isFavorite ? `${exhibitor.name} aus Favoriten entfernen` : `${exhibitor.name} als Favorit markieren`}
          type="button"
        >
          <Star
            className={`w-6 h-6 transition-all duration-150 ${
              isFavorite ? 'text-primary fill-primary scale-110' : 'text-foreground-muted/60 hover:scale-110'
            }`}
            aria-hidden="true"
          />
        </button>
      </div>
    </div>
  );
}

export default ExhibitorCard;
