import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

import { CTABanner } from './CTABanner';

jest.mock('next/router', () => ({ useRouter: () => ({ push: jest.fn() }) }));
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }));

expect.extend(toHaveNoViolations);

describe('CTABanner', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  it('rendert das Element initial korrekt', () => {
    render(<CTABanner />);

    const heading = screen.getByRole('heading', { level: 2, name: /Werden Sie Aussteller\./i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveAttribute('tabindex', '0');

    const link = screen.getByRole('link', { name: /Stand buchen/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/register');

    const section = heading.closest('section');
    expect(section).toHaveAttribute('data-navbar', 'light');

    const strips = screen.queryAllByRole('presentation');
    if (strips.length > 0) {
      expect(strips[0]).toHaveStyle('background: linear-gradient(90deg, #000 0%, #000 27.88%, #0AD88E 100%)');
    } else {
      const topStripe = document.querySelector('.stripe-reveal') as HTMLElement | null;
      expect(topStripe).not.toBeNull();
      expect(topStripe).toHaveStyle('background: linear-gradient(90deg, #000 0%, #000 27.88%, #0AD88E 100%)');
    }
  });

  it('hat keine Barrierefreiheitsverstöße nach axe', async () => {
    const { container } = render(<CTABanner />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('ermöglicht Tastaturfokussierung und Tab-Reihenfolge', async () => {
    render(<CTABanner />);
    const heading = screen.getByRole('heading', { level: 2, name: /Werden Sie Aussteller\./i });
    const link = screen.getByRole('link', { name: /Stand buchen/i }) as HTMLAnchorElement;

    await userEvent.tab();
    expect(document.activeElement).toBe(heading);

    await userEvent.tab();
    expect(document.activeElement).toBe(link);
  });

  it('führt beim Drücken der Enter-Taste auf dem Link eine Navigation aus', async () => {
    render(<CTABanner />);
    const link = screen.getByRole('link', { name: /Stand buchen/i }) as HTMLAnchorElement;

    const handler = jest.fn();
    link.addEventListener('click', handler);
    link.focus();
    await userEvent.type(link, '{Enter}');
    expect(handler).toHaveBeenCalled();
  });

  it('führt beim Drücken der Leertaste auf dem Link eine Navigation aus', async () => {
    render(<CTABanner />);
    const link = screen.getByRole('link', { name: /Stand buchen/i }) as HTMLAnchorElement;

    const handler = jest.fn();
    link.addEventListener('click', handler);
    link.focus();
    await userEvent.type(link, ' ');
    expect(handler).toHaveBeenCalled();
  });

  it('behandelt Escape-Tastendruck ohne Fehlverhalten', async () => {
    render(<CTABanner />);
    const heading = screen.getByRole('heading', { level: 2, name: /Werden Sie Aussteller\./i });

    heading.focus();
    await userEvent.keyboard('{Escape}');

    expect(document.activeElement).toBe(heading);
  });

  it('reagiert auf Mausklick auf den Link mit Navigation', async () => {
    render(<CTABanner />);
    const link = screen.getByRole('link', { name: /Stand buchen/i }) as HTMLAnchorElement;

    const handler = jest.fn();
    link.addEventListener('click', handler);
    await userEvent.click(link);
    expect(handler).toHaveBeenCalled();
  });
});

