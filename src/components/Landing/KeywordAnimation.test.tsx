import React from 'react';
import { render, screen, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { KeywordAnimation } from './KeywordAnimation';

type KeywordAnimationProps = React.ComponentProps<typeof KeywordAnimation>;

describe('KeywordAnimation-Komponente', () => {
    afterEach(() => {
        cleanup();
        try {
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
        expect(span).toHaveClass('opacity-0');
        expect(span).toHaveClass('translate-x-12');
    });

    test('zeigt das Element nach Verzögerung sichtbar an', async () => {
        jest.useFakeTimers();
        const props: KeywordAnimationProps = { text: 'Delayed', delay: 500 };
        const { container } = render(<KeywordAnimation {...props} />);

        const span = screen.getByText('Delayed');
        expect(span).toHaveClass('opacity-0');

        act(() => {
            jest.advanceTimersByTime(500);
        });

        expect(span).toHaveClass('opacity-100');
        expect(span).toHaveClass('translate-x-0');

        jest.useRealTimers();
        await expect(await axe(container)).toHaveNoViolations();
    });

    test('verhält sich korrekt bei delay = 0 und sofortiger Anzeige', async () => {
        jest.useFakeTimers();
        const props: KeywordAnimationProps = { text: 'ZeroDelay', delay: 0 };
        const { container } = render(<KeywordAnimation {...props} />);

        const span = screen.getByText('ZeroDelay');
        expect(span).toHaveClass('opacity-0');

        act(() => {
            jest.runOnlyPendingTimers();
        });

        expect(span).toHaveClass('opacity-100');

        jest.useRealTimers();
        await expect(await axe(container)).toHaveNoViolations();
    });

    test('bereinigt den Timer beim Unmount, sodass kein Fehler entsteht', () => {
        jest.useFakeTimers();
        const props: KeywordAnimationProps = { text: 'UnmountTest', delay: 1000 };
        const { unmount } = render(<KeywordAnimation {...props} />);

        unmount();

        expect(() => jest.runOnlyPendingTimers()).not.toThrow();
        jest.useRealTimers();
    });

    test('ist nicht fokusierbar und beeinflusst die Tastaturnavigation nicht', async () => {
        jest.useRealTimers();
        const user = userEvent.setup();
        render(
            <div>
                <button>Erster</button>
                <KeywordAnimation text="NavTest" />
                <button>Zweiter</button>
            </div>
        );

        await user.tab();
        const firstButton = screen.getByText('Erster') as HTMLButtonElement;
        expect(document.activeElement).toBe(firstButton);

        await user.tab();
        const secondButton = screen.getByText('Zweiter') as HTMLButtonElement;
        expect(document.activeElement).toBe(secondButton);
    });

    test('reagiert nicht auf Enter, Space oder Escape, wenn keine Interaktivität vorhanden ist', async () => {
        jest.useRealTimers();
        const user = userEvent.setup();
        render(<KeywordAnimation text="KeyTest" delay={1000} />);

        const span = screen.getByText('KeyTest');
        expect(span).toHaveClass('opacity-0');

        await user.keyboard('{Enter}');
        await user.keyboard(' ');
        await user.keyboard('{Escape}');

        expect(span).toHaveClass('opacity-0');
    });
});

