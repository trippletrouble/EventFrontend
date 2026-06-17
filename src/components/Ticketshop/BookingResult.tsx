'use client';

import React from 'react';
import type { TierDto } from '@/types/api.types';
import { Button } from '@/components/UI/Button';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const defaultTier: TierDto = {
    tierId: 3,
    basePrice: 150000,
    eventId: 1,
    slotsTotal: 10,
    sponsorDiscountPercent: 0,
    available: true,
    features: [
        'Messestand mit 6m², Lagebereich 2',
        'Ausstellerprofil',
        'Anzeige im digitalen Messeguide',
        'Herunterladbare PDFs im Ausstellerprofil',
        'Sponsorenlogo in 1 Bewerbungsmail an Studierende',
    ],
};

interface CheckoutPageProps {
    tier?: TierDto;
    isSponsor?: boolean;
    onCheckout?: () => Promise<void>;
    isLoading?: boolean;
    status?: string | null;
}

const tierNames = {
    1: 'Basis Ticket',
    2: 'Basis Plus Ticket',
    3: 'Premium Ticket',
    4: 'Premium Deluxe Ticket',
};

export default function CheckoutPage({
                                         tier = defaultTier,
                                         isSponsor = false,
                                         onCheckout = async () => console.log('Stripe Checkout'),
                                         isLoading = false,
                                         status = null,
                                     }: CheckoutPageProps) {

    const tierName = tierNames[tier.tierId as keyof typeof tierNames] || `Paket #${tier.tierId}`;
    const discountAmount = (tier.basePrice * tier.sponsorDiscountPercent) / 100;
    const finalPrice = (tier.basePrice - (isSponsor ? discountAmount : 0)) / 100;
    const features = tier.features || [];

    const blueBoxStyle = {
        borderColor: '#2563eb',
        borderWidth: '2px',
        borderStyle: 'solid' as const,
        backgroundColor: '#0b111e',
        color: '#ffffff'
    };

    const pureWhiteText = { color: '#ffffff' };

    if (status === 'success') {
        return (
            <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-[#0b111e] font-sans flex items-center justify-center" style={pureWhiteText}>
                <div className="max-w-xl w-full text-center p-8 border-2 border-brand-green rounded-none" style={{ backgroundColor: '#0d1117' }}>
                    <CheckCircle2 className="w-16 h-16 text-brand-green mx-auto mb-6" />
                    <h1 className="text-3xl font-extrabold mb-2">Vielen Dank für Ihre Buchung!</h1>
                    <p className="mb-8 text-sm opacity-90">Ihre Zahlung war erfolgreich. Eine Bestätigung wurde an Ihre E-Mail-Adresse gesendet.</p>
                    <div className="text-left border-t border-surface-border pt-6 p-4 rounded-lg bg-surface">
                        <h2 className="text-lg font-bold mb-3 text-white">Buchungsübersicht</h2>
                        <div className="flex justify-between text-sm py-1">
                            <span className="opacity-80">Gewähltes Paket:</span>
                            <span className="font-semibold">{tierName}</span>
                        </div>
                        <div className="flex justify-between text-sm py-1">
                            <span className="opacity-80">Status:</span>
                            <span className="text-brand-green font-semibold">Bezahlt via Stripe</span>
                        </div>
                        <hr className="border-surface-border my-3" />
                        <div className="flex justify-between text-base font-bold">
                            <span>Gesamtsumme:</span>
                            <span>{finalPrice.toLocaleString('de-DE')} €</span>
                        </div>
                    </div>
                    <Button variant="outline" size="md" className="mt-8 w-full cursor-pointer text-white border-white hover:bg-white/15" onClick={() => window.location.href = '/dashboard'}>
                        <span>Zum Aussteller-Dashboard</span>
                    </Button>
                </div>
            </div>
        );
    }

    if (status === 'failure' || status === 'cancel') {
        return (
            <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-[#0b111e] font-sans flex items-center justify-center" style={pureWhiteText}>
                <div className="max-w-xl w-full text-center p-8 border-2 border-brand-red rounded-none" style={{ backgroundColor: '#0d1117' }}>
                    <XCircle className="w-16 h-16 text-brand-red mx-auto mb-6" />
                    <h1 className="text-3xl font-extrabold mb-2">Zahlung fehlgeschlagen</h1>
                    <p className="mb-6 text-sm opacity-90">Der Zahlungsvorgang wurde abgebrochen oder Ihre Karte wurde abgelehnt. Es wurden keine Beträge abgebucht.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <Button variant="outline" className="flex-1 cursor-pointer text-white border-white hover:bg-white/15" onClick={() => window.location.href = '/checkout'}>
                            <span>Erneut versuchen</span>
                        </Button>
                        <Button variant="ghost" className="flex-1 cursor-pointer text-white/80 hover:text-white" onClick={() => window.location.href = '/support'}>
                            <span>Support kontaktieren</span>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'pending') {
        return (
            <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-[#0b111e] font-sans flex items-center justify-center" style={pureWhiteText}>
                <div className="max-w-xl w-full text-center p-8 border-2 border-warning rounded-none" style={{ backgroundColor: '#0d1117' }}>
                    <AlertCircle className="w-16 h-16 text-warning mx-auto mb-6 animate-pulse" />
                    <h1 className="text-3xl font-extrabold mb-2">Zahlung wird verarbeitet</h1>
                    <p className="mb-4 text-sm opacity-90">Ihre Zahlung wird aktuell noch von Stripe geprüft (z. B. bei Sofortüberweisung oder SEPA).</p>
                    <Button variant="outline" className="mt-8 w-full cursor-pointer text-white border-white hover:bg-white/15" onClick={() => window.location.href = '/dashboard'}>
                        <span>Zum Dashboard wechseln</span>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen py-12 px-6 md:px-12 text-white bg-[#0b111e]">
            <div className="max-w-6xl mx-auto">
                <h1
                    style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.2' }}
                    className="font-extrabold mb-8 text-white tracking-tight"
                >
                    Bestellübersicht
                </h1>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-stretch w-full">
                    {/* LINKE BOX */}
                    <div style={blueBoxStyle} className="flex-1 p-6 md:p-8 flex flex-col justify-between rounded-none">
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-white">Rechnungsanschrift</h2>
                                <button className="text-xs text-white hover:opacity-80 flex items-center gap-1 transition-colors">
                                    Bearbeiten ✏️
                                </button>
                            </div>
                            <div className="text-sm md:text-base text-white space-y-1.5 leading-relaxed">
                                <p className="font-semibold">Max Mustermann</p>
                                <p>Alfons-Goppel-Platz 1</p>
                                <p>95028 Hof</p>
                                <p>Deutschland</p>
                            </div>
                        </div>
                        <div className="mt-8 pt-4 border-t border-surface-border text-xs text-white/70">
                            Die Zahlungsabwicklung erfolgt im nächsten Schritt via Stripe.
                        </div>
                    </div>

                    {/* RECHTE BOX */}
                    <div className="flex-1 flex flex-col gap-6 justify-between">
                        <div style={blueBoxStyle} className="p-6 md:p-8 flex flex-col justify-between h-full rounded-none">
                            <div>
                                <h2 className="text-lg font-bold text-white mb-4">Ihre Bestellung</h2>
                                <div className="border-t border-surface-border pt-4">
                                    <h3 className="font-bold text-base text-white mb-3">{tierName}</h3>
                                    {features.length === 0 ? (
                                        <p className="text-sm text-white/70 italic">Keine Leistungen enthalten.</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start text-sm text-white/90 leading-relaxed">
                                                    <span className="text-white mr-2.5 select-none font-bold">•</span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-surface-border mt-12 pt-4 flex justify-between items-baseline">
                                <span className="text-lg font-bold text-foreground">Gesamt</span>
                                <span className="text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                                {finalPrice.toLocaleString('de-DE')} €
                               </span>
                            </div>
                        </div>

                        <div className="flex justify-end w-full">
                            <Button
                                onClick={onCheckout}
                                disabled={isLoading}
                                isLoading={isLoading}
                                style={{
                                    backgroundColor: '#facc15',
                                    color: '#000000'
                                }}
                                className="h-12 px-8 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                            >
                                <>
                                <span>Bezahlen</span>
                                <span className="text-lg font-bold">&rarr;</span>
                                </>
                            </Button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}