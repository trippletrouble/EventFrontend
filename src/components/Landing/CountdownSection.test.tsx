import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CountdownSection } from './CountdownSection';

expect.extend(toHaveNoViolations);

describe('CountdownSection-Komponente', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    // Systemzeit festlegen auf: 10. Mai 2027, 09:30:00 Uhr
    jest.setSystemTime(new Date('2027-05-10T09:30:00').getTime());
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('hat keine Barrierefreiheitsverletzungen', async () => {
    // Temporarily switch to real timers for axe-core to avoid timeout hangs
    jest.useRealTimers();
    
    const { container } = render(<CountdownSection targetDate="2027-05-12T09:30:00" />);
    expect(await axe(container)).toHaveNoViolations();
    
    // Restore fake timers for subsequent test cases
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2027-05-10T09:30:00').getTime());
  });

  it('rendert das formatierte Zieldatum korrekt', () => {
    render(<CountdownSection targetDate="2027-05-12T09:30:00" />);
    act(() => {
      jest.advanceTimersByTime(1);
    });
    const dateText = screen.getByText(/12\. Mai 2027/);
    expect(dateText).toBeInTheDocument();
  });

  it('berechnet und rendert die verbleibende Zeit korrekt', () => {
    render(<CountdownSection targetDate="2027-05-12T09:30:00" />);
    act(() => {
      jest.advanceTimersByTime(1);
    });
    // Am 10. Mai 09:30 sind es exakt 2 Tage bis zum 12. Mai 09:30
    const daysElement = screen.getByLabelText('2 Tage');
    const hoursElement = screen.getByLabelText('0 Stunden');
    const minutesElement = screen.getByLabelText('0 Minuten');

    expect(daysElement).toBeInTheDocument();
    expect(hoursElement).toBeInTheDocument();
    expect(minutesElement).toBeInTheDocument();
  });

  it('aktualisiert den Countdown nach Ablauf der Zeit im Intervall', () => {
    render(<CountdownSection targetDate="2027-05-12T09:30:00" />);
    act(() => {
      jest.advanceTimersByTime(1);
    });

    // 1 Minute (60.000 ms) vergehen lassen
    act(() => {
      jest.advanceTimersByTime(60_000);
    });

    // Nach 1 Minute: 1 Tag, 23 Stunden, 59 Minuten verbleibend
    const daysElement = screen.getByLabelText('1 Tage');
    const hoursElement = screen.getByLabelText('23 Stunden');
    const minutesElement = screen.getByLabelText('59 Minuten');

    expect(daysElement).toBeInTheDocument();
    expect(hoursElement).toBeInTheDocument();
    expect(minutesElement).toBeInTheDocument();
  });

  it('zeigt eine passende Meldung an, wenn das Event vorbei ist', () => {
    // Systemzeit nach das Zieldatum setzen
    jest.setSystemTime(new Date('2027-05-13T09:30:00').getTime());

    render(<CountdownSection targetDate="2027-05-12T09:30:00" />);
    act(() => {
      jest.advanceTimersByTime(1);
    });

    const passedText = screen.getByText('Die Unternehmerbörse hat erfolgreich stattgefunden.');
    expect(passedText).toBeInTheDocument();
  });

  it('nutzt das Standarddatum, wenn kein targetDate übergeben wird', () => {
    render(<CountdownSection />);
    act(() => {
      jest.advanceTimersByTime(1);
    });
    const dateText = screen.getByText(/12\. Mai 2027/);
    expect(dateText).toBeInTheDocument();
  });
});
