import React from 'react';
import type { TierDto } from '@/types/api.types';
import { Button } from '@/components/UI';
import { Ticket, Sparkles, Crown, Gem } from 'lucide-react';

interface UpgradeTierSelectProps {
  tier: TierDto;
  currentTier: TierDto;
  onUpgrade: (targetTierId: number) => Promise<void>;
  isLoading?: boolean;
}

const tierNames = {
  1: 'Basis Ticket',
  2: 'Basis Plus Ticket',
  3: 'Premium Ticket',
  4: 'Premium Deluxe Ticket',
};

const tierContent = {
  1: {
    textColor: 'text-yellow-500',
    borderColor: 'border-yellow-500/30',
    icon: Ticket,
  },
  2: {
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500/30',
    icon: Sparkles,
  },
  3: {
    textColor: 'text-red-500',
    borderColor: 'border-red-500/30',
    icon: Crown,
  },
  4: {
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    icon: Gem,
  },
};

/** Einzelnes Auswahlelement für ein Standplatz-Upgrade */
export function UpgradeTierSelect({
  tier,
  currentTier,
  onUpgrade,
  isLoading = false,
}: UpgradeTierSelectProps) {
  const tierName = tierNames[tier.tierId as keyof typeof tierNames] || `Paket #${tier.tierId}`;
  const diff = (tier.basePrice - currentTier.basePrice) / 100;
  
  const config = tierContent[tier.tierId as keyof typeof tierContent] || {
    textColor: 'text-foreground',
    borderColor: 'border-surface-border',
    icon: Ticket,
  };

  return (
    <div className={`p-4 border bg-surface-overlay/25 rounded-lg flex justify-between items-center gap-4 transition-colors ${config.borderColor}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full bg-surface flex items-center justify-center ${config.textColor} border border-surface-border/20`}>
          <config.icon className="w-4.5 h-4.5 shrink-0" aria-hidden="true" />
        </div>
        <div>
          <p className={`font-bold text-sm ${config.textColor}`}>
            {tierName}
          </p>
          <p className="text-xs text-foreground-muted mt-0.5">
            Upgrade-Kosten: {diff.toLocaleString('de-DE')} €
          </p>
        </div>
      </div>
      <Button
        onClick={() => onUpgrade(tier.tierId)}
        disabled={isLoading}
        variant="primary"
        size="sm"
        className="font-bold px-4"
      >
        Upgrade
      </Button>
    </div>
  );
}

export default UpgradeTierSelect;
