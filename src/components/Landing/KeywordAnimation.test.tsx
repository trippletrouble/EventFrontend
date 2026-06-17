import React from 'react';
import { render, screen, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { KeywordAnimation } from './KeywordAnimation';

// Hilfstyp für die Props über Ableitung vom Komponenten-Typ
type KeywordAnimationProps = React.ComponentProps<typeof KeywordAnimation>;

describe('KeywordAnimation-Komponente', () => {
    afterEach(() => {
        // allgemeine Aufräumarbeiten nach jedem Test
        cleanup();
        try {
            // falls Fake-Timers aktiv sind, zurück auf Real-Timers wechseln
            jest.useRealTimers();
        } finally {
            jest.clearAllTimers();
        }
    });

    test('rendert das Element initial korrekt', () => {
        const props: KeywordAnimationProps = { text: 'Test-Keyword' };
        render(<KeywordAnimation {...props} />);

        const span = screen.getByText('Test-Keyword');
        expect(span).toBeInTheDocument();
        // initial sollte die versteckte Klasse gesetzt sein
        expect(span).toHaveClass('opacity-0');
        expect(span).toHaveClass('translate-x-12');
    });

    test('zeigt das Element nach Verzögerung sichtbar an', async () => {
        // Für Timer-bezogene Assertions Fake-Timer verwenden
        jest.useFakeTimers();
        const props: KeywordAnimationProps = { text: 'Delayed', delay: 500 };
        const { container } = render(<KeywordAnimation {...props} />);

        const span = screen.getByText('Delayed');
        expect(span).toHaveClass('opacity-0');

        // Zeit vorspulen (synchron mit act)
        act(() => {
            jest.advanceTimersByTime(500);
        });

        // Nach Ablauf des Timers sollte die sichtbare Klasse vorhanden sein
        expect(span).toHaveClass('opacity-100');
        expect(span).toHaveClass('translate-x-0');

        // Accessibility-Check mit Real-Timern, da axe interne Timer nutzt
        jest.useRealTimers();
        await expect(await axe(container)).toHaveNoViolations();
    });

    test('verhält sich korrekt bei delay = 0 und sofortiger Anzeige', async () => {
        jest.useFakeTimers();
        const props: KeywordAnimationProps = { text: 'ZeroDelay', delay: 0 };
        const { container } = render(<KeywordAnimation {...props} />);

        const span = screen.getByText('ZeroDelay');
        // Noch vor dem Ausführen der Timer ist das Element versteckt
        expect(span).toHaveClass('opacity-0');

        act(() => {
            jest.runOnlyPendingTimers();
        });

        expect(span).toHaveClass('opacity-100');

        // Accessibility-Check ebenfalls hier, mit Real-Timern
        jest.useRealTimers();
        await expect(await axe(container)).toHaveNoViolations();
    });

    test('bereinigt den Timer beim Unmount, sodass kein Fehler entsteht', () => {
        jest.useFakeTimers();
        const props: KeywordAnimationProps = { text: 'UnmountTest', delay: 1000 };
        const { unmount } = render(<KeywordAnimation {...props} />);

        // Unmount bevor Timer abläuft
        unmount();

        // Wenn der Timer nicht bereinigt worden wäre, könnte ein Fehler beim Ablauf auftreten.
        // Wir stellen sicher, dass beim Fortschalten der Timer nichts schiefgeht.
        expect(() => jest.runOnlyPendingTimers()).not.toThrow();
        jest.useRealTimers();
    });

    test('ist nicht fokusierbar und beeinflusst die Tastaturnavigation nicht', async () => {
        // user-event verwendet intern Timer; sicherstellen, dass Real-Timer aktiv sind
        jest.useRealTimers();
        const user = userEvent.setup();
        render(
            <div>
                <button>Erster</button>
                <KeywordAnimation text="NavTest" />
                <button>Zweiter</button>
            </div>
        );

        // Tab fokussiert die fokussierbaren Elemente und überspringt das span
        await user.tab();
        // Der erste Button sollte fokussiert sein
        const firstButton = screen.getByText('Erster') as HTMLButtonElement;
        expect(document.activeElement).toBe(firstButton);

        // Tab weiter -> zweiter Button sollte als nächstes fokussiert werden, das span wird übersprungen
        await user.tab();
        const secondButton = screen.getByText('Zweiter') as HTMLButtonElement;
        expect(document.activeElement).toBe(secondButton);
    });

    test('reagiert nicht auf Enter, Space oder Escape, wenn keine Interaktivität vorhanden ist', async () => {
        jest.useRealTimers();
        const user = userEvent.setup();
        render(<KeywordAnimation text="KeyTest" delay={1000} />);

        const span = screen.getByText('KeyTest');
        // Startzustand ist versteckt
        expect(span).toHaveClass('opacity-0');

        // Drücke Enter, Space und Escape global; da das Element nicht fokusierbar ist,
        // dürfen diese Tastendrücke die Sichtbarkeit nicht beeinflussen.
        await user.keyboard('{Enter}');
        await user.keyboard(' ');
        await user.keyboard('{Escape}');

        // Timer noch nicht vorgerückt - Element bleibt verborgen
        expect(span).toHaveClass('opacity-0');
    });
});

