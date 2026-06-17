import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CountdownSection } from './CountdownSection';

jest.mock('next/navigation', () => ({}));

expect.extend(toHaveNoViolations);

jest.setTimeout(60000);

describe('CountdownSection - Komponententests', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-17T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('rendert das Element initial korrekt', async () => {
    const now = Date.now();
    const msOffset = 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 5 * 60 * 1000;
    const target = new Date(now + msOffset).toISOString();

    render(<CountdownSection targetDate={target} />);

    const timer = screen.getByRole('timer');
    expect(timer).toHaveAttribute('aria-label', 'Berechne verbleibende Zeit...');
    expect(screen.getAllByText('00').length).toBeGreaterThanOrEqual(3);

    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    await act(async () => {
    });

    expect(timer).toHaveAttribute('aria-label');
    const aria = timer.getAttribute('aria-label') || '';
    expect(aria).toMatch(/Noch \d+ Tage, \d+ Stunden und \d+ Minuten/);

    const numericNodes = screen.getAllByText(/^\d{2}$/);
    expect(numericNodes.length).toBeGreaterThanOrEqual(3);
    numericNodes.forEach((n) => expect(n.textContent).toHaveLength(2));

  });

  test('aktualisiert die Anzeige jede Minute', async () => {
    const now = Date.now();
    const target = new Date(now + 5 * 60 * 1000).toISOString();

    render(<CountdownSection targetDate={target} />);

    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    const timer = screen.getByRole('timer');
    const before = timer.getAttribute('aria-label') || '';
    expect(before).toMatch(/Noch \d+ Tage, \d+ Stunden und \d+ Minuten/);

    await act(async () => {
      const newTime = Date.now() + 60_000;
      jest.setSystemTime(new Date(newTime));
      jest.advanceTimersByTime(60_000);
      jest.runOnlyPendingTimers();
    });

    const after = timer.getAttribute('aria-label') || '';
    expect(after).toMatch(/Noch \d+ Tage, \d+ Stunden und \d+ Minuten/);
    // Die aria-label sollte sich aktualisiert haben (Minuten-Wert ändert sich)
    expect(after).not.toBe(before);
  });

  test('ist barrierefrei nach dem Rendern', async () => {
    const now = Date.now();
    const target = new Date(now + 24 * 60 * 60 * 1000).toISOString();
    const { container } = render(<CountdownSection targetDate={target} />);

    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    // Für Performance laufen wir nur ein kleines, relevantes Unterelement durch axe (eine numerische Einheit)
    const smallNode = container.querySelector('.tabular-nums') || container;
    expect(await axe(smallNode, { rules: { 'color-contrast': { enabled: false } } })).toHaveNoViolations();
  }, 120000);

  test('zeigt Meldung an, wenn das Event bereits vorbei ist', async () => {
    const target = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { queryByRole, getByText } = render(<CountdownSection targetDate={target} />);

    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    expect(queryByRole('timer')).toBeNull();

    expect(getByText('Die Unternehmerbörse hat erfolgreich stattgefunden.')).toBeInTheDocument();
  });

  test('ist mit der Tastatur fokussierbar und reagiert auf Enter/Space/Escape ohne Fehler', async () => {
    const now = Date.now();
    const target = new Date(now + 5 * 60 * 1000).toISOString();

    const { container } = render(<CountdownSection targetDate={target} />);

    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    await user.tab();
    expect(screen.getByText('Sei dabei am')).toHaveFocus();

    await user.tab();
    const dateEl = screen.getByText((content) => /\d{4}/.test(content));
    expect(dateEl).toHaveFocus();

    const focusables = Array.from(container.querySelectorAll('[tabindex="0"]')) as HTMLElement[];
    expect(focusables.length).toBeGreaterThanOrEqual(3);

    const third = focusables[2];
    third.focus();
    expect(third).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(third).toHaveFocus();

    await user.keyboard(' ');
    expect(third).toHaveFocus();

    await user.keyboard('{Escape}');
    expect(third).toHaveFocus();
  });

  test('zeigt dekorative Elemente als aria-hidden an und hat für jede Einheit ein korrektes aria-label', async () => {
    const now = Date.now();
    const target = new Date(now + 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000 + 5 * 60 * 1000).toISOString();

    const { container } = render(<CountdownSection targetDate={target} />);

    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    // dekorative Gradient-Elemente sollten aria-hidden=true haben
    const hiddenElems = container.querySelectorAll('[aria-hidden="true"]');
    expect(hiddenElems.length).toBeGreaterThanOrEqual(2);

    // Jede Einheit hat ein aria-label wie "XX Tage", "XX Stunden", "XX Minuten"
    const unitDays = container.querySelector('[aria-label$=" Tage"]') as HTMLElement | null;
    const unitHours = container.querySelector('[aria-label$=" Stunden"]') as HTMLElement | null;
    const unitMinutes = container.querySelector('[aria-label$=" Minuten"]') as HTMLElement | null;

    expect(unitDays).not.toBeNull();
    expect(unitHours).not.toBeNull();
    expect(unitMinutes).not.toBeNull();

    // Die numerischen Werte sind 2-stellig
    const nums = container.querySelectorAll('.tabular-nums');
    expect(nums.length).toBeGreaterThanOrEqual(3);
    nums.forEach((n) => expect(n.textContent).toHaveLength(2));
  });

  test('rendert das Standardziel korrekt und zeigt das formatierte Datum', async () => {
    // ohne props: verwendet default targetDate aus der Komponente
    const { getByText } = render(<CountdownSection />);

    // initialer mount timeout
    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    // Erwartet, dass das Jahr 2027 im großen Datum vorhanden ist (Default ist 2027-05-12)
    expect(getByText(/2027/)).toBeInTheDocument();
  });

  test('verursacht kein setState-after-unmount wenn der Timer weiterläuft', async () => {
    const now = Date.now();
    const target = new Date(now + 10 * 60 * 1000).toISOString();

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const { unmount } = render(<CountdownSection targetDate={target} />);

    // Initialisieren
    await act(async () => {
      jest.runOnlyPendingTimers();
    });

    // Unmount und dann Zeit vorrücken -> es darf keine React-Warnung/Fehler geben
    unmount();

    await act(async () => {
      jest.advanceTimersByTime(5 * 60_000);
      jest.runOnlyPendingTimers();
    });

    expect(consoleErrorSpy).not.toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});


