'use client';

import React, { useState } from 'react';
import { useTiers } from '@/hooks/useTiers';
import { TierList, BookingCTA, UpgradeModal } from '@/components/Ticketshop';
import { Alert, Button } from '@/components/UI';
import { createCheckout } from '@/services/payment.service';
import { MousePointerClick, ArrowLeft, ArrowUp } from 'lucide-react';

export default function TicketshopPage() {
  const { tiers, isLoading, error, createBooking, upgradeBooking } = useTiers(1);
  const [selectedTierId, setSelectedTierId] = useState<number | null>(null);
  const [isSponsor, setIsSponsor] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const selectedTier = tiers.find((t) => t.tierId === selectedTierId);
  const currentTierForUpgrade = selectedTier || tiers[0];

  const handleSelectTier = (id: number) => {
    setSelectedTierId(id);
  };

  const handleCheckout = async () => {
    if (!selectedTierId) return;
    setIsBookingLoading(true);
    setBookingSuccess(null);
    setBookingError(null);
    try {
      // 1. Create booking (mocking companyId: 1)
      const booking = await createBooking({
        tierId: selectedTierId,
        companyId: 1,
      });
      
      // 2. Start Stripe Checkout
      const checkout = await createCheckout({
        bookingId: booking.bookingId,
      });

      setBookingSuccess(`Buchung erfolgreich angelegt! Stripe-Checkout wird gestartet: ${checkout.checkoutUrl}`);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Checkout/Booking API call failed, using dev mock fallback:', err);
        setBookingSuccess(
          `[Demo-Modus] Buchung erfolgreich angelegt! Stripe-Checkout wird gestartet: https://checkout.stripe.com/test_session_123`
        );
      } else {
        setBookingError(err instanceof Error ? err.message : 'Buchung oder Checkout fehlgeschlagen.');
      }
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handleUpgrade = async (targetTierId: number) => {
    setIsBookingLoading(true);
    setBookingSuccess(null);
    setBookingError(null);
    try {
      // Mocking current bookingId: 1
      const result = await upgradeBooking(1, { targetTierId });
      setBookingSuccess(
        `Upgrade erfolgreich eingeleitet! Differenzbetrag: ${
          result.priceDifference / 100
        } €. Stripe-Zahlung wird gestartet: ${result.paymentUrl}`
      );
      setIsUpgradeModalOpen(false);
    } catch (err) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Upgrade API call failed, using dev mock fallback:', err);
        setBookingSuccess(
          `[Demo-Modus] Upgrade erfolgreich eingeleitet! Differenzbetrag: 350 €. Stripe-Zahlung wird gestartet: https://checkout.stripe.com/upgrade_session_123`
        );
        setIsUpgradeModalOpen(false);
      } else {
        setBookingError(err instanceof Error ? err.message : 'Upgrade fehlgeschlagen.');
      }
    } finally {
      setIsBookingLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tickets</h1>
          <p className="text-foreground-muted text-sm mt-1">
            Wählen Sie das passende Standpaket für Ihr Unternehmen aus.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Button to trigger Upgrade Modal */}
          {tiers.length > 0 && (
            <Button
              onClick={() => setIsUpgradeModalOpen(true)}
              variant="outline"
              size="sm"
              className="rounded-lg font-semibold"
            >
              Stand upgraden
            </Button>
          )}

          {/* Toggle to test Sponsor discounts */}
          <label className="flex items-center gap-2 text-sm text-foreground bg-surface-raised px-4 py-2 border border-surface-border rounded-lg cursor-pointer">
            <input
              type="checkbox"
              checked={isSponsor}
              onChange={(e) => setIsSponsor(e.target.checked)}
              className="rounded border-surface-border text-primary focus:ring-primary h-4 w-4"
            />
            <span>Sponsor-Status simulieren (Freunde & Förderer)</span>
          </label>
        </div>
      </div>

      {(error || bookingError) && (
        <Alert variant="error" title="Fehler">
          {error || bookingError}
        </Alert>
      )}

      {bookingSuccess && (
        <Alert variant="success" title="Erfolg">
          {bookingSuccess}
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex justify-center p-8" aria-label="Pakete laden">
              <svg className="h-10 w-10 animate-spin text-primary" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : (
            <TierList
              tiers={tiers}
              isSponsor={isSponsor}
              selectedTierId={selectedTierId}
              onSelect={handleSelectTier}
              disabled={isBookingLoading}
            />
          )}
        </div>

        <div className="lg:col-span-1">
          {selectedTier ? (
            <BookingCTA
              tier={selectedTier}
              isSponsor={isSponsor}
              onCheckout={handleCheckout}
              isLoading={isBookingLoading}
            />
          ) : (
            <div className="bg-surface-raised p-8 border border-surface-border rounded-xl flex flex-col items-center justify-center text-center space-y-4 shadow-xl min-h-[300px] transition-all duration-300 hover:border-primary/30">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse">
                <MousePointerClick className="w-7 h-7" aria-hidden="true" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-base font-bold text-foreground">Paket auswählen</h4>
                <p className="text-sm text-foreground-muted max-w-[220px] leading-relaxed">
                  Bitte wählen Sie eines der verfügbaren Pakete aus der Liste aus, um fortzufahren.
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-primary pt-2">
                <ArrowLeft className="w-4.5 h-4.5 lg:block hidden" aria-hidden="true" />
                <ArrowUp className="w-4.5 h-4.5 lg:hidden block" aria-hidden="true" />
                <span>Paket aus der Liste wählen</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      {currentTierForUpgrade && (
        <UpgradeModal
          isOpen={isUpgradeModalOpen}
          onClose={() => setIsUpgradeModalOpen(false)}
          currentTier={currentTierForUpgrade}
          availableTiers={tiers}
          onUpgrade={handleUpgrade}
          isLoading={isBookingLoading}
        />
      )}
    </main>
  );
}
