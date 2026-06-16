'use client';

import React, { useState } from 'react';
import { useTiers } from '@/hooks/useTiers';
import { TierList, BookingCTA } from '@/components/Ticketshop';
import { Alert } from '@/components/UI';
import { createCheckout } from '@/services/payment.service';

export default function TicketshopPage() {
  const { tiers, isLoading, error, createBooking } = useTiers(1);
  const [selectedTierId, setSelectedTierId] = useState<number | null>(null);
  const [isSponsor, setIsSponsor] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const selectedTier = tiers.find((t) => t.tierId === selectedTierId);

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
      // In production we would redirect:
      // window.location.href = checkout.checkoutUrl;
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Buchung oder Checkout fehlgeschlagen.');
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
            <div className="bg-surface-raised p-6 border border-surface-border rounded-xl text-center text-foreground-muted text-sm">
              Bitte wählen Sie ein Paket aus der Liste.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
