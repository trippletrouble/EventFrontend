'use client';

import React from 'react';
import type { TierDto } from '@/types/api.types';
import { Modal, Button } from '@/components/UI';
import { UpgradeTierSelect } from './UpgradeTierSelect';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: TierDto;
  availableTiers: TierDto[];
  onUpgrade: (targetTierId: number) => Promise<void>;
  isLoading?: boolean;
}

const tierNames = {
  1: 'Basis Ticket',
  2: 'Basis Plus Ticket',
  3: 'Premium Ticket',
  4: 'Premium Deluxe Ticket',
};

const tierColors = {
  1: 'text-yellow-500',
  2: 'text-blue-500',
  3: 'text-red-500',
  4: 'text-emerald-400',
};

/** Modal zur Buchung eines Standplatz-Upgrades */
export function UpgradeModal({
  isOpen,
  onClose,
  currentTier,
  availableTiers,
  onUpgrade,
  isLoading = false,
}: UpgradeModalProps) {
  const currentTierName = tierNames[currentTier.tierId as keyof typeof tierNames] || `Paket #${currentTier.tierId}`;
  
  // Filter for higher tiers
  const upgradeCandidates = availableTiers.filter(
    (t) => t.basePrice > currentTier.basePrice
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Standplatz-Upgrade auswählen"
      actions={
        <Button onClick={onClose} disabled={isLoading} variant="outline" size="sm">
          Schließen
        </Button>
      }
    >
      <div className="space-y-5">
        <div className="p-3 bg-surface-overlay/10 rounded-lg border border-surface-border">
          <p className="text-sm text-foreground">
            Aktuelles Paket: <span className={`font-bold ${tierColors[currentTier.tierId as keyof typeof tierColors] || 'text-primary'}`}>{currentTierName}</span>
          </p>
          <p className="text-xs text-foreground-muted mt-1">
            Basispreis: {(currentTier.basePrice / 100).toLocaleString('de-DE')} €
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground-muted">
            Verfügbare Upgrades
          </h4>
          
          {upgradeCandidates.length === 0 ? (
            <p className="text-xs text-foreground-muted italic py-2">
              Keine höheren Upgrade-Pakete verfügbar.
            </p>
          ) : (
            <div className="space-y-2">
              {upgradeCandidates.map((tier) => (
                <UpgradeTierSelect
                  key={tier.tierId}
                  tier={tier}
                  currentTier={currentTier}
                  onUpgrade={onUpgrade}
                  isLoading={isLoading}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default UpgradeModal;
