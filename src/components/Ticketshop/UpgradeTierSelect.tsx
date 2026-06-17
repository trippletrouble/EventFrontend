'use client';

import React from 'react';
import type { TierDto } from '@/types/api.types';
import { Button } from '@/components/UI';

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

/** Einzelnes Auswahlelement für ein Standplatz-Upgrade */
export function UpgradeTierSelect({
  tier,
  currentTier,
  onUpgrade,
  isLoading = false,
}: UpgradeTierSelectProps) {
  const tierName = tierNames[tier.tierId as keyof typeof tierNames] || `Paket #${tier.tierId}`;
  const diff = (tier.basePrice - currentTier.basePrice) / 100;

  return (
    <div className="p-4 border border-surface-border bg-surface-overlay/25 rounded-lg flex justify-between items-center gap-4">
      <div>
        <p className="font-semibold text-sm text-foreground">
          {tierName}
        </p>
        <p className="text-xs text-foreground-muted mt-0.5">
          Upgrade-Kosten: {diff.toLocaleString('de-DE')} €
        </p>
      </div>
      <Button
        onClick={() => onUpgrade(tier.tierId)}
        disabled={isLoading}
        variant="primary"
        size="sm"
        className="font-semibold px-4"
      >
        Upgrade
      </Button>
    </div>
  );
}

export default UpgradeTierSelect;
