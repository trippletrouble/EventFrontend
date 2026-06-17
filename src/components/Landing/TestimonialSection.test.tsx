'use client';

import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { TestimonialSection } from './TestimonialSection';

expect.extend(toHaveNoViolations);

let intersectionCallback: IntersectionObserverCallback;
const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();

function createMockMatchMedia(mobile: boolean, reducedMotion = false) {
    return (query: string): MediaQueryList => {
        const isMobileQuery = query.includes('max-width');
        const isReducedMotion = query.includes('prefers-reduced-motion');

        return {
            matches: isReducedMotion ? reducedMotion : (isMobileQuery ? mobile : false),
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        } as unknown as MediaQueryList;
    };
}

function triggerIntersection(isIntersecting: boolean) {
    if (intersectionCallback) {
        const entry = { isIntersecting, target: document.createElement('div') } as unknown as IntersectionObserverEntry;
        intersectionCallback([entry], {} as IntersectionObserver);
    }
}

beforeEach(() => {
    jest.useFakeTimers();

    window.IntersectionObserver = jest.fn((callback) => {
        intersectionCallback = callback;
        return {
            observe: mockObserve,
            unobserve: mockUnobserve,
            disconnect: mockDisconnect,
            root: null,
            rootMargin: '',
            thresholds: [],
            takeRecords: jest.fn(() => []),
        };
    });

    window.matchMedia = createMockMatchMedia(false);
    mockObserve.mockClear();
    mockUnobserve.mockClear();
    mockDisconnect.mockClear();
});

afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
});

function renderAndMount(mobile = false, reducedMotion = false) {
    window.matchMedia = createMockMatchMedia(mobile, reducedMotion);
    const result = render(<TestimonialSection />);
    act(() => { jest.runAllTimers(); });
    act(() => { triggerIntersection(true); });
    act(() => { jest.runAllTimers(); });
    return result;
}

describe('TestimonialSection', () => {
    describe('Barrierefreiheit (A11y)', () => {
        it('hat keine Barrierefreiheitsverletzungen im Standardzustand', async () => {
            const { container } = renderAndMount();
            jest.useRealTimers();
            const results = await axe(container);
            expect(results).toHaveNoViolations();
            jest.useFakeTimers();
        });

        it('hat keine Barrierefreiheitsverletzungen in der mobilen Ansicht', async () => {
            const { container } = renderAndMount(true);
            jest.useRealTimers();
            const results = await axe(container);
            expect(results).toHaveNoViolations();
            jest.useFakeTimers();
        });
    });

    describe('Initiales Rendering', () => {
        it('rendert die Überschrift "Was andere sagen" korrekt', () => {
            renderAndMount();
            expect(screen.getByRole('heading', { name: /Was andere sagen/i })).toBeInTheDocument();
        });

        it('rendert den Navigationsbutton für vorherige Testimonials', () => {
            renderAndMount();
            expect(screen.getByRole('button', { name: /Vorherige Testimonials anzeigen/i })).toBeInTheDocument();
        });

        it('rendert den Navigationsbutton für nächste Testimonials', () => {
            renderAndMount();
            expect(screen.getByRole('button', { name: /Nächste Testimonials anzeigen/i })).toBeInTheDocument();
        });

        it('rendert alle Testimonial-Zitate der ersten Seite im Desktop-Modus', () => {
            renderAndMount();
            expect(screen.getByText(/Über die Unternehmerbörse/i)).toBeInTheDocument();
            expect(screen.getByText(/Die Hochschule Hof/i)).toBeInTheDocument();
            expect(screen.getByText(/Durch die direkten Gespräche/i)).toBeInTheDocument();
        });

        it('rendert die Namen und Rollen der Testimonial-Autoren', () => {
            renderAndMount();
            expect(screen.getByText('Maria K.')).toBeInTheDocument();
            expect(screen.getByText('Studentin')).toBeInTheDocument();
            expect(screen.getByText('Thomas W.')).toBeInTheDocument();
            expect(screen.getByText('TechCorp GmbH')).toBeInTheDocument();
        });

        it('rendert die Paginierungs-Tabs', () => {
            renderAndMount();
            const tabs = screen.getAllByRole('tab');
            expect(tabs.length).toBe(2);
        });

        it('markiert den ersten Paginierungs-Tab als ausgewählt', () => {
            renderAndMount();
            const tabs = screen.getAllByRole('tab');
            expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
            expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
        });

        it('rendert Testimonial-Karten als blockquote-Elemente', () => {
            const { container } = renderAndMount();
            const blockquotes = container.querySelectorAll('blockquote');
            expect(blockquotes.length).toBe(6);
        });

        it('rendert die Tablist mit korrektem aria-label', () => {
            renderAndMount();
            const tablist = screen.getByRole('tablist');
            expect(tablist).toHaveAttribute('aria-label', 'Testimonial-Seiten');
        });
    });

    describe('Desktop-Paginierung (3 Karten pro Seite)', () => {
        it('zeigt 2 Tabs für 6 Testimonials im Desktop-Modus an', () => {
            renderAndMount();
            const tabs = screen.getAllByRole('tab');
            expect(tabs.length).toBe(2);
        });

        it('wechselt zur nächsten Seite beim Klick auf den Weiter-Button', async () => {
            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
            renderAndMount();

            const nextButton = screen.getByRole('button', { name: /Nächste Testimonials anzeigen/i });
            await user.click(nextButton);

            const tabs = screen.getAllByRole('tab');
            expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
        });

        it('wechselt zur vorherigen Seite beim Klick auf den Zurück-Button', async () => {
            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
            renderAndMount();

            const nextButton = screen.getByRole('button', { name: /Nächste Testimonials anzeigen/i });
            await user.click(nextButton);

            const prevButton = screen.getByRole('button', { name: /Vorherige Testimonials anzeigen/i });
            await user.click(prevButton);

            const tabs = screen.getAllByRole('tab');
            expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
        });

        it('springt von der letzten Seite zur ersten beim Klick auf Weiter', async () => {
            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
            renderAndMount();

            const nextButton = screen.getByRole('button', { name: /Nächste Testimonials anzeigen/i });
            await user.click(nextButton);
            await user.click(nextButton);

            const tabs = screen.getAllByRole('tab');
            expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
        });

        it('springt von der ersten Seite zur letzten beim Klick auf Zurück', async () => {
            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
            renderAndMount();

            const prevButton = screen.getByRole('button', { name: /Vorherige Testimonials anzeigen/i });
            await user.click(prevButton);

            const tabs = screen.getAllByRole('tab');
            expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
        });

        it('wechselt die Seite beim Klick auf einen Paginierungs-Tab', async () => {
            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
            renderAndMount();

            const tabs = screen.getAllByRole('tab');
            await user.click(tabs[1]);

            expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
            expect(tabs[0]).toHaveAttribute('aria-selected', 'false');
        });
    });

    describe('Mobile-Ansicht (1 Karte pro Seite)', () => {
        it('zeigt 6 Paginierungs-Tabs im mobilen Modus an', () => {
            renderAndMount(true);
            const tabs = screen.getAllByRole('tab');
            expect(tabs.length).toBe(6);
        });
    });

    describe('Tastaturbedienung und Fokus', () => {
        it('erlaubt das Fokussieren der Überschrift', () => {
            renderAndMount();
            const heading = screen.getByRole('heading', { name: /Was andere sagen/i });
            heading.focus();
            expect(heading).toHaveFocus();
        });

        it('erlaubt das Fokussieren der Navigationsbuttons', () => {
            renderAndMount();
            const prevButton = screen.getByRole('button', { name: /Vorherige Testimonials anzeigen/i });
            prevButton.focus();
            expect(prevButton).toHaveFocus();
        });

        it('erlaubt das Fokussieren der Paginierungs-Tabs', () => {
            renderAndMount();
            const tabs = screen.getAllByRole('tab');
            tabs[0].focus();
            expect(tabs[0]).toHaveFocus();
        });

        it('aktiviert den Weiter-Button mit Enter-Taste', async () => {
            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
            renderAndMount();

            const nextButton = screen.getByRole('button', { name: /Nächste Testimonials anzeigen/i });
            nextButton.focus();
            await user.keyboard('{Enter}');

            const tabs = screen.getAllByRole('tab');
            expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
        });

        it('aktiviert den Paginierungs-Tab mit Space-Taste', async () => {
            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
            renderAndMount();

            const tabs = screen.getAllByRole('tab');
            tabs[1].focus();
            await user.keyboard(' ');

            expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
        });

        it('setzt tabIndex=0 auf alle Testimonial-Karten', () => {
            const { container } = renderAndMount();
            const blockquotes = container.querySelectorAll('blockquote');
            blockquotes.forEach(bq => {
                expect(bq).toHaveAttribute('tabindex', '0');
            });
        });
    });

    describe('IntersectionObserver und Animation', () => {
        it('beobachtet die Sektion mit dem IntersectionObserver', () => {
            render(<TestimonialSection />);
            act(() => { jest.runAllTimers(); });
            expect(mockObserve).toHaveBeenCalled();
        });

        it('stoppt die Beobachtung nach dem ersten Erscheinen', () => {
            render(<TestimonialSection />);
            act(() => { jest.runAllTimers(); });
            act(() => { triggerIntersection(true); });
            expect(mockUnobserve).toHaveBeenCalled();
        });

        it('löst keine Sichtbarkeit aus, wenn die Sektion nicht sichtbar ist', () => {
            const { container } = render(<TestimonialSection />);
            act(() => { jest.runAllTimers(); });
            act(() => { triggerIntersection(false); });
            act(() => { jest.runAllTimers(); });

            const visibleCards = container.querySelectorAll('.is-visible');
            expect(visibleCards.length).toBe(0);
        });

        it('setzt Sichtbarkeit sofort bei prefers-reduced-motion', () => {
            window.matchMedia = createMockMatchMedia(false, true);
            render(<TestimonialSection />);
            act(() => { jest.runAllTimers(); });

            expect(screen.getByRole('heading', { name: /Was andere sagen/i })).toBeInTheDocument();
        });

        it('fügt die is-visible Klasse hinzu wenn die Sektion sichtbar wird', () => {
            const { container } = renderAndMount();
            const visibleCards = container.querySelectorAll('.is-visible');
            expect(visibleCards.length).toBeGreaterThan(0);
        });
    });

    describe('Layout und Styling', () => {
        it('rendert die dekorativen Streifenelemente als aria-hidden', () => {
            const { container } = renderAndMount();
            const hiddenElements = container.querySelectorAll('[aria-hidden="true"]');
            expect(hiddenElements.length).toBeGreaterThanOrEqual(2);
        });

        it('wendet den korrekten Transform-Stil auf den Slider an', () => {
            const { container } = renderAndMount();
            const track = container.querySelector('.flex.transition-transform') as HTMLElement;
            expect(track.style.transform).toBe('translateX(-0%)');
        });

        it('setzt data-navbar="light" auf der Sektion', () => {
            const { container } = renderAndMount();
            const section = container.querySelector('section');
            expect(section).toHaveAttribute('data-navbar', 'light');
        });
    });

    describe('Fokus-Wechsel bei Karussell-Navigation', () => {
        it('wechselt die aktive Seite, wenn eine Karte auf einer anderen Seite fokussiert wird', () => {
            const { container } = renderAndMount();
            const blockquotes = container.querySelectorAll('blockquote');
            act(() => {
                blockquotes[3].focus();
                blockquotes[3].dispatchEvent(new FocusEvent('focus', { bubbles: true }));
            });

            const tabs = screen.getAllByRole('tab');
            expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
        });
    });
});
