import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import { UpgradeModal } from './UpgradeModal';
import type { TierDto } from '@/types/api.types';

expect.extend(toHaveNoViolations);

const mockCurrentTier: TierDto = {
  tierId: 1,
  eventId: 1,
  basePrice: 65000,
  sponsorDiscountPercent: 15,
  features: [],
  slotsTotal: 10,
  available: true,
};

const mockAvailableTiers: TierDto[] = [
  {
    tierId: 1,
    eventId: 1,
    basePrice: 65000,
    sponsorDiscountPercent: 15,
    features: [],
    slotsTotal: 10,
    available: true,
  },
  {
    tierId: 2,
    eventId: 1,
    basePrice: 100000,
    sponsorDiscountPercent: 15,
    features: [],
    slotsTotal: 10,
    available: true,
  },
  {
    tierId: 3,
    eventId: 1,
    basePrice: 120000,
    sponsorDiscountPercent: 20,
    features: [],
    slotsTotal: 5,
    available: true,
  },
];

describe('UpgradeModal', () => {
  const onCloseMock = jest.fn();
  const onUpgradeMock = jest.fn();

  beforeEach(() => {
    onCloseMock.mockClear();
    onUpgradeMock.mockClear();
  });

  it('hat keine A11y-Violations', async () => {
    const { container } = render(
      <UpgradeModal
        isOpen={true}
        onClose={onCloseMock}
        currentTier={mockCurrentTier}
        availableTiers={mockAvailableTiers}
        onUpgrade={onUpgradeMock}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert das Modal mit aktuellem Paket und Upgrade-Kandidaten', () => {
    render(
      <UpgradeModal
        isOpen={true}
        onClose={onCloseMock}
        currentTier={mockCurrentTier}
        availableTiers={mockAvailableTiers}
        onUpgrade={onUpgradeMock}
      />
    );

    expect(screen.getByText('Standplatz-Upgrade auswählen')).toBeInTheDocument();
    expect(screen.getByText('Basis Ticket')).toBeInTheDocument();
    expect(screen.getByText('Basis Plus Ticket')).toBeInTheDocument();
    expect(screen.getByText('Premium Ticket')).toBeInTheDocument();
  });

  it('zeigt einen Hinweis, wenn keine höheren Pakete verfügbar sind', () => {
    // Current tier is the highest (Premium Deluxe / Tier 3 here)
    render(
      <UpgradeModal
        isOpen={true}
        onClose={onCloseMock}
        currentTier={mockAvailableTiers[2]}
        availableTiers={mockAvailableTiers}
        onUpgrade={onUpgradeMock}
      />
    );

    expect(screen.getByText('Keine höheren Upgrade-Pakete verfügbar.')).toBeInTheDocument();
  });
});
