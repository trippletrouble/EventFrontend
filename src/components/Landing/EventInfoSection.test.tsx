import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { EventInfoSection } from './EventInfoSection';

expect.extend(toHaveNoViolations);

describe('EventInfoSection-Komponente', () => {
  it('hat keine Barrierefreiheitsverletzungen', async () => {
    const { container } = render(<EventInfoSection />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert die Hauptüberschrift korrekt', () => {
    render(<EventInfoSection />);
    const heading = screen.getByRole('heading', { name: /Direkt an dem Campus/i });
    expect(heading).toBeInTheDocument();
  });

  it('rendert alle Veranstaltungsdetails (Adresse, Zeit, Parkplatz)', () => {
    render(<EventInfoSection />);
    
    // Adresse
    const address = screen.getByText('Alfons-Goppel-Platz 1, 95028 Hof');
    expect(address).toBeInTheDocument();

    // Uhrzeit
    const time = screen.getByText('09:30 – 16:00 Uhr');
    expect(time).toBeInTheDocument();

    // Parkplatz
    const parking = screen.getByText(/Aussteller Parkplatz P4/i);
    expect(parking).toBeInTheDocument();
  });

  it('rendert das Google Maps Embed iframe mit passendem Titel', () => {
    render(<EventInfoSection />);
    const iframe = screen.getByTitle('Standort Hochschule Hof auf Google Maps');
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute('src');
    expect(iframe.getAttribute('src')).toContain('google.com/maps/embed');
  });
});
