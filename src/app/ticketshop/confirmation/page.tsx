'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import type { TierDto } from '@/types/api.types';
import { Button } from '@/components/UI/Button';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

const defaultTier: TierDto = {
    tierId: 3,
    eventId: 1,
    slotsTotal: 10,
    basePrice: 150000,
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
                                         onCheckout = async () => console.log('Stripe Checkout gestartet'),
                                         isLoading = false,
                                     }: CheckoutPageProps) {

    const searchParams = useSearchParams();
    const status = searchParams.get('status');

    const tierName = tierNames[tier.tierId as keyof typeof tierNames] || `Paket #${tier.tierId}`;
    const discountAmount = (tier.basePrice * tier.sponsorDiscountPercent) / 100;
    const finalPrice = (tier.basePrice - (isSponsor ? discountAmount : 0)) / 100;
    const features = tier.features || [];


    const boxStyle = {
        border: '2px solid #2860F9',
        backgroundColor: '#0D1117',
        color: '#ffffff'
    };

    const hrStyle = {
        border: 'none',
        borderTop: '2px solid #173892'
    };

    const pureWhiteText = { color: '#ffffff' };

    if (status === 'success') {
        return (
            <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-surface font-sans flex items-center justify-center" style={pureWhiteText}>
                <div className="max-w-xl w-full text-center p-8 border-2 border-brand-green rounded-none" style={{ backgroundColor: '#0D1117' }}>
                    <CheckCircle2 className="w-16 h-16 text-brand-green mx-auto mb-6" />
                    <h1 className="text-3xl font-extrabold mb-2">Vielen Dank für Ihre Buchung!</h1>
                    <p className="mb-8 text-sm opacity-90">Ihre Zahlung war erfolgreich. Eine Bestätigung wurde an Ihre E-Mail-Adresse gesendet.</p>

                    <div className="text-left border-t border-surface-border pt-6 p-4 rounded-lg bg-surface">
                        <h2 className="text-lg font-bold mb-3">Buchungsübersicht</h2>
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
                        Zum Aussteller-Dashboard
                    </Button>
                </div>
            </div>
        );
    }

    if (status === 'failure' || status === 'cancel') {
        return (
            <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-surface font-sans flex items-center justify-center" style={pureWhiteText}>
                <div className="max-w-xl w-full text-center p-8 border-2 border-brand-red rounded-none" style={{ backgroundColor: '#0D1117' }}>
                    <XCircle className="w-16 h-16 text-brand-red mx-auto mb-6" />
                    <h1 className="text-3xl font-extrabold mb-2">Zahlung fehlgeschlagen</h1>
                    <p className="mb-6 text-sm opacity-90">Der Zahlungsvorgang wurde abgebrochen oder Ihre Karte wurde abgelehnt. Es wurden keine Beträge abgebucht.</p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                        <Button variant="outline" className="flex-1 cursor-pointer text-white border-white hover:bg-white/15" onClick={() => window.location.href = '/checkout'}>
                            Erneut versuchen
                        </Button>
                        <Button variant="ghost" className="flex-1 cursor-pointer text-white/80 hover:text-white" onClick={() => window.location.href = '/support'}>
                            Support kontaktieren
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'pending') {
        return (
            <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-surface font-sans flex items-center justify-center" style={pureWhiteText}>
                <div className="max-w-xl w-full text-center p-8 border-2 border-warning rounded-none" style={{ backgroundColor: '#0D1117' }}>
                    <AlertCircle className="w-16 h-16 text-warning mx-auto mb-6 animate-pulse" />
                    <h1 className="text-3xl font-extrabold mb-2">Zahlung wird verarbeitet</h1>
                    <p className="mb-4 text-sm opacity-90">Ihre Zahlung wird aktuell noch von Stripe geprüft (z. B. bei Sofortüberweisung oder SEPA).</p>

                    <Button variant="outline" className="mt-8 w-full cursor-pointer text-white border-white hover:bg-white/15" onClick={() => window.location.href = '/dashboard'}>
                        Zum Dashboard wechseln
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-surface font-sans" style={pureWhiteText}>
            <div className="max-w-4xl mx-auto">

                <h1
                    style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: '1.2', color: '#ffffff' }}
                    className="font-extrabold mb-12 tracking-tight"
                >
                    Bestellübersicht
                </h1>

                <div className="flex flex-col md:flex-row gap-8 items-stretch w-full">

                    <div
                        style={boxStyle}
                        className="flex-1 p-6 md:p-8 flex flex-col justify-between rounded-none"
                    >
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-extrabold" style={pureWhiteText}>Rechnungsanschrift</h2>
                                <button className="text-xs flex items-center gap-1 transition-colors cursor-pointer opacity-80 hover:opacity-100" style={pureWhiteText}>
                                    Bearbeiten ✏️
                                </button>
                            </div>

                            <div className="text-sm md:text-base space-y-2 leading-relaxed" style={pureWhiteText}>
                                <p className="font-semibold text-base">Max Mustermann</p>
                                <p>Alfons-Goppel-Platz 1</p>
                                <p>95028 Hof</p>
                                <p>Deutschland</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-surface-border text-xs opacity-70" style={pureWhiteText}>
                            Die Zahlungsabwicklung erfolgt im nächsten Schritt via Stripe.
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-6 justify-between">

                        <div
                            style={boxStyle}
                            className="p-6 md:p-8 flex flex-col justify-between h-full rounded-none"
                        >
                            <div>
                                <h2 className="text-xl font-extrabold mb-4" style={pureWhiteText}>Ihre Bestellung</h2>
                                <hr style={hrStyle} className="mb-4" aria-hidden="true" />

                                <div className="pt-2">
                                    <h3 className="font-extrabold text-lg mb-4" style={pureWhiteText}>{tierName}</h3>

                                    {features.length === 0 ? (
                                        <p className="text-sm italic opacity-70">Keine Leistungen enthalten.</p>
                                    ) : (
                                        <ul className="space-y-3 list-none">
                                            {features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start text-sm leading-relaxed" style={pureWhiteText}>
                                                    <span className="mr-2.5 select-none font-bold text-base leading-none">•</span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {isSponsor && tier.sponsorDiscountPercent > 0 && (
                                        <div className="mt-4 p-2 border border-success/30 rounded text-xs text-success flex justify-between">
                                            <span>Sponsor-Rabatt (-{tier.sponsorDiscountPercent}%):</span>
                                            <span>-{(discountAmount / 100).toLocaleString('de-DE')} €</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <hr style={hrStyle} className="mt-8 mb-4" aria-hidden="true" />
                                <div className="flex justify-between items-baseline">
                                    <span className="text-base font-extrabold">Gesamt</span>
                                    <span className="text-2xl font-extrabold tracking-tight">
                    {finalPrice.toLocaleString('de-DE')} €
                  </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end w-full">
                            <Button
                                onClick={onCheckout}
                                disabled={isLoading}
                                isLoading={isLoading}
                                variant="ghost"
                                size="lg"
                                style={{
                                    backgroundColor: '#FCCD00',
                                    color: 'var(--color-primary-foreground)',
                                    width: '255px',
                                    height: '44px',
                                }}
                                className="rounded-lg font-extrabold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-md border-none"
                            >
                                Bezahlen &rarr;
                            </Button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}