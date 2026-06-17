import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { LogoCarousel } from './LogoCarousel';

expect.extend(toHaveNoViolations);

const mockLogos = [
  { name: 'Logo 1' },
  { name: 'Logo 2' },
];

describe('LogoCarousel', () => {
  let observerCallback: IntersectionObserverCallback;
  const mockObserve = jest.fn();
  const mockDisconnect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.IntersectionObserver = jest.fn().mockImplementation((cb) => {
      observerCallback = cb;
      return {
        observe: mockObserve,
        unobserve: jest.fn(),
        disconnect: mockDisconnect,
      };
    });
  });

  it('hat keine A11y-Violations', async () => {
    const { container } = render(<LogoCarousel logos={mockLogos} isPaused={false} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert alle übergebenen Logos in vervielfachter Form für den nahtlosen Loop', () => {
    render(<LogoCarousel logos={mockLogos} isPaused={false} />);
    const logoElements = screen.getAllByText(/Logo \d/);
    // Da das LogoCarousel die Liste viermal dupliziert, sollten es hier 8 Elemente sein.
    expect(logoElements.length).toBe(8);
  });

  it('rendert Fallback-Text, wenn das Bild nicht geladen werden kann', () => {
    const logosWithSrc = [{ name: 'Logo Err', src: '/invalid-path.jpg' }];
    const { container } = render(<LogoCarousel logos={logosWithSrc} isPaused={false} />);
    
    // Zuerst sollten alle 4 img-Elemente existieren
    const imgElements = container.querySelectorAll('img');
    expect(imgElements.length).toBe(4);
    
    // Fehler auf allen Bildern simulieren
    act(() => {
      imgElements.forEach(img => {
        fireEvent.error(img);
      });
    });
    
    // Jetzt sollte der Name als Text gerendert werden (4 mal wegen Duplizierung)
    const textElements = screen.getAllByText('Logo Err');
    expect(textElements.length).toBe(4);
  });

  it('pausiert die Animation, wenn das Karussell den Viewport verlässt (IntersectionObserver)', () => {
    const { container } = render(<LogoCarousel logos={mockLogos} isPaused={false} />);
    const marquee = container.querySelector('.flex.animate-marquee') as HTMLElement;
    
    expect(marquee.style.animationPlayState).toBe('running');
    expect(observerCallback).toBeDefined();
    
    // Simuliere: Ausserhalb des Viewports (isIntersecting: false)
    act(() => {
      observerCallback!([{ isIntersecting: false } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    expect(marquee.style.animationPlayState).toBe('paused');
    
    // Simuliere: Zurück im Viewport (isIntersecting: true)
    act(() => {
      observerCallback!([{ isIntersecting: true } as IntersectionObserverEntry], {} as IntersectionObserver);
    });
    expect(marquee.style.animationPlayState).toBe('running');
  });
});
