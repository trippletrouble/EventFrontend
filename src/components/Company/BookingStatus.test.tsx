import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import { BookingStatus } from './BookingStatus';
import { mockBooking, mockTiers } from '@/__tests__/mocks/data/bookings';
import type { BookingDto, TierDto } from '@/types/api.types';

expect.extend(toHaveNoViolations);

describe('BookingStatus', () => {
  it('hat keine A11y-Violations', async () => {
    const { container } = render(<BookingStatus bookings={[mockBooking]} tiers={mockTiers} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('hat keine A11y-Violations ohne Buchung', async () => {
    const { container } = render(<BookingStatus bookings={[]} tiers={mockTiers} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert die Überschrift', () => {
    render(<BookingStatus bookings={[mockBooking]} tiers={mockTiers} />);
    expect(screen.getByText('Ihre Buchung')).toBeInTheDocument();
  });

  it('zeigt Leermeldung ohne Buchung', () => {
    render(<BookingStatus bookings={[]} tiers={mockTiers} />);
    expect(screen.getByText('Noch keine Buchung vorhanden.')).toBeInTheDocument();
  });

  it('rendert den Ticket-Titel für Tier 1', () => {
    render(<BookingStatus bookings={[mockBooking]} tiers={mockTiers} />);
    expect(screen.getByText('Basis Ticket')).toBeInTheDocument();
  });

  it('rendert den Ticket-Titel für Tier 2', () => {
    const tier2: BookingDto = { ...mockBooking, tierId: 2 };
    render(<BookingStatus bookings={[tier2]} tiers={mockTiers} />);
    expect(screen.getByText('Basis Plus Ticket')).toBeInTheDocument();
  });

  it('rendert den Ticket-Titel für Tier 3', () => {
    const tier3: BookingDto = { ...mockBooking, tierId: 3 };
    render(<BookingStatus bookings={[tier3]} tiers={mockTiers} />);
    expect(screen.getByText('Premium Ticket')).toBeInTheDocument();
  });

  it('rendert das Buchungsdatum korrekt', () => {
    render(<BookingStatus bookings={[mockBooking]} tiers={mockTiers} />);
    expect(screen.getByText(/Gebucht am 11\.06\.2026/)).toBeInTheDocument();
  });

  it('rendert den Preis für Tier 1', () => {
    render(<BookingStatus bookings={[mockBooking]} tiers={mockTiers} />);
    expect(screen.getByText('650€')).toBeInTheDocument();
  });

  it('zeigt Messestand-Info für Tier 1 (3m²)', () => {
    render(<BookingStatus bookings={[mockBooking]} tiers={mockTiers} />);
    expect(screen.getByText('Ein Messestand mit 3m² im Lagebereich 2')).toBeInTheDocument();
  });

  it('zeigt Messestand-Info für Tier 2 (6m², Lagebereich 2)', () => {
    const tier2: BookingDto = { ...mockBooking, tierId: 2 };
    render(<BookingStatus bookings={[tier2]} tiers={mockTiers} />);
    expect(screen.getByText('Ein Messestand mit 6m² im Lagebereich 2')).toBeInTheDocument();
  });

  it('zeigt Aufwerten-Link für Tickets unter Tier 4', () => {
    render(<BookingStatus bookings={[mockBooking]} tiers={mockTiers} />);
    const link = screen.getByRole('link', { name: /Aufwerten/ });
    expect(link).toHaveAttribute('href', '/ticketshop');
  });

  it('zeigt keinen Aufwerten-Link für Tier 4', () => {
    const tier4: BookingDto = { ...mockBooking, tierId: 4 };
    render(<BookingStatus bookings={[tier4]} tiers={mockTiers} />);
    expect(screen.queryByRole('link', { name: /Aufwerten/ })).not.toBeInTheDocument();
  });

  it('rendert die enthaltenen Leistungen als Liste', () => {
    render(<BookingStatus bookings={[mockBooking]} tiers={mockTiers} />);
    const list = screen.getByRole('list', { name: 'Enthaltene Leistungen' });
    expect(list).toBeInTheDocument();
  });

  it('rendert Features als Listenpunkte (ohne Messestand)', () => {
    render(<BookingStatus bookings={[mockBooking]} tiers={mockTiers} />);
    expect(screen.getByText('Ausstellerprofil')).toBeInTheDocument();
    expect(screen.getByText('Ganzseitige Anzeige')).toBeInTheDocument();
  });

  it('verwendet section mit aria-labelledby', () => {
    render(<BookingStatus bookings={[mockBooking]} tiers={mockTiers} />);
    const section = screen.getByRole('region', { name: 'Ihre Buchung' });
    expect(section).toBeInTheDocument();
  });

  it('zeigt Fallback bei unbekannter tierId', () => {
    const unknown: BookingDto = { ...mockBooking, tierId: 99 };
    render(<BookingStatus bookings={[unknown]} tiers={mockTiers} />);
    expect(screen.getByText('Paketdetails werden geladen…')).toBeInTheDocument();
  });

  it('zeigt Fallback wenn keine Tier-Daten vorhanden sind', () => {
    render(<BookingStatus bookings={[mockBooking]} tiers={[]} />);
    expect(screen.getByText('Basis Ticket')).toBeInTheDocument();
    expect(screen.getByText('Paketdetails werden geladen…')).toBeInTheDocument();
    expect(screen.getByText(/Gebucht am/)).toBeInTheDocument();
  });

  it('hat keine A11y-Violations im Tier-Fallback', async () => {
    const { container } = render(<BookingStatus bookings={[mockBooking]} tiers={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('zeigt Lagebereich 1 für 6m²-Tier mit tierId ≠ 2', () => {
    const tier3With6m: TierDto = { ...mockTiers[1], tierId: 3, features: ['Messestand 6m²', 'Ausstellerprofil'] };
    const booking3: BookingDto = { ...mockBooking, tierId: 3 };
    render(<BookingStatus bookings={[booking3]} tiers={[tier3With6m]} />);
    expect(screen.getByText('Ein Messestand mit 6m² im Lagebereich 1')).toBeInTheDocument();
  });

  it('rendert ohne Features wenn Tier keine hat', () => {
    const tierOhneFeatures: TierDto = { ...mockTiers[0], features: [] };
    render(<BookingStatus bookings={[mockBooking]} tiers={[tierOhneFeatures]} />);
    expect(screen.getByText('Basis Ticket')).toBeInTheDocument();
    expect(screen.getByText('650€')).toBeInTheDocument();
    expect(screen.queryByText(/Messestand/)).not.toBeInTheDocument();
  });

  it('behandelt undefined Features defensiv', () => {
    const tierUndefinedFeatures = { ...mockTiers[0], features: undefined } as unknown as TierDto;
    render(<BookingStatus bookings={[mockBooking]} tiers={[tierUndefinedFeatures]} />);
    expect(screen.getByText('Basis Ticket')).toBeInTheDocument();
    expect(screen.queryByText(/Messestand/)).not.toBeInTheDocument();
  });

  it('findet Stand-Feature über m²-Fallback', () => {
    const tierMitM2: TierDto = { ...mockTiers[0], features: ['10m² Standplatz', 'Ausstellerprofil'] };
    render(<BookingStatus bookings={[mockBooking]} tiers={[tierMitM2]} />);
    expect(screen.getByText('Ein 10m² Standplatz')).toBeInTheDocument();
  });

  it('zeigt Messestand-Info für Tier 3 (9m², generischer Text)', () => {
    const tier3: BookingDto = { ...mockBooking, tierId: 3 };
    render(<BookingStatus bookings={[tier3]} tiers={mockTiers} />);
    expect(screen.getByText('Ein Messestand 9m²')).toBeInTheDocument();
  });

  it('zeigt Messestand-Info für Tier 4 (12m², generischer Text)', () => {
    const tier4: BookingDto = { ...mockBooking, tierId: 4 };
    render(<BookingStatus bookings={[tier4]} tiers={mockTiers} />);
    expect(screen.getByText('Ein Messestand 12m²')).toBeInTheDocument();
  });
});
