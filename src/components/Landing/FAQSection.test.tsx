import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FAQSection } from './FAQSection';

expect.extend(toHaveNoViolations);

describe('FAQSection und FAQAccordion', () => {
    it('hat keine Barrierefreiheitsverletzungen (A11y-Violations)', async () => {
        const { container } = render(<FAQSection />);
        expect(await axe(container)).toHaveNoViolations();
    });

    it('rendert alle FAQ-Kategorien und Standardfragen korrekt', () => {
        render(<FAQSection />);

        // Überschriften prüfen
        expect(screen.getByRole('heading', { name: /häufige fragen\?/i })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Studierende' })).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Aussteller' })).toBeInTheDocument();

        // Prüfen, ob bestimmte Fragen gerendert werden
        expect(screen.getByRole('button', { name: /Wann und wo findet die Unternehmerbörse 2026 statt\?/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Welche Zielgruppe ist auf der Unternehmerbörse 2026 zu finden\?/i })).toBeInTheDocument();
    });

    it('öffnet und schließt Akkordeon-Inhalt bei Klick auf den Trigger', async () => {
        const user = userEvent.setup();
        render(<FAQSection />);

        const question = 'Wann und wo findet die Unternehmerbörse 2026 statt?';
        const trigger = screen.getByRole('button', { name: question });

        // Der Trigger sollte anfangs nicht erweitert sein
        expect(trigger).toHaveAttribute('aria-expanded', 'false');

        // Klick auf den Trigger
        await user.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'true');

        // Die Antwort sollte nun im Dokument auffindbar sein
        const answer = /Die Unternehmerbörse 2026 findet am 12. Mai 2026 von 09:30 bis 16:00 Uhr auf dem Campus der Hochschule Hof statt/i;
        expect(screen.getByText(answer)).toBeInTheDocument();

        // Erneuter Klick schließt es wieder
        await user.click(trigger);
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });

    it('unterstützt Tastaturbedienung über die Enter-Taste auf dem fokussierten Element', async () => {
        const user = userEvent.setup();
        render(<FAQSection />);

        const question = 'Wann und wo findet die Unternehmerbörse 2026 statt?';
        const trigger = screen.getByRole('button', { name: question });

        // Trigger direkt fokussieren
        trigger.focus();
        expect(trigger).toHaveFocus();
        expect(trigger).toHaveAttribute('aria-expanded', 'false');

        // Enter-Taste drücken zum Öffnen
        await user.keyboard('{Enter}');
        expect(trigger).toHaveAttribute('aria-expanded', 'true');

        // Enter-Taste erneut drücken zum Schließen
        await user.keyboard('{Enter}');
        expect(trigger).toHaveAttribute('aria-expanded', 'false');
    });
});
