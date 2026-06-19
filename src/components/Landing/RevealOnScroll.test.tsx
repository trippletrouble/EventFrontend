import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { RevealOnScroll } from './RevealOnScroll';

describe('RevealOnScroll-Komponente', () => {
  let observerCallback: IntersectionObserverCallback;
  const mockObserve = jest.fn();
  const mockUnobserve = jest.fn();
  const mockDisconnect = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.IntersectionObserver = jest.fn().mockImplementation((cb) => {
      observerCallback = cb;
      return {
        observe: mockObserve,
        unobserve: mockUnobserve,
        disconnect: mockDisconnect,
      };
    });
  });

  it('rendert die Kind-Elemente korrekt', () => {
    render(
      <RevealOnScroll>
        <span data-testid="child">Inhalt</span>
      </RevealOnScroll>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('fügt die Klasse is-visible hinzu und führt unobserve aus, wenn der IntersectionObserver triggert', () => {
    const { container } = render(
      <RevealOnScroll>
        <div>Inhalt</div>
      </RevealOnScroll>
    );
    const wrapper = container.firstChild as HTMLElement;

    expect(wrapper).toHaveClass('reveal-item');
    expect(wrapper).not.toHaveClass('is-visible');

    // Trigger IntersectionObserver callback mit isIntersecting: true
    act(() => {
      observerCallback!([{ isIntersecting: true, target: wrapper } as unknown as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    expect(wrapper).toHaveClass('is-visible');
    expect(mockUnobserve).toHaveBeenCalledWith(wrapper);
  });

  it('fügt die Klasse is-visible hinzu, wenn ein Kind-Element den Fokus erhält', () => {
    const { container } = render(
      <RevealOnScroll>
        <input data-testid="input" type="text" />
      </RevealOnScroll>
    );
    const wrapper = container.firstChild as HTMLElement;

    // Trigger focusin Event
    fireEvent.focusIn(wrapper);

    expect(wrapper).toHaveClass('is-visible');
    expect(mockUnobserve).toHaveBeenCalledWith(wrapper);
  });

  it('nutzt den übergebenen transition delay style', () => {
    const { container } = render(
      <RevealOnScroll delay={300}>
        <div>Inhalt</div>
      </RevealOnScroll>
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveStyle('transition-delay: 300ms');
  });

  it('überspringt den IntersectionObserver, wenn der Nutzer prefers-reduced-motion aktiviert hat', () => {
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

    render(
      <RevealOnScroll>
        <div>Inhalt</div>
      </RevealOnScroll>
    );

    expect(window.IntersectionObserver).not.toHaveBeenCalled();

    // MatchMedia Mock zurücksetzen
    window.matchMedia = originalMatchMedia;
  });

  it('räumt den Observer und Event Listener beim Unmounten auf', () => {
    const { unmount, container } = render(
      <RevealOnScroll>
        <div>Inhalt</div>
      </RevealOnScroll>
    );
    const wrapper = container.firstChild as HTMLElement;
    const removeSpy = jest.spyOn(wrapper, 'removeEventListener');

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalledWith('focusin', expect.any(Function));
  });

  it('fügt die Klasse is-visible NICHT hinzu, wenn der IntersectionObserver mit isIntersecting: false triggert', () => {
    const { container } = render(
      <RevealOnScroll>
        <div>Inhalt</div>
      </RevealOnScroll>
    );
    const wrapper = container.firstChild as HTMLElement;

    act(() => {
      observerCallback!([{ isIntersecting: false, target: wrapper } as unknown as IntersectionObserverEntry], {} as IntersectionObserver);
    });

    expect(wrapper).not.toHaveClass('is-visible');
    expect(mockUnobserve).not.toHaveBeenCalled();
  });
});
