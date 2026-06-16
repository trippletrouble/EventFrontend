'use client';

import type { TierDto } from '@/types/api.types';
import { Button } from '@/components/UI';

interface BookingCTAProps {
  tier: TierDto;
  isSponsor: boolean;
  onCheckout: () => Promise<void>;
  isLoading?: boolean;
}

const tierNames = {
  1: 'Basis Ticket',
  2: 'Basis Plus Ticket',
  3: 'Premium Ticket',
  4: 'Premium Deluxe Ticket',
};

/** Buchungszusammenfassung und Call to Action vor dem Checkout */
export function BookingCTA({
  tier,
  isSponsor,
  onCheckout,
  isLoading = false,
}: BookingCTAProps) {
  const tierName = tierNames[tier.tierId as keyof typeof tierNames] || `Paket #${tier.tierId}`;
  const basePrice = tier.basePrice / 100;
  const discountAmount = (tier.basePrice * tier.sponsorDiscountPercent) / 100;
  const finalPrice = (tier.basePrice - (isSponsor ? discountAmount : 0)) / 100;

  return (
    <div className="bg-surface-raised p-6 border border-surface-border rounded-xl space-y-4 shadow-sm">
      <h3 className="text-lg font-bold text-foreground">Buchungszusammenfassung</h3>
      
      <div className="border-t border-surface-border pt-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-foreground-muted">Paket:</span>
          <span className="font-semibold text-foreground">{tierName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-foreground-muted">Basispreis:</span>
          <span className="text-foreground">{basePrice.toLocaleString('de-DE')} €</span>
        </div>
        {isSponsor && tier.sponsorDiscountPercent > 0 && (
          <div className="flex justify-between text-sm text-success">
            <span>Sponsor-Rabatt (-{tier.sponsorDiscountPercent}%):</span>
            <span>-{(discountAmount / 100).toLocaleString('de-DE')} €</span>
          </div>
        )}
        
        <div className="border-t border-surface-border pt-3 mt-2 flex justify-between items-baseline">
          <span className="text-sm font-bold text-foreground">Gesamtpreis:</span>
          <span className="text-xl font-extrabold text-foreground">
            {finalPrice.toLocaleString('de-DE')} €
          </span>
        </div>
      </div>

      <Button
        onClick={onCheckout}
        disabled={isLoading}
        isLoading={isLoading}
        variant="primary"
        className="w-full mt-2 py-3 rounded-xl font-bold"
      >
        Jetzt bezahlen
      </Button>
    </div>
  );
}

export default BookingCTA;
