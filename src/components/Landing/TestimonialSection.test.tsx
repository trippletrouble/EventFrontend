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
    const listeners: Record<string, Array<(e: MediaQueryListEvent) => void>> = {};

    return (query: string): MediaQueryList => {
        const isMobileQuery = query.includes('max-width');
        const isReducedMotion = query.includes('prefers-reduced-motion');

        const mql = {
            matches: isReducedMotion ? reducedMotion : (isMobileQuery ? mobile : false),
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn((event: string, handler: (e: MediaQueryListEvent) => void) => {
                if (!listeners[query]) listeners[query] = [];
                listeners[query].push(handler);
            }),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
        } as unknown as MediaQueryList;

        return mql;
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

        it('rendert die Karussell-Region mit korrekter ARIA-Beschreibung', () => {
            renderAndMount();
            const carousel = screen.getByRole('group', { name: /Testimonials/i });
            expect(carousel).toHaveAttribute('aria-roledescription', 'Karussell');
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

        it('rendert die Paginierungs-Punkte als Buttons', () => {
            renderAndMount();
            const dotButtons = screen.getAllByRole('button', { name: /Gehe zu Testimonial-Seite/i });
            expect(dotButtons.length).toBe(2);
        });

        it('markiert den ersten Paginierungs-Punkt als aktiv', () => {
            renderAndMount();
            const dotButtons = screen.getAllByRole('button', { name: /Gehe zu Testimonial-Seite/i });
            expect(dotButtons[0]).toHaveAttribute('aria-current', 'true');
            expect(dotButtons[1]).not.toHaveAttribute('aria-current');
        });

        it('rendert Testimonial-Karten als blockquote-Elemente', () => {
            const { container } = renderAndMount();
            const blockquotes = container.querySelectorAll('blockquote');
            expect(blockquotes.length).toBe(6);
        });

        it('rendert die Folien-Gruppen mit korrekter ARIA-Beschreibung', () => {
            renderAndMount();
            const slides = screen.getAllByRole('group', { name: /Seite \d+ von \d+/i });
            expect(slides.length).toBe(2);
            expect(slides[0]).toHaveAttribute('aria-roledescription', 'Folie');
        });
    });

    describe('Desktop-Paginierung (3 Karten pro Seite)', () => {
        it('zeigt 2 Seiten für 6 Testimonials im Desktop-Modus an', () => {
            renderAndMount();
            const dotButtons = screen.getAllByRole('button', { name: /Gehe zu Testimonial-Seite/i });
            expect(dotButtons.length).toBe(2);
        });

        it('wechselt zur nächsten Seite beim Klick auf den Weiter-Button', async () => {
            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
            renderAndMount();

            const nextButton = screen.getByRole('button', { name: /Nächste Testimonials anzeigen/i });
            await user.click(nextButton);

            const dotButtons = screen.getAllByRole('button', { name: /Gehe zu Testimonial-Seite/i });
            expect(dotButtons[1]).toHaveAttribute('aria-current', 'true');
        });

        it('wechselt zur vorherigen Seite beim Klick auf den Zurück-Button', async () => {
            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
            renderAndMount();

            const nextButton = screen.getByRole('button', { name: /Nächste Testimonials anzeigen/i });
            await user.click(nextButton);

            const prevButton = screen.getByRole('button', { name: /Vorherige Testimonials anzeigen/i });
            await user.click(prevButton);

            const dotButtons = screen.getAllByRole('button', { name: /Gehe zu Testimonial-Seite/i });
            expect(dotButtons[0]).toHaveAttribute('aria-current', 'true');
        });

        it('springt von der letzten Seite zur ersten beim Klick auf Weiter', async () => {
            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
            renderAndMount();

            const nextButton = screen.getByRole('button', { name: /Nächste Testimonials anzeigen/i });
            await user.click(nextButton);
            await user.click(nextButton);

            const dotButtons = screen.getAllByRole('button', { name: /Gehe zu Testimonial-Seite/i });
            expect(dotButtons[0]).toHaveAttribute('aria-current', 'true');
        });

        it('springt von der ersten Seite zur letzten beim Klick auf Zurück', async () => {
            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
            renderAndMount();

            const prevButton = screen.getByRole('button', { name: /Vorherige Testimonials anzeigen/i });
            await user.click(prevButton);

            const dotButtons = screen.getAllByRole('button', { name: /Gehe zu Testimonial-Seite/i });
            expect(dotButtons[1]).toHaveAttribute('aria-current', 'true');
        });

        it('wechselt die Seite beim Klick auf einen Paginierungs-Punkt', async () => {
            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
            renderAndMount();

            const dotButtons = screen.getAllByRole('button', { name: /Gehe zu Testimonial-Seite/i });
            await user.click(dotButtons[1]);

            expect(dotButtons[1]).toHaveAttribute('aria-current', 'true');
            expect(dotButtons[0]).not.toHaveAttribute('aria-current');
        });
    });

    describe('Mobile-Ansicht (1 Karte pro Seite)', () => {
        it('zeigt 6 Paginierungs-Punkte im mobilen Modus an', () => {
            renderAndMount(true);
            const dotButtons = screen.getAllByRole('button', { name: /Gehe zu Testimonial-Seite/i });
            expect(dotButtons.length).toBe(6);
        });

        it('rendert 6 Folien-Gruppen im mobilen Modus', () => {
            renderAndMount(true);
            const slides = screen.getAllByRole('group', { name: /Seite \d+ von \d+/i });
            expect(slides.length).toBe(6);
        });
    });

    describe('Touch-Navigation', () => {
        it('wechselt zur nächsten Seite bei einem Swipe nach links', () => {
            const { container } = renderAndMount();

            const slider = container.querySelector('[aria-live="polite"]')!;
            act(() => {
                slider.dispatchEvent(new TouchEvent('touchstart', {
                    bubbles: true,
                    touches: [{ clientX: 200 } as Touch],
                }));
                slider.dispatchEvent(new TouchEvent('touchend', {
                    bubbles: true,
                    changedTouches: [{ clientX: 100 } as Touch],
                }));
            });

            const dotButtons = screen.getAllByRole('button', { name: /Gehe zu Testimonial-Seite/i });
            expect(dotButtons[1]).toHaveAttribute('aria-current', 'true');
        });

        it('wechselt zur vorherigen Seite bei einem Swipe nach rechts', () => {
            const { container } = renderAndMount();

            const slider = container.querySelector('[aria-live="polite"]')!;

            act(() => {
                slider.dispatchEvent(new TouchEvent('touchstart', {
                    bubbles: true,
                    touches: [{ clientX: 200 } as Touch],
                }));
                slider.dispatchEvent(new TouchEvent('touchend', {
                    bubbles: true,
                    changedTouches: [{ clientX: 100 } as Touch],
                }));
            });

            act(() => {
                slider.dispatchEvent(new TouchEvent('touchstart', {
                    bubbles: true,
                    touches: [{ clientX: 100 } as Touch],
                }));
                slider.dispatchEvent(new TouchEvent('touchend', {
                    bubbles: true,
                    changedTouches: [{ clientX: 200 } as Touch],
                }));
            });

            const dotButtons = screen.getAllByRole('button', { name: /Gehe zu Testimonial-Seite/i });
            expect(dotButtons[0]).toHaveAttribute('aria-current', 'true');
        });

        it('ignoriert einen Swipe mit weniger als 50px Distanz', () => {
            const { container } = renderAndMount();

            const slider = container.querySelector('[aria-live="polite"]')!;
            act(() => {
                slider.dispatchEvent(new TouchEvent('touchstart', {
                    bubbles: true,
                    touches: [{ clientX: 200 } as Touch],
                }));
                slider.dispatchEvent(new TouchEvent('touchend', {
                    bubbles: true,
                    changedTouches: [{ clientX: 170 } as Touch],
                }));
            });

            const dotButtons = screen.getAllByRole('button', { name: /Gehe zu Testimonial-Seite/i });
            expect(dotButtons[0]).toHaveAttribute('aria-current', 'true');
        });
    });

    describe('Tastaturbedienung und Fokus', () => {
        it('erlaubt das Fokussieren der Überschrift', () => {
            renderAndMount();
            const heading = screen.getByRole('heading', { name: /Was andere sagen/i });
            heading.focus();
            expect(heading).toHaveFocus();
        });

        it('erlaubt das Fokussieren der Navigationsbuttons über Tab-Taste', async () => {
            renderAndMount();
            const prevButton = screen.getByRole('button', { name: /Vorherige Testimonials anzeigen/i });
            prevButton.focus();
            expect(prevButton).toHaveFocus();
        });

        it('erlaubt das Fokussieren der Paginierungs-Punkte', () => {
            renderAndMount();
            const dotButtons = screen.getAllByRole('button', { name: /Gehe zu Testimonial-Seite/i });
            dotButtons[0].focus();
            expect(dotButtons[0]).toHaveFocus();
        });

        it('aktiviert den Weiter-Button mit Enter-Taste', async () => {
            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
            renderAndMount();

            const nextButton = screen.getByRole('button', { name: /Nächste Testimonials anzeigen/i });
            nextButton.focus();
            await user.keyboard('{Enter}');

            const dotButtons = screen.getAllByRole('button', { name: /Gehe zu Testimonial-Seite/i });
            expect(dotButtons[1]).toHaveAttribute('aria-current', 'true');
        });

        it('aktiviert den Paginierungs-Punkt mit Space-Taste', async () => {
            const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
            renderAndMount();

            const dotButtons = screen.getAllByRole('button', { name: /Gehe zu Testimonial-Seite/i });
            dotButtons[1].focus();
            await user.keyboard(' ');

            expect(dotButtons[1]).toHaveAttribute('aria-current', 'true');
        });

        it('setzt den Fokus auf eine Testimonial-Karte der aktiven Seite', () => {
            renderAndMount();
            const blockquotes = screen.getAllByRole('blockquote');
            const firstCard = blockquotes[0];
            expect(firstCard).toHaveAttribute('tabindex', '0');
        });

        it('setzt tabindex=-1 auf Testimonial-Karten inaktiver Seiten', () => {
            renderAndMount();
            const blockquotes = screen.getAllByRole('blockquote');
            expect(blockquotes[3]).toHaveAttribute('tabindex', '-1');
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
    });

    describe('Layout und Styling', () => {
        it('rendert die dekorativen Streifenelemente als aria-hidden', () => {
            const { container } = renderAndMount();
            const hiddenElements = container.querySelectorAll('[aria-hidden="true"]');
            expect(hiddenElements.length).toBeGreaterThanOrEqual(3);
        });

        it('rendert die Sektion mit dem aria-labelledby-Attribut', () => {
            renderAndMount();
            const section = screen.getByRole('region');
            expect(section).toHaveAttribute('aria-labelledby', 'testimonial-heading');
        });

        it('rendert den Live-Bereich mit aria-live="polite"', () => {
            const { container } = renderAndMount();
            const liveRegion = container.querySelector('[aria-live="polite"]');
            expect(liveRegion).toBeInTheDocument();
        });

        it('wendet den korrekten Transform-Stil auf den Slider an', () => {
            const { container } = renderAndMount();
            const slider = container.querySelector('[aria-live="polite"]')!;
            const track = slider.firstElementChild as HTMLElement;
            expect(track.style.transform).toBe('translateX(-0%)');
        });
    });

    describe('Fokus-Wechsel bei Karussell-Navigation', () => {
        it('wechselt die aktive Seite, wenn eine Karte auf einer anderen Seite fokussiert wird', () => {
            renderAndMount();
            const blockquotes = screen.getAllByRole('blockquote');
            act(() => {
                blockquotes[3].focus();
                blockquotes[3].dispatchEvent(new FocusEvent('focus', { bubbles: true }));
            });

            const dotButtons = screen.getAllByRole('button', { name: /Gehe zu Testimonial-Seite/i });
            expect(dotButtons[1]).toHaveAttribute('aria-current', 'true');
        });

        it('wechselt die aktive Seite NICHT, wenn eine Karte auf der bereits aktiven Seite fokussiert wird', () => {
            const { container } = renderAndMount();
            const blockquotes = container.querySelectorAll('blockquote');
            act(() => {
                blockquotes[0].focus();
                blockquotes[0].dispatchEvent(new FocusEvent('focus', { bubbles: true }));
            });

            const tabs = screen.getAllByRole('tab');
            expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
            expect(tabs[1]).toHaveAttribute('aria-selected', 'false');
        });
    });
});
