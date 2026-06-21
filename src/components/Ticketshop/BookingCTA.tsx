'use client';

import type { TierDto } from '@/types/api.types';

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

      <button
        onClick={onCheckout}
        disabled={isLoading}
        aria-disabled={isLoading ? 'true' : undefined}
        type="button"
        className="w-full mt-3 py-2.5 px-4 rounded-[4px] font-semibold bg-[#635BFF] hover:bg-[#5433FF] text-white flex items-center justify-center gap-2 transition-all duration-150 shadow-[0_1px_1px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.04)] active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-[15px]"
      >
        {isLoading ? (
          <svg className="h-5 w-5 animate-spin text-white shrink-0" viewBox="0 0 24 24" fill="none" width="20" height="20">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 fill-current shrink-0"
            aria-hidden="true"
            width="16"
            height="16"
          >
            <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.993-1.848l-.9 5.495c2.308 1.127 5.495 1.767 8.528 1.767 2.515 0 4.537-.654 5.99-1.874 1.562-1.28 2.378-3.153 2.378-5.352 0-4.068-2.438-5.787-6.476-7.219z" />
          </svg>
        )}
        <span>{isLoading ? 'Wird geladen...' : 'Mit Stripe bezahlen'}</span>
      </button>
    </div>
  );
}

export default BookingCTA;
