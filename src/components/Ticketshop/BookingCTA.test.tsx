import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BookingCTA } from './BookingCTA';
import type { TierDto } from '@/types/api.types';

expect.extend(toHaveNoViolations);

const mockTier: TierDto = {
  tierId: 2,
  eventId: 1,
  basePrice: 100000,
  sponsorDiscountPercent: 15,
  features: ['Feature A'],
  slotsTotal: 10,
  available: true,
};

describe('BookingCTA', () => {
  const onCheckoutMock = jest.fn();

  beforeEach(() => {
    onCheckoutMock.mockClear();
  });

  it('hat keine A11y-Violations', async () => {
    const { container } = render(
      <BookingCTA tier={mockTier} isSponsor={false} onCheckout={onCheckoutMock} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert die Buchungszusammenfassung für Nicht-Sponsoren korrekt', () => {
    render(
      <BookingCTA tier={mockTier} isSponsor={false} onCheckout={onCheckoutMock} />
    );

    expect(screen.getByText('Buchungszusammenfassung')).toBeInTheDocument();
    expect(screen.getByText('Basis Plus Ticket')).toBeInTheDocument();
    expect(screen.queryByText(/Sponsor-Rabatt/)).not.toBeInTheDocument();
    
    // Check total price (appears twice: basis and total)
    const prices = screen.getAllByText((content) => content.includes('1.000') && content.includes('€'));
    expect(prices.length).toBe(2);
  });

  it('rendert Rabatte und Gesamtpreis für Sponsoren korrekt', () => {
    render(
      <BookingCTA tier={mockTier} isSponsor={true} onCheckout={onCheckoutMock} />
    );

    expect(screen.getByText('Sponsor-Rabatt (-15%):')).toBeInTheDocument();
    expect(screen.getByText('-150 €')).toBeInTheDocument();
    expect(screen.getByText('850 €')).toBeInTheDocument();
  });

  it('ruft onCheckout bei Klick auf den Button auf', async () => {
    const user = userEvent.setup();
    render(
      <BookingCTA tier={mockTier} isSponsor={false} onCheckout={onCheckoutMock} />
    );

    const button = screen.getByRole('button', { name: 'Jetzt bezahlen' });
    await user.click(button);

    expect(onCheckoutMock).toHaveBeenCalledTimes(1);
  });

  it('zeigt den Ladezustand des Buttons an', () => {
    render(
      <BookingCTA
        tier={mockTier}
        isSponsor={false}
        onCheckout={onCheckoutMock}
        isLoading={true}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });
});
