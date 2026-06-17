import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { KeywordAnimation } from './KeywordAnimation';

describe('KeywordAnimation-Komponente', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('rendert den Text korrekt', () => {
    render(<KeywordAnimation text="Chance" />);
    const textElement = screen.getByText('Chance');
    expect(textElement).toBeInTheDocument();
  });

  it('wechselt die Klassen nach dem Delay von unsichtbar auf sichtbar', () => {
    const { container } = render(<KeywordAnimation text="Chance" delay={500} />);
    const span = container.firstChild as HTMLElement;

    // Direkt nach dem Rendern: Unsichtbar
    expect(span).toHaveClass('opacity-0');
    expect(span).toHaveClass('translate-x-12');

    // 500ms vergehen lassen
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Nach dem Delay: Sichtbar
    expect(span).toHaveClass('opacity-100');
    expect(span).toHaveClass('translate-x-0');
  });
});
