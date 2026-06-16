'use client';

import React from 'react';
import type { TierDto } from '@/types/api.types';
import { Button } from '@/components/UI/Button';

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
                                     }: CheckoutPageProps) {

    const tierName = tierNames[tier.tierId as keyof typeof tierNames] || `Paket #${tier.tierId}`;
    const discountAmount = (tier.basePrice * tier.sponsorDiscountPercent) / 100;
    const finalPrice = (tier.basePrice - (isSponsor ? discountAmount : 0)) / 100;
    const features = tier.features || [];

    const blueBoxStyle = {
        borderColor: '#2563eb',
        borderWidth: '2px',
        borderStyle: 'solid' as const
    };

    return (
        <div className="w-full min-h-screen py-12 px-6 md:px-12 text-foreground bg-[#0b111e]">
            <div className="max-w-6xl mx-auto">

                <h1 className="text-2xl md:text-3xl font-bold mb-8 text-foreground">
                    Bestell
                </h1>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-stretch w-full">

                    <div
                        style={blueBoxStyle}
                        className="flex-1 p-6 md:p-8 bg-surface-raised flex flex-col justify-between rounded-none"
                    >
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-bold text-foreground">Rechnungsanschrift</h2>
                                <button className="text-xs text-foreground-muted hover:text-foreground flex items-center gap-1 transition-colors">
                                    Bearbeiten ✏️
                                </button>
                            </div>

                            <div className="text-sm md:text-base text-foreground-muted space-y-1.5 leading-relaxed">
                                <p className="font-semibold text-foreground">Max Mustermann</p>
                                <p>Alfons-Goppel-Platz 1</p>
                                <p>95028 Hof</p>
                                <p>Deutschland</p>
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t border-surface-border text-xs text-foreground-muted">
                            Die Zahlungsabwicklung erfolgt im nächsten Schritt via Stripe.
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col gap-6 justify-between">

                        <div
                            style={blueBoxStyle}
                            className="p-6 md:p-8 bg-surface-raised flex flex-col justify-between h-full rounded-none"
                        >
                            <div>
                                <h2 className="text-lg font-bold text-foreground mb-4">Ihre Bestellung</h2>

                                <div className="border-t border-surface-border pt-4">
                                    <h3 className="font-bold text-base text-foreground mb-3">{tierName}</h3>

                                    {features.length === 0 ? (
                                        <p className="text-sm text-foreground-muted italic">Keine Leistungen enthalten.</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start text-sm text-foreground-muted leading-relaxed">
                                                    <span className="text-foreground mr-2.5 select-none font-bold">•</span>
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
                                asChild
                            >
                                <button
                                    type="button"
                                    style={{ backgroundColor: '#facc15', color: '#000000' }}
                                    className="h-12 px-8 rounded-lg font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                                >
                                    <span>Bezahlen</span>
                                    <span className="text-lg font-bold">&rarr;</span>
                                </button>
                            </Button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}