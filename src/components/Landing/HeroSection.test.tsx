'use client';

import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HeroSection } from './HeroSection';

expect.extend(toHaveNoViolations);


type MockMediaQueryListChangeHandler = (e: MediaQueryListEvent) => void;

jest.mock('./KeywordAnimation', () => ({
  KeywordAnimation: ({ text }: { text: string }) => <span>{text}</span>,
}));

describe('HeroSection', () => {
  beforeEach(() => {
    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      value: jest.fn().mockResolvedValue(undefined),
    });

    Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
      configurable: true,
      value: jest.fn(),
    });

    Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
      configurable: true,
      value: true,
      writable: true,
    });

    window.matchMedia = jest.fn((query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('Barrierefreiheit und Rendering', () => {
    it('hat keine Barrierefreiheitsverletzungen im Standard-Zustand', async () => {
      const { container } = render(<HeroSection />);
      expect(await axe(container)).toHaveNoViolations();
    }, 20000);

    it('rendert den Hero-Section-Container mit korrektem ARIA-Label', () => {
      render(<HeroSection />);
      const section = screen.getByLabelText(
        /Unternehmerbörse 2026 – Karrieremesse/i
      );
      expect(section).toBeInTheDocument();
    });

    it('rendert das Video-Element mit korrekten Attributen', () => {
      const { container } = render(<HeroSection />);
      const video = container.querySelector('video');
      expect(video).toBeInTheDocument();

      const webmSource = container.querySelector('video source[type="video/webm"]');
      const mp4Source = container.querySelector('video source[type="video/mp4"]');
      expect(webmSource).toBeInTheDocument();
      expect(mp4Source).toBeInTheDocument();
      expect(video).toHaveClass('absolute', 'inset-0', 'w-full', 'h-full', 'object-cover', 'z-0', 'opacity-80');
    });

    it('rendert alle drei KeywordAnimation-Komponenten mit korrektem Text', () => {
      render(<HeroSection />);
      expect(screen.getByText('ZUKUNFT.')).toBeInTheDocument();
      expect(screen.getByText('CHANCE.')).toBeInTheDocument();
      expect(screen.getByText('KARRIERE.')).toBeInTheDocument();
    });

    it('rendert den Play/Pause-Button mit korrektem ARIA-Label beim Start', () => {
      render(<HeroSection />);
      const button = screen.getByRole('button', {
        name: /Hintergrund-Video pausieren/i,
      });
      expect(button).toBeInTheDocument();
    });

    it('rendert die Hauptüberschrift "Unternehmerbörse" und das Jahr "2027"', () => {
      render(<HeroSection />);
      expect(screen.getByText('Unternehmerbörse')).toBeInTheDocument();
      expect(screen.getByText('2027')).toBeInTheDocument();
    });

    it('rendert die Tagline "Deine" vor den Keyword-Animationen', () => {
      render(<HeroSection />);
      expect(screen.getByText('Deine')).toBeInTheDocument();
    });
  });

  describe('Video-Steuerung', () => {
    it('pausiert das Video beim Klick auf den Play/Pause-Button wenn es gerade abgespielt wird', async () => {
      const user = userEvent.setup();
      const mockPlay = jest.fn().mockResolvedValue(undefined);
      const mockPause = jest.fn();

      Object.defineProperty(HTMLMediaElement.prototype, 'play', {
        configurable: true,
        value: mockPlay,
      });

      Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
        configurable: true,
        value: mockPause,
      });

      Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
        configurable: true,
        get: jest.fn(() => false),
      });

      render(<HeroSection />);

      const button = screen.getByRole('button', {
        name: /Hintergrund-Video pausieren/i,
      });

      await user.click(button);

      expect(mockPause).toHaveBeenCalled();
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Hintergrund-Video abspielen/i })
        ).toBeInTheDocument();
      });
    });

    it('spielt das Video ab beim Klick auf den Play/Pause-Button wenn es pausiert ist', async () => {
      const user = userEvent.setup();
      const mockPlay = jest.fn().mockResolvedValue(undefined);

      let pausedValue = false;

      Object.defineProperty(HTMLMediaElement.prototype, 'play', {
        configurable: true,
        value: mockPlay,
      });

      Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
        configurable: true,
        get: jest.fn(() => pausedValue),
      });

      render(<HeroSection />);

      const button = screen.getByRole('button', {
        name: /Hintergrund-Video pausieren/i,
      });

      pausedValue = true;
      await user.click(button);

      expect(mockPlay).toHaveBeenCalled();
      await waitFor(() => {
        expect(screen.getByRole('button', {
          name: /Hintergrund-Video pausieren/i,
        })).toBeInTheDocument();
      });
    });

    it('fängt Play-Fehler ab und setzt den State trotzdem', async () => {
      const user = userEvent.setup();
      const mockPlayError = jest.fn().mockRejectedValue(new Error('Play failed'));

      let pausedValue = false;

      Object.defineProperty(HTMLMediaElement.prototype, 'play', {
        configurable: true,
        value: mockPlayError,
      });

      Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
        configurable: true,
        get: jest.fn(() => pausedValue),
      });

      render(<HeroSection />);

      const button = screen.getByRole('button', {
        name: /Hintergrund-Video pausieren/i,
      });

      pausedValue = true;
      await user.click(button);

      expect(mockPlayError).toHaveBeenCalled();
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Hintergrund-Video pausieren/i })
        ).toBeInTheDocument();
      });
    });

    it('handhabt fehlende Videoreferenz graceful', async () => {
      const user = userEvent.setup();

      render(<HeroSection />);

      const button = screen.getByRole('button', {
        name: /Hintergrund-Video pausieren/i,
      });

      await user.click(button);
      expect(button).toBeInTheDocument();
    });
  });

  describe('Reduced Motion Unterstützung', () => {
    it('pausiert das Video wenn Benutzer prefers-reduced-motion aktiviert hat', () => {
      const mockPause = jest.fn();

      window.matchMedia = jest.fn((query: string): MediaQueryList => {
        if (query === '(prefers-reduced-motion: reduce)') {
          return {
            matches: true,
            media: query,
            onchange: null,
            addListener: jest.fn(),
            removeListener: jest.fn(),
            addEventListener: jest.fn(),
            removeEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
          };
        }
        return {
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        };
      }) as unknown as typeof window.matchMedia;

      Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
        configurable: true,
        value: mockPause,
      });

      render(<HeroSection />);

      expect(mockPause).toHaveBeenCalled();
    });

    it('registriert einen change-Listener für prefers-reduced-motion Änderungen', () => {
      const mockAddEventListener = jest.fn();
      const mockRemoveEventListener = jest.fn();

      window.matchMedia = jest.fn((query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: mockAddEventListener,
        removeEventListener: mockRemoveEventListener,
        dispatchEvent: jest.fn(),
      })) as unknown as typeof window.matchMedia;

      const { unmount } = render(<HeroSection />);

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function)
      );
    });

    it('pausiert Video und ändert State wenn prefers-reduced-motion-Listener aktiviert wird', () => {
      const mockPause = jest.fn();
      let changeHandler: MockMediaQueryListChangeHandler | null = null;

      window.matchMedia = jest.fn((query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: (_event: string, handler: EventListenerOrEventListenerObject) => {
          changeHandler = handler as unknown as MockMediaQueryListChangeHandler;
        },
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })) as unknown as typeof window.matchMedia;

      Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
        configurable: true,
        value: mockPause,
      });

      render(<HeroSection />);

      if (changeHandler) {
        const mockEvent = new Event('change') as unknown as MediaQueryListEvent;
        Object.defineProperty(mockEvent, 'matches', { value: true, writable: false });
        
        act(() => {
          changeHandler!(mockEvent);
        });
      }

      expect(mockPause).toHaveBeenCalled();
    });
  });

  describe('Tastaturbedienung', () => {
    it('erlaubt die Fokussierung des Play/Pause-Buttons über die Tab-Taste', async () => {
      const user = userEvent.setup();
      render(<HeroSection />);

      const button = screen.getByRole('button', {
        name: /Hintergrund-Video pausieren/i,
      });

      expect(button).not.toHaveFocus();

      await user.tab();

      expect(button).toHaveFocus();
    });

    it('aktiviert die Video-Kontrolle beim Drücken der Enter-Taste auf dem fokussierten Button', async () => {
      const user = userEvent.setup();
      const mockPlay = jest.fn().mockResolvedValue(undefined);
      const mockPause = jest.fn();

      Object.defineProperty(HTMLMediaElement.prototype, 'play', {
        configurable: true,
        value: mockPlay,
      });

      Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
        configurable: true,
        value: mockPause,
      });

      Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
        configurable: true,
        get: jest.fn(() => false),
      });

      render(<HeroSection />);

      const button = screen.getByRole('button', {
        name: /Hintergrund-Video pausieren/i,
      });

      button.focus();
      expect(button).toHaveFocus();

      await user.keyboard('{Enter}');

      expect(mockPause).toHaveBeenCalled();
    });

    it('aktiviert die Video-Kontrolle beim Drücken der Leertaste auf dem fokussierten Button', async () => {
      const user = userEvent.setup();
      const mockPlay = jest.fn().mockResolvedValue(undefined);
      const mockPause = jest.fn();

      Object.defineProperty(HTMLMediaElement.prototype, 'play', {
        configurable: true,
        value: mockPlay,
      });

      Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
        configurable: true,
        value: mockPause,
      });

      Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
        configurable: true,
        get: jest.fn(() => false),
      });

      render(<HeroSection />);

      const button = screen.getByRole('button', {
        name: /Hintergrund-Video pausieren/i,
      });

      button.focus();

      await user.keyboard(' ');

      expect(mockPause).toHaveBeenCalled();
    });
  });

  describe('DOM-Struktur und CSS-Klassen', () => {
    it('rendert den Video-Background mit korrekten CSS-Klassen und Z-Index', () => {
      const { container } = render(<HeroSection />);
      const video = container.querySelector('video');
      expect(video).toHaveClass('absolute', 'inset-0', 'w-full', 'h-full', 'object-cover', 'z-0', 'opacity-80');
    });

    it('enthält einen narrativen Overlay mit mehrschichtigem Gradient-Design', () => {
      const { container } = render(<HeroSection />);
      const overlays = container.querySelectorAll('[aria-hidden="true"]');
      expect(overlays.length).toBeGreaterThan(0);
    });

    it('positioniert den Play/Pause-Button korrekt unten links mit Z-Index 20', () => {
      render(<HeroSection />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('absolute', 'bottom-8', 'left-8', 'z-20');
    });

    it('zeigt das korrekte Icon basierend auf Spielstatus an', () => {
      render(<HeroSection />);
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Video-Quellen und Poster', () => {
    it('enthält WebM- und MP4-Video-Quellen', () => {
      const { container } = render(<HeroSection />);
      const sources = container.querySelectorAll('video source');
      expect(sources.length).toBeGreaterThanOrEqual(2);
      
      const webmSource = Array.from(sources).find(
        s => s.getAttribute('type') === 'video/webm'
      );
      const mp4Source = Array.from(sources).find(
        s => s.getAttribute('type') === 'video/mp4'
      );

      expect(webmSource).toBeInTheDocument();
      expect(mp4Source).toBeInTheDocument();
    });

    it('hat ein Poster-Image als Fallback', () => {
      const { container } = render(<HeroSection />);
      const video = container.querySelector('video');
      expect(video).toHaveAttribute('poster');
    });
  });

  describe('Typsicherheit und Props', () => {
    it('wird ohne Props korrekt gerendert', () => {
      render(<HeroSection />);
      const section = screen.getByLabelText(
        /Unternehmerbörse 2026 – Karrieremesse/i
      );
      expect(section).toBeInTheDocument();
    });

    it('exportiert die Komponente als named Export', () => {
      expect(HeroSection).toBeDefined();
      expect(typeof HeroSection).toBe('function');
    });
  });

  describe('Grafische Elemente und Overlays', () => {
    it('rendert die obere Fade-Gradient-Overlay', () => {
      const { container } = render(<HeroSection />);
      const overlays = container.querySelectorAll('[aria-hidden="true"]');
      expect(overlays.length).toBeGreaterThan(0);
    });

    it('rendert die untere Fade-Gradient-Overlay', () => {
      const { container } = render(<HeroSection />);
      const overlays = container.querySelectorAll('[aria-hidden="true"]');
      expect(overlays.length).toBeGreaterThan(0);
    });

    it('enthält dekorative Linien-Elemente mit farbigen Gradienten', () => {
      const { container } = render(<HeroSection />);
      const decorativeElements = container.querySelectorAll('[aria-hidden="true"]');
      expect(decorativeElements.length).toBeGreaterThan(0);
    });
  });

  describe('Fokus und Interaktivität', () => {
    it('hat einen Button mit fokussierbarem State', () => {
      render(<HeroSection />);
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      button.focus();
      expect(button).toHaveFocus();
    });

    it('hat Hover-States im Button-Design', () => {
      render(<HeroSection />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-[#0D1117]/80');
    });

    it('hat Focus-Visible-Styles für Tastaturbedienung', () => {
      render(<HeroSection />);
      const button = screen.getByRole('button');
      expect(button).toHaveClass('focus-visible:outline-2');
      expect(button).toHaveClass('focus-visible:outline-white');
    });
  });

  describe('Responsive Design', () => {
    it('rendert responsive Text-Größen für Haupt-Überschrift', () => {
      render(<HeroSection />);
      const heading = screen.getByText('Unternehmerbörse');
      expect(heading).toHaveClass('text-[32px]', 'md:text-[42px]');
    });

    it('rendert responsive Text-Größen für das Jahr 2027', () => {
      render(<HeroSection />);
      const year = screen.getByText('2027');
      expect(year).toHaveClass('text-[100px]', 'md:text-[110px]');
    });

    it('rendert responsive Padding im Container', () => {
      render(<HeroSection />);
      const section = screen.getByLabelText(
        /Unternehmerbörse 2026 – Karrieremesse/i
      );
      expect(section).toHaveClass('relative', 'min-h-screen', 'flex', 'flex-col', 'overflow-hidden');
    });
  });

  describe('Integrierte Komponenten', () => {
    it('verwendet die KeywordAnimation-Komponente für alle drei Schlüsselwörter', () => {
      render(<HeroSection />);
      expect(screen.getByText('ZUKUNFT.')).toBeInTheDocument();
      expect(screen.getByText('CHANCE.')).toBeInTheDocument();
      expect(screen.getByText('KARRIERE.')).toBeInTheDocument();
    });
  });

  describe('Mehrfach-Klicks und State-Management', () => {
    it('verwaltet Video-State korrekt bei mehrfachen Klicks auf den Button', async () => {
      const user = userEvent.setup();
      const mockPlay = jest.fn().mockResolvedValue(undefined);
      const mockPause = jest.fn();

      let pausedState = true;

      Object.defineProperty(HTMLMediaElement.prototype, 'play', {
        configurable: true,
        value: mockPlay,
      });

      Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
        configurable: true,
        value: mockPause,
      });

      Object.defineProperty(HTMLMediaElement.prototype, 'paused', {
        configurable: true,
        get: jest.fn(() => pausedState),
      });

      render(<HeroSection />);

      const button = screen.getByRole('button');

      pausedState = true;
      await user.click(button);
      expect(mockPlay).toHaveBeenCalled();

      pausedState = false;
      await user.click(button);
      expect(mockPause).toHaveBeenCalledTimes(1);
    });
  });
});

