'use client';

import React from 'react';
import type { TierDto } from '@/types/api.types';
import { TierCard } from './TierCard';

interface TierListProps {
  tiers: TierDto[];
  isSponsor: boolean;
  selectedTierId?: number | null;
  onSelect: (id: number) => void;
  disabled?: boolean;
}

export function TierList({
  tiers,
  isSponsor,
  selectedTierId,
  onSelect,
  disabled = false,
}: TierListProps) {
  if (!tiers || tiers.length === 0) {
    return (
      <div className="col-span-full bg-surface-raised p-6 border border-surface-border rounded-xl text-center text-foreground-muted text-sm">
        Keine Pakete verfügbar.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {tiers.map((tier) => (
        <TierCard
          key={tier.tierId}
          tier={tier}
          isSponsor={isSponsor}
          onSelect={onSelect}
          isSelected={selectedTierId === tier.tierId}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

export default TierList;
