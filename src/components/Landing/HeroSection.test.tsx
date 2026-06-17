import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { HeroSection } from './HeroSection';

expect.extend(toHaveNoViolations);

describe('HeroSection-Komponente', () => {
  let observerCallback: any = null;
  const mockObserve = jest.fn();
  const mockDisconnect = jest.fn();

  beforeAll(() => {
    window.HTMLVideoElement.prototype.play = jest.fn().mockImplementation(() => Promise.resolve());
    window.HTMLVideoElement.prototype.pause = jest.fn();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    observerCallback = null;
    window.IntersectionObserver = jest.fn().mockImplementation((cb) => {
      observerCallback = cb;
      return {
        observe: mockObserve,
        unobserve: jest.fn(),
        disconnect: mockDisconnect,
      };
    });
  });

  it('hat keine Barrierefreiheitsverletzungen', async () => {
    const { container } = render(<HeroSection />);
    expect(await axe(container)).toHaveNoViolations();
  }, 15000); // Erhöhter Timeout für JSDOM Video Rendering

  it('rendert den Titel und das Eventjahr korrekt', () => {
    render(<HeroSection />);
    const title = screen.getByText('Unternehmerbörse');
    const year = screen.getByText('2026');
    expect(title).toBeInTheDocument();
    expect(year).toBeInTheDocument();
  });

  it('wechselt den Play/Pause-Status des Videos beim Klick auf den Button', () => {
    render(<HeroSection />);
    const button = screen.getByRole('button', { name: /Hintergrund-Video pausieren/i });
    const video = document.querySelector('video') as HTMLVideoElement;

    // Wir mocken die 'paused' Property auf dem Video-Element als false, damit der Klick das Video pausiert
    Object.defineProperty(video, 'paused', {
      value: false,
      writable: true,
    });

    // Klick auf Pause
    fireEvent.click(button);
    expect(video.pause).toHaveBeenCalled();
    expect(button).toHaveAttribute('aria-label', 'Hintergrund-Video abspielen');

    // Jetzt setzen wir paused auf true, damit der nächste Klick das Video abspielt
    Object.defineProperty(video, 'paused', {
      value: true,
      writable: true,
    });

    // Klick auf Play
    fireEvent.click(button);
    expect(video.play).toHaveBeenCalled();
    expect(button).toHaveAttribute('aria-label', 'Hintergrund-Video pausieren');
  });

  it('pausiert das Video, wenn die Sektion den Viewport verlässt, und startet es wieder beim Betreten', () => {
    render(<HeroSection />);
    const video = document.querySelector('video') as HTMLVideoElement;

    // paused auf false mocken
    Object.defineProperty(video, 'paused', {
      value: false,
      writable: true,
    });

    expect(window.IntersectionObserver).toHaveBeenCalled();
    expect(observerCallback).toBeDefined();

    // Simuliere: Sektion verlässt den Viewport (isIntersecting: false)
    act(() => {
      observerCallback([{ isIntersecting: false }]);
    });
    expect(video.pause).toHaveBeenCalled();

    // Simuliere: Sektion betritt den Viewport (isIntersecting: true)
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });
    expect(video.play).toHaveBeenCalled();
  });

  it('pausiert das Video direkt, wenn der Nutzer prefers-reduced-motion aktiviert hat', () => {
    // Media Query mocken für prefers-reduced-motion: true
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<HeroSection />);
    const video = document.querySelector('video') as HTMLVideoElement;

    // Video sollte pausiert sein
    expect(video.pause).toHaveBeenCalled();

    // MatchMedia Mock zurücksetzen
    window.matchMedia = originalMatchMedia;
  });

  it('reagiert auf Änderungen der prefers-reduced-motion Einstellung während der Laufzeit', () => {
    const originalMatchMedia = window.matchMedia;
    let changeHandler: any = null;
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false, // Startet mit false
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn().mockImplementation((event, cb) => {
        if (event === 'change') {
          changeHandler = cb;
        }
      }),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));

    render(<HeroSection />);
    const video = document.querySelector('video') as HTMLVideoElement;

    expect(changeHandler).toBeDefined();

    // Simuliere Änderung auf prefers-reduced-motion: true
    act(() => {
      changeHandler({ matches: true } as MediaQueryListEvent);
    });

    expect(video.pause).toHaveBeenCalled();

    // Simuliere Änderung auf prefers-reduced-motion: false (um den false-Zweig zu testen)
    act(() => {
      changeHandler({ matches: false } as MediaQueryListEvent);
    });

    // MatchMedia Mock zurücksetzen
    window.matchMedia = originalMatchMedia;
  });

  it('fängt Fehler ab, wenn das Abspielen des Videos fehlschlägt', async () => {
    const originalPlay = window.HTMLVideoElement.prototype.play;
    window.HTMLVideoElement.prototype.play = jest.fn().mockImplementation(() => Promise.reject(new Error('Play failed')));

    render(<HeroSection />);
    const button = screen.getByRole('button', { name: /Hintergrund-Video pausieren/i });
    const video = document.querySelector('video') as HTMLVideoElement;

    Object.defineProperty(video, 'paused', {
      value: false,
      writable: true,
    });
    fireEvent.click(button); // Pausieren

    Object.defineProperty(video, 'paused', {
      value: true,
      writable: true,
    });
    fireEvent.click(button); // Abspielen (triggert play, was rejectet)

    await act(async () => {
      await Promise.resolve();
    });

    expect(video.play).toHaveBeenCalled();
    window.HTMLVideoElement.prototype.play = originalPlay;
  });

  it('fängt Fehler ab, wenn das Abspielen über IntersectionObserver fehlschlägt', async () => {
    const originalPlay = window.HTMLVideoElement.prototype.play;
    window.HTMLVideoElement.prototype.play = jest.fn().mockImplementation(() => Promise.reject(new Error('Play failed')));

    render(<HeroSection />);
    
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(window.HTMLVideoElement.prototype.play).toHaveBeenCalled();
    window.HTMLVideoElement.prototype.play = originalPlay;
  });

  it('startet das Video NICHT beim Betreten des Viewports, wenn es manuell pausiert wurde', () => {
    render(<HeroSection />);
    const video = document.querySelector('video') as HTMLVideoElement;
    const button = screen.getByRole('button', { name: /Hintergrund-Video pausieren/i });

    // Manuell pausieren (isPlaying wird false)
    Object.defineProperty(video, 'paused', {
      value: false,
      writable: true,
    });
    fireEvent.click(button);
    expect(video.pause).toHaveBeenCalled();

    // IntersectionObserver mock callback triggern mit isIntersecting: true
    jest.clearAllMocks();
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    // video.play() sollte nicht aufgerufen worden sein, da isPlaying false ist
    expect(video.play).not.toHaveBeenCalled();
  });
});
