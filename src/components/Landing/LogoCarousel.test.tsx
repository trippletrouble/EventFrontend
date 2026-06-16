import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import { LogoCarousel } from './LogoCarousel';

expect.extend(toHaveNoViolations);

const mockLogos = [
  { name: 'Logo 1' },
  { name: 'Logo 2' },
];

describe('LogoCarousel', () => {
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
});
