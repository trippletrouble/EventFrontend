'use client';

import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { StudentInfoSection } from './StudentInfoSection';

expect.extend(toHaveNoViolations);

describe('StudentInfoSection-Komponente', () => {
    describe('Barrierefreiheit (A11y)', () => {
        it('hat keine Barrierefreiheitsverletzungen', async () => {
            const { container } = render(<StudentInfoSection />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('Initiales Rendering', () => {
        it('rendert die Hauptüberschrift "Infos für Studierende"', () => {
            render(<StudentInfoSection />);
            expect(screen.getByRole('heading', { name: /Infos für Studierende/i, level: 2 })).toBeInTheDocument();
        });

        it('rendert die Unter-Überschrift "Dein Karrierestart."', () => {
            render(<StudentInfoSection />);
            expect(screen.getByRole('heading', { name: /Dein Karrierestart\./i, level: 3 })).toBeInTheDocument();
        });

        it('rendert die Unter-Überschrift "Tipps für deinen Messebesuch"', () => {
            render(<StudentInfoSection />);
            expect(screen.getByRole('heading', { name: /Tipps für deinen Messebesuch/i, level: 3 })).toBeInTheDocument();
        });

        it('rendert die Sektion mit korrektem aria-labelledby', () => {
            const { container } = render(<StudentInfoSection />);
            const section = container.querySelector('section');
            expect(section).toHaveAttribute('aria-labelledby', 'student-info-heading');
        });

        it('rendert die Sektion mit der ID student-info', () => {
            const { container } = render(<StudentInfoSection />);
            const section = container.querySelector('#student-info');
            expect(section).toBeInTheDocument();
        });
    });

    describe('Feature-Items Rendering', () => {
        it('rendert das Feature "Jobs & Praktika" mit Beschreibung', () => {
            render(<StudentInfoSection />);
            expect(screen.getByText('Jobs & Praktika')).toBeInTheDocument();
            expect(screen.getByText(/Finde deinen nächsten Karriereschritt/i)).toBeInTheDocument();
        });

        it('rendert das Feature "Networking" mit Beschreibung', () => {
            render(<StudentInfoSection />);
            expect(screen.getByText('Networking')).toBeInTheDocument();
            expect(screen.getByText(/über 80 Unternehmen/i)).toBeInTheDocument();
        });

        it('rendert das Feature "CV-Check" mit Beschreibung', () => {
            render(<StudentInfoSection />);
            expect(screen.getByText('CV-Check')).toBeInTheDocument();
            expect(screen.getByText(/Bewerbungsunterlagen direkt vor Ort/i)).toBeInTheDocument();
        });

        it('rendert das Feature "Messe-App" mit Beschreibung', () => {
            render(<StudentInfoSection />);
            expect(screen.getByText('Messe-App')).toBeInTheDocument();
            expect(screen.getByText(/Filtere Aussteller nach deinen Interessen/i)).toBeInTheDocument();
        });

        it('rendert genau 4 Feature-Items', () => {
            render(<StudentInfoSection />);
            const featureTitles = ['Jobs & Praktika', 'Networking', 'CV-Check', 'Messe-App'];
            featureTitles.forEach(title => {
                expect(screen.getByText(title)).toBeInTheDocument();
            });
        });
    });

    describe('Tipps-Liste Rendering', () => {
        const tipps = [
            'Lebenslauf mitbringen',
            'Messe App zur Orientierung',
            'Fragen vorbereiten',
            'Ausstellerliste ansehen',
            'Gepflegte Kleidung',
            'Wunschfirmen vorher raussuchen',
            'Ordentliches Erscheinungsbild',
            'Früh kommen',
        ];

        it('rendert alle 8 Tipps als Listenelemente', () => {
            render(<StudentInfoSection />);
            tipps.forEach(tipp => {
                expect(screen.getByText(tipp)).toBeInTheDocument();
            });
        });

        it('rendert die Tipps als ungeordnete Liste', () => {
            render(<StudentInfoSection />);
            const list = screen.getByRole('list');
            expect(list).toBeInTheDocument();
        });

        it('rendert genau 8 Listenelemente', () => {
            render(<StudentInfoSection />);
            const listItems = screen.getAllByRole('listitem');
            expect(listItems.length).toBe(8);
        });
    });

    describe('Layout und Styling', () => {
        it('rendert die dekorativen Streifen als aria-hidden', () => {
            const { container } = render(<StudentInfoSection />);
            const hiddenStripes = container.querySelectorAll('[aria-hidden="true"]');
            expect(hiddenStripes.length).toBeGreaterThanOrEqual(2);
        });

        it('rendert die dekorativen Trennlinien als aria-hidden', () => {
            const { container } = render(<StudentInfoSection />);
            const hiddenHrs = container.querySelectorAll('hr[aria-hidden="true"]');
            expect(hiddenHrs.length).toBe(2);
        });

        it('setzt data-navbar="light" auf der Sektion', () => {
            const { container } = render(<StudentInfoSection />);
            const section = container.querySelector('section');
            expect(section).toHaveAttribute('data-navbar', 'light');
        });
    });

    describe('Tastaturbedienung und Fokus', () => {
        it('erlaubt das Fokussieren der Hauptüberschrift', () => {
            render(<StudentInfoSection />);
            const heading = screen.getByRole('heading', { name: /Infos für Studierende/i });
            heading.focus();
            expect(heading).toHaveFocus();
        });

        it('erlaubt das Fokussieren der Karrierestart-Überschrift', () => {
            render(<StudentInfoSection />);
            const heading = screen.getByRole('heading', { name: /Dein Karrierestart\./i });
            heading.focus();
            expect(heading).toHaveFocus();
        });

        it('erlaubt das Fokussieren der Tipps-Überschrift', () => {
            render(<StudentInfoSection />);
            const heading = screen.getByRole('heading', { name: /Tipps für deinen Messebesuch/i });
            heading.focus();
            expect(heading).toHaveFocus();
        });

        it('erlaubt das Fokussieren der einzelnen Tipps-Listenelemente', () => {
            render(<StudentInfoSection />);
            const firstTipp = screen.getByText('Lebenslauf mitbringen');
            firstTipp.focus();
            expect(firstTipp).toHaveFocus();
        });

        it('setzt tabIndex=0 auf alle Tipps-Listenelemente', () => {
            render(<StudentInfoSection />);
            const listItems = screen.getAllByRole('listitem');
            listItems.forEach(item => {
                expect(item).toHaveAttribute('tabindex', '0');
            });
        });
    });

    describe('Heading-Hierarchie', () => {
        it('rendert die korrekte Heading-Hierarchie (h2 → h3)', () => {
            render(<StudentInfoSection />);
            const h2 = screen.getByRole('heading', { level: 2 });
            expect(h2).toBeInTheDocument();

            const h3s = screen.getAllByRole('heading', { level: 3 });
            expect(h3s.length).toBe(2);
        });
    });
});
