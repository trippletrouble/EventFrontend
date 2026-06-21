import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import { BookingStatus } from './BookingStatus';
import { mockBooking } from '@/__tests__/mocks/data/bookings';
import type { BookingDto } from '@/types/api.types';

expect.extend(toHaveNoViolations);

describe('BookingStatus', () => {
  it('hat keine A11y-Violations', async () => {
    const { container } = render(<BookingStatus bookings={[mockBooking]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('hat keine A11y-Violations ohne Buchung', async () => {
    const { container } = render(<BookingStatus bookings={[]} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert die Überschrift', () => {
    render(<BookingStatus bookings={[mockBooking]} />);
    expect(screen.getByText('Ihre Buchung')).toBeInTheDocument();
  });

  it('zeigt Leermeldung ohne Buchung', () => {
    render(<BookingStatus bookings={[]} />);
    expect(screen.getByText('Noch keine Buchung vorhanden.')).toBeInTheDocument();
  });

  it('rendert den Ticket-Titel für Tier 1', () => {
    render(<BookingStatus bookings={[mockBooking]} />);
    expect(screen.getByText('Basis Ticket')).toBeInTheDocument();
  });

  it('rendert den Ticket-Titel für Tier 2', () => {
    const tier2: BookingDto = { ...mockBooking, tierId: 2 };
    render(<BookingStatus bookings={[tier2]} />);
    expect(screen.getByText('Basis Plus Ticket')).toBeInTheDocument();
  });

  it('rendert den Ticket-Titel für Tier 3', () => {
    const tier3: BookingDto = { ...mockBooking, tierId: 3 };
    render(<BookingStatus bookings={[tier3]} />);
    expect(screen.getByText('Premium Ticket')).toBeInTheDocument();
  });

  it('rendert das Buchungsdatum korrekt', () => {
    render(<BookingStatus bookings={[mockBooking]} />);
    expect(screen.getByText(/Gebucht am 11\.06\.2026/)).toBeInTheDocument();
  });

  it('rendert den Preis für Tier 1', () => {
    render(<BookingStatus bookings={[mockBooking]} />);
    expect(screen.getByText('650€')).toBeInTheDocument();
  });

  it('zeigt Messestand-Info für Tier 1 (3m²)', () => {
    render(<BookingStatus bookings={[mockBooking]} />);
    expect(screen.getByText('Ein Messestand mit 3m² im Lagebereich 2')).toBeInTheDocument();
  });

  it('zeigt Messestand-Info für Tier 2 (6m², Lagebereich 2)', () => {
    const tier2: BookingDto = { ...mockBooking, tierId: 2 };
    render(<BookingStatus bookings={[tier2]} />);
    expect(screen.getByText('Ein Messestand mit 6m² im Lagebereich 2')).toBeInTheDocument();
  });

  it('zeigt Aufwerten-Link für Tickets unter Tier 4', () => {
    render(<BookingStatus bookings={[mockBooking]} />);
    const link = screen.getByRole('link', { name: /Aufwerten/ });
    expect(link).toHaveAttribute('href', '/ticketshop');
  });

  it('zeigt keinen Aufwerten-Link für Tier 4', () => {
    const tier4: BookingDto = { ...mockBooking, tierId: 4 };
    render(<BookingStatus bookings={[tier4]} />);
    expect(screen.queryByRole('link', { name: /Aufwerten/ })).not.toBeInTheDocument();
  });

  it('rendert die enthaltenen Leistungen als Liste', () => {
    render(<BookingStatus bookings={[mockBooking]} />);
    const list = screen.getByRole('list', { name: 'Enthaltene Leistungen' });
    expect(list).toBeInTheDocument();
  });

  it('rendert Features als Listenpunkte (ohne Messestand)', () => {
    render(<BookingStatus bookings={[mockBooking]} />);
    expect(screen.getByText('Ausstellerprofil')).toBeInTheDocument();
    expect(screen.getByText('Ganzseitige Anzeige')).toBeInTheDocument();
  });

  it('verwendet section mit aria-labelledby', () => {
    render(<BookingStatus bookings={[mockBooking]} />);
    const section = screen.getByRole('region', { name: 'Ihre Buchung' });
    expect(section).toBeInTheDocument();
  });

  it('fällt auf Tier 1 zurück bei unbekannter tierId', () => {
    const unknown: BookingDto = { ...mockBooking, tierId: 99 };
    render(<BookingStatus bookings={[unknown]} />);
    expect(screen.getByText('Basis Ticket')).toBeInTheDocument();
  });

  it('zeigt Messestand-Info für Tier 3 (9m², generischer Text)', () => {
    const tier3: BookingDto = { ...mockBooking, tierId: 3 };
    render(<BookingStatus bookings={[tier3]} />);
    expect(screen.getByText('Ein Messestand 9m²')).toBeInTheDocument();
  });

  it('zeigt Messestand-Info für Tier 4 (12m², generischer Text)', () => {
    const tier4: BookingDto = { ...mockBooking, tierId: 4 };
    render(<BookingStatus bookings={[tier4]} />);
    expect(screen.getByText('Ein Messestand 12m²')).toBeInTheDocument();
  });
});
