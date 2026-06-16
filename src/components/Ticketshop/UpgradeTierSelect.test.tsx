import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UpgradeTierSelect } from './UpgradeTierSelect';
import type { TierDto } from '@/types/api.types';

expect.extend(toHaveNoViolations);

const mockCurrentTier: TierDto = {
  tierId: 1,
  eventId: 1,
  basePrice: 65000, // 650 €
  sponsorDiscountPercent: 15,
  features: [],
  slotsTotal: 10,
  available: true,
};

const mockTargetTier: TierDto = {
  tierId: 2,
  eventId: 1,
  basePrice: 100000, // 1.000 €
  sponsorDiscountPercent: 15,
  features: [],
  slotsTotal: 10,
  available: true,
};

describe('UpgradeTierSelect', () => {
  const onUpgradeMock = jest.fn();

  beforeEach(() => {
    onUpgradeMock.mockClear();
  });

  it('hat keine A11y-Violations', async () => {
    const { container } = render(
      <UpgradeTierSelect
        tier={mockTargetTier}
        currentTier={mockCurrentTier}
        onUpgrade={onUpgradeMock}
      />
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert den Namen des Zielpakets und die Differenzkosten', () => {
    render(
      <UpgradeTierSelect
        tier={mockTargetTier}
        currentTier={mockCurrentTier}
        onUpgrade={onUpgradeMock}
      />
    );

    expect(screen.getByText('Basis Plus Ticket')).toBeInTheDocument();
    expect(screen.getByText('Upgrade-Kosten: 350 €')).toBeInTheDocument();
  });

  it('ruft onUpgrade bei Klick auf Upgrade auf', async () => {
    const user = userEvent.setup();
    render(
      <UpgradeTierSelect
        tier={mockTargetTier}
        currentTier={mockCurrentTier}
        onUpgrade={onUpgradeMock}
      />
    );

    const button = screen.getByRole('button', { name: 'Upgrade' });
    await user.click(button);

    expect(onUpgradeMock).toHaveBeenCalledWith(2);
  });

  it('zeigt den Ladezustand des Buttons an', () => {
    render(
      <UpgradeTierSelect
        tier={mockTargetTier}
        currentTier={mockCurrentTier}
        onUpgrade={onUpgradeMock}
        isLoading={true}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });
});
