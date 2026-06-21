'use client';

import React, { useState } from 'react';
import { useTiers } from '@/hooks/useTiers';
import { TierList, BookingCTA, UpgradeModal } from '@/components/Ticketshop';
import { Alert, Button } from '@/components/UI';
import { createCheckout } from '@/services/payment.service';
import DownloadButton from "@/components/Ticketshop/DownloadButton";
import CancelDialog from "@/components/Ticketshop/CancelDialog";

export default function TicketshopPage() {
  const { tiers, isLoading, error, createBooking, upgradeBooking } = useTiers(1);
  const [selectedTierId, setSelectedTierId] = useState<number | null>(null);
  const [isSponsor, setIsSponsor] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const testBookingId = 998877;

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
      const booking = await createBooking({
        tierId: selectedTierId,
        companyId: 1,
      });

      const checkout = await createCheckout({
        bookingId: booking.bookingId,
      });

      setBookingSuccess(`Buchung erfolgreich angelegt! Stripe-Checkout wird gestartet: ${checkout.checkoutUrl}`);

      if (checkout?.checkoutUrl) {
        window.location.href = checkout.checkoutUrl;
      }

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
      const result = await upgradeBooking(1, { targetTierId });
      setBookingSuccess(
          `Upgrade erfolgreich eingeleitet! Differenzbetrag: ${
              result.priceDifference / 100
          } €. Stripe-Zahlung wird gestartet: ${result.paymentUrl}`
      );
      if (result?.paymentUrl) {
        window.location.href = result.paymentUrl;
      }
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
      <>
      <div className="container mx-auto px-4 py-8 max-w-6xl space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">Tickets</h2>
            <p className="text-gray-400 text-sm mt-1">
              Wählen Sie das passende Standpaket für Ihr Unternehmen aus.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {tiers.length > 0 && (
                <Button
                    onClick={() => setIsUpgradeModalOpen(true)}
                    variant="outline"
                    size="sm"
                    className="rounded-lg font-semibold text-white border-white/20"
                >
                  Stand upgraden
                </Button>
            )}

            <label className="flex items-center gap-2 text-sm text-white bg-white/5 px-4 py-2 border border-white/10 rounded-lg cursor-pointer">
              <input
                  type="checkbox"
                  checked={isSponsor}
                  onChange={(e) => setIsSponsor(e.target.checked)}
                  className="rounded border-white/20 bg-transparent text-[#0AD88E] focus:ring-[#0AD88E] h-4 w-4"
              />
              <span>Sponsor-Status simulieren (Freunde & Förderer)</span>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:ml-auto">
            <DownloadButton />
        </div>
        </div>

        {(error || bookingError) && (
            <Alert variant="error" title="Fehler">
          <span className="text-base font-black tracking-wide text-white block">
            {error || bookingError}
          </span>
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
                  <svg className="h-10 w-10 animate-spin text-[#0AD88E]" viewBox="0 0 24 24">
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

          <div className="lg:col-span-1 space-y-4 flex flex-col">
            {selectedTier ? (
                <>
                <BookingCTA
                    tier={selectedTier}
                    isSponsor={isSponsor}
                    onCheckout={handleCheckout}
                    isLoading={isBookingLoading}
                />

                <div className="w-full flex flex-col items-center justify-center pt-2">
                  <button
                      onClick={() => setIsCancelOpen(true)}
                      type="button"
                      className="px-3 py-1.5 text-xs text-white bg-transparent border border-red-600 hover:bg-red-600/10 rounded-lg transition-all"
                  >
                    Stornierung anfragen (ID: {testBookingId})
                  </button>
                </div>
                </>
            ) : (
                <div className="bg-white/5 p-6 border border-white/10 rounded-xl text-center text-gray-400 text-sm">
                  Bitte wählen Sie ein Paket aus der Liste.
                </div>
            )}
          </div>
        </div>

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
      </div>

  {/* DIALOG-KOMPONENTE: Wird außerhalb des Haupt-Flusses gerendert */}
  <CancelDialog
      isOpen={isCancelOpen}
      bookingId={testBookingId}
      onClose={() => setIsCancelOpen(false)}
      onConfirmSuccess={() => {
        console.log('Stornierung im Backend erfolgreich getriggert!');
      }}
  />
      </>
  );
}