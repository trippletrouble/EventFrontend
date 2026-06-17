import React from 'react';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CTABanner } from './CTABanner';

expect.extend(toHaveNoViolations);

describe('CTABanner-Komponente', () => {
  it('hat keine Barrierefreiheitsverletzungen', async () => {
    const { container } = render(<CTABanner />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert die Überschrift korrekt', () => {
    render(<CTABanner />);
    const heading = screen.getByRole('heading', { name: 'Werden Sie Aussteller.' });
    expect(heading).toBeInTheDocument();
  });

  it('rendert den Aktionsbutton mit dem korrekten Link und Ziel', () => {
    render(<CTABanner />);
    const button = screen.getByRole('link', { name: 'Stand buchen →' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', '/register');
  });
});
