import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import { TierList } from './TierList';
import type { TierDto } from '@/types/api.types';

expect.extend(toHaveNoViolations);

const mockTiers: TierDto[] = [
  {
    tierId: 1,
    eventId: 1,
    basePrice: 65000,
    sponsorDiscountPercent: 15,
    features: ['Feature A'],
    slotsTotal: 10,
    available: true,
  },
  {
    tierId: 2,
    eventId: 1,
    basePrice: 85000,
    sponsorDiscountPercent: 20,
    features: ['Feature B'],
    slotsTotal: 5,
    available: true,
  },
];

describe('TierList', () => {
  const onSelectMock = jest.fn();

  beforeEach(() => {
    onSelectMock.mockClear();
  });

  it('hat keine A11y-Violations', async () => {
    const { container } = render(
      <TierList tiers={mockTiers} isSponsor={false} onSelect={onSelectMock} />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert eine Liste von Paket-Karten', () => {
    render(
      <TierList tiers={mockTiers} isSponsor={false} onSelect={onSelectMock} />
    );

    expect(screen.getByText('Basis Ticket')).toBeInTheDocument();
    expect(screen.getByText('Basis Plus Ticket')).toBeInTheDocument();
  });

  it('zeigt einen Hinweis an, wenn keine Pakete vorhanden sind', () => {
    render(
      <TierList tiers={[]} isSponsor={false} onSelect={onSelectMock} />
    );

    expect(screen.getByText('Keine Pakete verfügbar.')).toBeInTheDocument();
  });
});
