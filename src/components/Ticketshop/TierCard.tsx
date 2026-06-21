'use client';

import type { TierDto } from '@/types/api.types';
import { Button } from '@/components/UI';
import { Ticket, Sparkles, Crown, Gem } from 'lucide-react';

interface TierCardProps {
  tier: TierDto;
  isSponsor: boolean;
  onSelect: (id: number) => void;
  isSelected?: boolean;
  disabled?: boolean;
}

const tierContent = {
  1: {
    title: 'Basis Ticket',
    textColor: 'text-yellow-500',
    borderColor: 'border-yellow-500',
    btnStyles: 'bg-[#EAB308] text-black hover:bg-[#EAB308]/90 border-transparent font-bold',
    icon: Ticket,
  },
  2: {
    title: 'Basis Plus Ticket',
    textColor: 'text-blue-500 border-blue-500',
    borderColor: 'border-blue-500',
    btnStyles: 'bg-blue-600 text-white hover:bg-blue-700 border-transparent font-semibold',
    icon: Sparkles,
  },
  3: {
    title: 'Premium Ticket',
    textColor: 'text-red-500 border-red-500',
    borderColor: 'border-red-500',
    btnStyles: 'bg-red-500 text-white hover:bg-red-600 border-transparent font-semibold',
    icon: Crown,
  },
  4: {
    title: 'Premium Deluxe Ticket',
    textColor: 'text-emerald-400 border-emerald-400',
    borderColor: 'border-emerald-400',
    btnStyles: 'bg-emerald-400 text-black hover:bg-emerald-500 border-transparent font-bold',
    icon: Gem,
  },
};

/** Tier/Paket-Karte zur Auswahl auf der Buchungsseite */
export function TierCard({
  tier,
  isSponsor,
  onSelect,
  isSelected = false,
  disabled = false,
}: TierCardProps) {
  const config = tierContent[tier.tierId as keyof typeof tierContent] || {
    title: `Paket #${tier.tierId}`,
    textColor: 'text-primary',
    borderColor: 'border-surface-border',
    btnStyles: 'bg-primary text-primary-foreground',
    icon: Ticket,
  };

  const isBtnDisabled = disabled || !tier.available;
  const buttonText = !tier.available
    ? 'Ausverkauft'
    : isSelected
    ? 'Ausgewählt'
    : 'Ticket kaufen →';

  const standardPrice = tier.basePrice / 100;
  const discountAmount = (tier.basePrice * tier.sponsorDiscountPercent) / 100;
  const sponsorPrice = (tier.basePrice - discountAmount) / 100;

  // Dynamically extract the Messestand info from features if present
  const features = tier.features || [];
  const standFeature = features.find(
    (f) => f.toLowerCase().includes('messestand') || f.toLowerCase().includes('m²')
  );
  const bullets = features.filter((f) => f !== standFeature);

  // Enhance stand feature text to match mockup wording
  let standInfo = '';
  if (standFeature) {
    if (standFeature.toLowerCase().includes('3m²')) {
      standInfo = 'Ein Messestand mit 3m² im Lagebereich 2';
    } else if (standFeature.toLowerCase().includes('6m²')) {
      standInfo =
        tier.tierId === 2
          ? 'Ein Messestand mit 6m² im Lagebereich 2'
          : 'Ein Messestand mit 6m² im Lagebereich 1';
    } else {
      standInfo = `Ein ${standFeature}`;
    }
  }

  return (
    <div
      className={`p-8 bg-surface-raised transition-all duration-200 flex flex-col md:flex-row justify-between items-start md:items-stretch gap-6 relative ${config.borderColor} ${
        isSelected ? 'border-[6px] rounded-none shadow-xl scale-[1.01]' : 'border-2 rounded-md'
      }`}
    >
      {/* Linke Seite: Details & Features */}
      <div className="flex-1 space-y-4">
        <div>
          <h3 className={`text-2xl font-bold ${config.textColor} flex items-center gap-2`}>
            <config.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
            <span>{config.title}</span>
          </h3>
          <p className="text-xs text-foreground-muted mt-1">
            Dieses Ticket beinhaltet folgende Leistungen:
          </p>
          {standInfo && (
            <p className="text-sm font-bold text-foreground mt-2">
              {standInfo}
            </p>
          )}
        </div>
        <ul className="space-y-1.5 list-disc list-inside text-sm text-foreground-muted">
          {bullets.map((feature, idx) => (
            <li key={idx} className="marker:text-current">
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Rechte Seite: Preis & Button */}
      <div className="flex flex-col justify-between items-end min-w-[200px] self-stretch text-right gap-6">
        <div className="space-y-1 w-full">
          {isSponsor && tier.sponsorDiscountPercent > 0 ? (
            <>
              <p className="text-sm line-through text-foreground-muted font-medium">
                {standardPrice.toLocaleString('de-DE')}€
              </p>
              <div className="flex items-baseline gap-2 justify-end">
                <span className="text-xs text-foreground-muted">Freunde & Förderer</span>
                <span className="text-2xl font-extrabold text-foreground">
                  {sponsorPrice.toLocaleString('de-DE')}€
                </span>
              </div>
            </>
          ) : (
            <p className="text-2xl font-extrabold text-foreground">
              {standardPrice.toLocaleString('de-DE')}€
            </p>
          )}
        </div>

        <Button
          onClick={() => onSelect(tier.tierId)}
          disabled={isBtnDisabled}
          className={`w-full md:w-auto px-6 py-3 rounded-lg text-sm transition-all duration-200 hover:scale-[1.02] ${
            isSelected ? 'bg-primary text-primary-foreground' : config.btnStyles
          }`}
          aria-pressed={isSelected}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}

export default TierCard;
