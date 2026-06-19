import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TierCard } from './TierCard';
import type { TierDto } from '@/types/api.types';

expect.extend(toHaveNoViolations);

const mockTier: TierDto = {
  tierId: 1,
  eventId: 1,
  basePrice: 65000, // 650,00 €
  sponsorDiscountPercent: 15,
  features: ['Feature 1', 'Feature 2'],
  slotsTotal: 10,
  available: true,
};

describe('TierCard', () => {
  const onSelectMock = jest.fn();

  beforeEach(() => {
    onSelectMock.mockClear();
  });

  it('hat keine A11y-Violations', async () => {
    const { container } = render(
      <TierCard tier={mockTier} isSponsor={false} onSelect={onSelectMock} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert die Details des Pakets korrekt', () => {
    render(<TierCard tier={mockTier} isSponsor={false} onSelect={onSelectMock} />);

    expect(screen.getByText('Basis Ticket')).toBeInTheDocument();
    expect(screen.getByText('650€')).toBeInTheDocument();
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.queryByText('Freunde & Förderer')).not.toBeInTheDocument();
  });

  it('zeigt den Sponsor-Rabatt an, wenn der User Sponsor ist', () => {
    render(<TierCard tier={mockTier} isSponsor={true} onSelect={onSelectMock} />);

    expect(screen.getByText('Freunde & Förderer')).toBeInTheDocument();
    expect(screen.getByText('552,5€')).toBeInTheDocument();
  });

  it('ruft onSelect bei Klick auf Auswählen auf', async () => {
    const user = userEvent.setup();
    render(<TierCard tier={mockTier} isSponsor={false} onSelect={onSelectMock} />);

    const button = screen.getByRole('button', { name: 'Ticket kaufen →' });
    await user.click(button);

    expect(onSelectMock).toHaveBeenCalledWith(1);
  });

  it('ist ausgegraut und zeigt Ausverkauft an, wenn nicht verfügbar', () => {
    const unavailableTier = { ...mockTier, available: false };
    render(<TierCard tier={unavailableTier} isSponsor={false} onSelect={onSelectMock} />);

    const button = screen.getByRole('button', { name: 'Ausverkauft' });
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('zeigt Ausgewählt an, wenn das Paket selektiert ist', () => {
    render(
      <TierCard
        tier={mockTier}
        isSponsor={false}
        onSelect={onSelectMock}
        isSelected={true}
      />
    );

    const button = screen.getByRole('button', { name: 'Ausgewählt' });
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });
});
