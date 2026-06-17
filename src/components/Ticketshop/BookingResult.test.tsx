'use client';

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import type { TierDto } from '@/types/api.types';
import BookingResult from './BookingResult';

expect.extend(toHaveNoViolations);

describe('BookingResult-Komponente', () => {
    const mockTier: TierDto = {
        tierId: 3,
        eventId: 1,
        slotsTotal: 10,
        basePrice: 150000,
        sponsorDiscountPercent: 20,
        available: true,
        features: [
            'Messestand mit 6m², Lagebereich 2',
            'Ausstellerprofil',
            'Anzeige im digitalen Messeguide',
        ],
    };

    const mockOnCheckout = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Initiales Rendering', () => {
        it('rendert alle erforderlichen Elemente ohne Props korrekt', () => {
            render(<BookingResult />);

            expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: /Rechnungsanschrift/i, level: 2 })).toBeInTheDocument();
            expect(screen.getByRole('heading', { name: /Ihre Bestellung/i, level: 2 })).toBeInTheDocument();
        });

        it('rendert die Standardadresse von Max Mustermann korrekt', () => {
            render(<BookingResult />);

            expect(screen.getByText('Max Mustermann')).toBeInTheDocument();
            expect(screen.getByText('Alfons-Goppel-Platz 1')).toBeInTheDocument();
            expect(screen.getByText('95028 Hof')).toBeInTheDocument();
            expect(screen.getByText('Deutschland')).toBeInTheDocument();
        });

        it('rendert den Standardtier-Namen Premium Ticket korrekt', () => {
            render(<BookingResult />);
            expect(screen.getByText('Premium Ticket')).toBeInTheDocument();
        });

        it('rendert alle Standard-Features aus dem defaultTier', () => {
            render(<BookingResult />);

            const features = [
                'Messestand mit 6m², Lagebereich 2',
                'Ausstellerprofil',
                'Anzeige im digitalen Messeguide',
                'Herunterladbare PDFs im Ausstellerprofil',
                'Sponsorenlogo in 1 Bewerbungsmail an Studierende',
            ];

            features.forEach(feature => {
                expect(screen.getByText(feature)).toBeInTheDocument();
            });
        });

        it('berechnet und rendert den Standardpreis korrekt (1500,00 € für Tier 3)', () => {
            render(<BookingResult />);
            expect(screen.getByText('1.500,00 €')).toBeInTheDocument();
        });
    });

    describe('Tier-Auswahl und Preisberechnung', () => {
        it('rendert den korrektigen Tier-Namen für tierId 1 (Basis Ticket)', () => {
            const tier: TierDto = { ...mockTier, tierId: 1 };
            render(<BookingResult tier={tier} />);
            expect(screen.getByText('Basis Ticket')).toBeInTheDocument();
        });

        it('rendert den korrektigen Tier-Namen für tierId 2 (Basis Plus Ticket)', () => {
            const tier: TierDto = { ...mockTier, tierId: 2 };
            render(<BookingResult tier={tier} />);
            expect(screen.getByText('Basis Plus Ticket')).toBeInTheDocument();
        });

        it('rendert den korrektigen Tier-Namen für tierId 4 (Premium Deluxe Ticket)', () => {
            const tier: TierDto = { ...mockTier, tierId: 4 };
            render(<BookingResult tier={tier} />);
            expect(screen.getByText('Premium Deluxe Ticket')).toBeInTheDocument();
        });

        it('rendert das Fallback-Format Paket #X für unbekannte tierId', () => {
            const tier: TierDto = { ...mockTier, tierId: 999 };
            render(<BookingResult tier={tier} />);
            expect(screen.getByText('Paket #999')).toBeInTheDocument();
        });

        it('berechnet den Gesamtpreis ohne Sponsor-Rabatt korrekt', () => {
            const tier: TierDto = { ...mockTier, basePrice: 200000 };
            render(<BookingResult tier={tier} isSponsor={false} />);
            expect(screen.getByText('2.000,00 €')).toBeInTheDocument();
        });

        it('berechnet den Gesamtpreis mit Sponsor-Rabatt korrekt', () => {
            render(<BookingResult tier={mockTier} isSponsor={true} />);
            expect(screen.getByText('1.200,00 €')).toBeInTheDocument();
        });

        it('berechnet den Sponsor-Rabattbetrag korrekt und rendert ihn', () => {
            render(<BookingResult tier={mockTier} isSponsor={true} />);
            expect(screen.getByText(/Sponsor-Rabatt \(-20%\)/i)).toBeInTheDocument();
            expect(screen.getByText('-300,00 €')).toBeInTheDocument();
        });

        it('zeigt den Rabatt nur an, wenn isSponsor=true UND sponsorDiscountPercent > 0', () => {
            const tierWithoutDiscount: TierDto = { ...mockTier, sponsorDiscountPercent: 0 };
            const { rerender } = render(<BookingResult tier={tierWithoutDiscount} isSponsor={true} />);
            expect(screen.queryByText(/Sponsor-Rabatt/i)).not.toBeInTheDocument();

            rerender(<BookingResult tier={mockTier} isSponsor={false} />);
            expect(screen.queryByText(/Sponsor-Rabatt/i)).not.toBeInTheDocument();
        });
    });

    describe('Features-Rendering', () => {
        it('rendert eine liste von Features als Bullets', () => {
            render(<BookingResult tier={mockTier} />);

            const listItems = screen.getAllByRole('listitem');
            expect(listItems.length).toBe(3);
            listItems.forEach(item => {
                expect(item).toHaveClass('flex', 'items-start');
            });
        });

        it('zeigt die Meldung Keine Leistungen enthalten an, wenn Features leer sind', () => {
            const tierNoFeatures: TierDto = { ...mockTier, features: [] };
            render(<BookingResult tier={tierNoFeatures} />);
            expect(screen.getByText('Keine Leistungen enthalten.')).toBeInTheDocument();
        });

        it('rendert jedes Feature mit einem Bullet-Punkt', () => {
            render(<BookingResult tier={mockTier} />);

            const featureText = mockTier.features[0];
            const listItem = screen.getByText(featureText);
            const bulletSpan = listItem.querySelector('span:first-child');
            expect(bulletSpan).toHaveTextContent('•');
        });
    });

    describe('Button-Verhalten', () => {
        it('ruft onCheckout auf, wenn der Bezahlen-Button geklickt wird', async () => {
            const user = userEvent.setup();
            render(<BookingResult onCheckout={mockOnCheckout} />);

            const payButton = screen.getByRole('button', { name: /Bezahlen/i });
            await user.click(payButton);

            expect(mockOnCheckout).toHaveBeenCalledTimes(1);
        });

        it('deaktiviert den Button während isLoading=true', () => {
            render(<BookingResult isLoading={true} onCheckout={mockOnCheckout} />);

            const payButton = screen.getByRole('button', { name: /Bezahlen/i });
            expect(payButton).toHaveAttribute('disabled');
        });

        it('zeigt den Loading-Spinner und reduziert die Opazität während das Laden läuft', () => {
            render(<BookingResult isLoading={true} onCheckout={mockOnCheckout} />);

            const payButton = screen.getByRole('button', { name: /Bezahlen/i });
            expect(payButton).toHaveAttribute('aria-busy', 'true');
        });

        it('verhindert mehrfache Klicks während isLoading=true', async () => {
            const user = userEvent.setup();
            render(<BookingResult isLoading={true} onCheckout={mockOnCheckout} />);

            const payButton = screen.getByRole('button', { name: /Bezahlen/i });
            await user.click(payButton);

            expect(mockOnCheckout).not.toHaveBeenCalled();
        });

        it('erlaubt das Klicken auf den Button, wenn isLoading=false', async () => {
            const user = userEvent.setup();
            render(<BookingResult isLoading={false} onCheckout={mockOnCheckout} />);

            const payButton = screen.getByRole('button', { name: /Bezahlen/i });
            await user.click(payButton);

            expect(mockOnCheckout).toHaveBeenCalledTimes(1);
        });
    });

    describe('Bearbeiten-Button in der Adressbox', () => {
        it('rendert den Bearbeiten-Button in der Rechnungsanschrift-Box', () => {
            render(<BookingResult />);
            expect(screen.getByRole('button', { name: /Bearbeiten/i })).toBeInTheDocument();
        });

        it('zeigt das Stift-Emoji im Bearbeiten-Button an', () => {
            render(<BookingResult />);
            const editButton = screen.getByRole('button', { name: /Bearbeiten/i });
            expect(editButton).toHaveTextContent('✏️');
        });
    });

    describe('Tastaturbedienung', () => {
        it('erlaubt das Fokussieren des Bezahlen-Buttons über Tab-Taste', async () => {
            const user = userEvent.setup();
            render(<BookingResult onCheckout={mockOnCheckout} />);

            const payButton = screen.getByRole('button', { name: /Bezahlen/i });
            expect(payButton).not.toHaveFocus();

            await user.tab();
            payButton.focus();
            expect(payButton).toHaveFocus();
        });

        it('aktiviert den Button mit Enter-Taste, wenn dieser fokussiert ist', async () => {
            const user = userEvent.setup();
            render(<BookingResult onCheckout={mockOnCheckout} />);

            const payButton = screen.getByRole('button', { name: /Bezahlen/i });
            payButton.focus();
            expect(payButton).toHaveFocus();

            await user.keyboard('{Enter}');
            expect(mockOnCheckout).toHaveBeenCalledTimes(1);
        });

        it('aktiviert den Button mit Space-Taste, wenn dieser fokussiert ist', async () => {
            const user = userEvent.setup();
            render(<BookingResult onCheckout={mockOnCheckout} />);

            const payButton = screen.getByRole('button', { name: /Bezahlen/i });
            payButton.focus();

            await user.keyboard(' ');
            expect(mockOnCheckout).toHaveBeenCalledTimes(1);
        });

        it('erlaubt das Fokussieren des Bearbeiten-Buttons über Tab-Taste',() => {
            render(<BookingResult />);

            const editButton = screen.getByRole('button', { name: /Bearbeiten/i });
            editButton.focus();
            expect(editButton).toHaveFocus();
        });
    });

    describe('Barrierefreiheit (A11y mit jest-axe)', () => {
        it('hat keine Accessibility-Verletzungen beim Standardrendering', async () => {
            const { container } = render(<BookingResult />);
            const accessibilityResults = await axe(container);
            expect(accessibilityResults).toHaveNoViolations();
        });

        it('hat keine Accessibility-Verletzungen mit Custom-Tier und Sponsor-Rabatt', async () => {
            const { container } = render(
                <BookingResult tier={mockTier} isSponsor={true} />
            );
            const accessibilityResults = await axe(container);
            expect(accessibilityResults).toHaveNoViolations();
        });

        it('hat keine Accessibility-Verletzungen während loading', async () => {
            const { container } = render(<BookingResult isLoading={true} />);
            const accessibilityResults = await axe(container);
            expect(accessibilityResults).toHaveNoViolations();
        });

        it('rendert die Heading-Hierarchie korrekt (h1 → h2)', () => {
            render(<BookingResult />);

            const h1 = screen.getByRole('heading', { level: 1 });
            expect(h1).toBeInTheDocument();

            const h2s = screen.getAllByRole('heading', { level: 2 });
            expect(h2s.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('Layout und Styling', () => {
        it('rendert zwei Boxen nebeneinander auf Desktop (md:flex-row)', () => {
            const { container } = render(<BookingResult />);

            const mainLayout = container.querySelector('.flex.flex-col.md\\:flex-row');
            expect(mainLayout).toBeInTheDocument();
        });

        it('wendet die blauen Grenzstile auf beide Boxen an', () => {
            const { container } = render(<BookingResult />);

            const boxes = container.querySelectorAll('[style*="2563eb"]');
            expect(boxes.length).toBeGreaterThanOrEqual(2);
        });

        it('rendert die Stripe-Zahlungshinweis-Nachricht in der Rechnungsanschrift-Box', () => {
            render(<BookingResult />);
            expect(
                screen.getByText(/Die Zahlungsabwicklung erfolgt im nächsten Schritt via Stripe./i)
            ).toBeInTheDocument();
        });
    });

    describe('Props-Kombinationen und Edge Cases', () => {
        it('rendert den Button mit gelber Hintergrundfarbe (#facc15)', () => {
            const { container } = render(<BookingResult />);
            const button = container.querySelector('button[style*="facc15"]');
            expect(button).toBeInTheDocument();
        });

        it('rendert den Button mit schwarzer Textfarbe (#000000)', () => {
            const { container } = render(<BookingResult />);
            const button = container.querySelector('button[style*="000000"]');
            expect(button).toBeInTheDocument();
        });

        it('vereinigt Default-Werte, wenn keine Props übergeben werden', () => {
            render(<BookingResult />);

            expect(screen.getByText('Premium Ticket')).toBeInTheDocument();
            expect(screen.getByText('1.500,00 €')).toBeInTheDocument();
        });

        it('überschreibt Default-Werte mit benutzerdefinierten Props', () => {
            const customTier: TierDto = {
                tierId: 2,
                eventId: 1,
                basePrice: 100000,
                sponsorDiscountPercent: 10,
                available: true,
                slotsTotal: 20,
                features: ['Custom Feature 1'],
            };

            render(<BookingResult tier={customTier} isSponsor={true} />);

            expect(screen.getByText('Basis Plus Ticket')).toBeInTheDocument();
            expect(screen.getByText('Custom Feature 1')).toBeInTheDocument();
            expect(screen.getByText('900,00 €')).toBeInTheDocument();
        });

        it('handhaba Tier mit leeren Features-Array korrekt', () => {
            const tierEmptyFeatures: TierDto = { ...mockTier, features: [] };
            render(<BookingResult tier={tierEmptyFeatures} />);

            expect(screen.getByText('Keine Leistungen enthalten.')).toBeInTheDocument();
            expect(screen.queryByRole('list')).not.toBeInTheDocument();
        });

        it('rendert den Pfeil-Pfeil im Button korrekt', () => {
            render(<BookingResult />);
            expect(screen.getAllByText('→')).toBeInTheDocument();
        });
    });

    describe('Integration und komplexe Szenarien', () => {
        it('rendert eine vollständige Checkout-Bestellung mit Sponsor-Rabatt und Custom-Tier', async () => {
            const user = userEvent.setup();
            const onCheckout = jest.fn();

            render(
                <BookingResult
                    tier={mockTier}
                    isSponsor={true}
                    onCheckout={onCheckout}
                    isLoading={false}
                />
            );

            expect(
                screen.getByRole('heading', { name: /Rechnungsanschrift/i })
            ).toBeInTheDocument();
            expect(
                screen.getByRole('heading', { name: /Ihre Bestellung/i })
            ).toBeInTheDocument();

            expect(screen.getByText('Premium Ticket')).toBeInTheDocument();
            expect(screen.getByText('1.200,00 €')).toBeInTheDocument();

            expect(screen.getByText(/Sponsor-Rabatt \(-20%\)/i)).toBeInTheDocument();

            mockTier.features.forEach(feature => {
                expect(screen.getByText(feature)).toBeInTheDocument();
            });

            const payButton = screen.getByRole('button', { name: /Bezahlen/i });
            await user.click(payButton);
            expect(onCheckout).toHaveBeenCalledTimes(1);
        });

        it('unterscheidet zwischen Loading und aktivem Zustand des Buttons', () => {
            const { rerender } = render(
                <BookingResult isLoading={false} onCheckout={jest.fn()} />
            );

            let payButton = screen.getByRole('button', { name: /Bezahlen/i });
            expect(payButton).not.toHaveAttribute('disabled');
            expect(payButton).not.toHaveAttribute('aria-busy');

            rerender(<BookingResult isLoading={true} onCheckout={jest.fn()} />);
            payButton = screen.getByRole('button', { name: /Bezahlen/i });
            expect(payButton).toHaveAttribute('disabled');
            expect(payButton).toHaveAttribute('aria-busy', 'true');
        });
    });
});