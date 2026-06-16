import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SkipNavLink } from './SkipNavLink';

expect.extend(toHaveNoViolations);

describe('SkipNavLink', () => {
  it('hat keine A11y-Violations', async () => {
    const { container } = render(<SkipNavLink />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('verweist auf #main-content', () => {
    render(<SkipNavLink />);
    const link = screen.getByRole('link', { name: /zum hauptinhalt springen/i });
    expect(link).toHaveAttribute('href', '#main-content');
  });

  it('ist fokussierbar und wird bei Tastaturbedienung erfasst', async () => {
    const user = userEvent.setup();
    render(<SkipNavLink />);
    
    await user.tab();
    expect(screen.getByRole('link', { name: /zum hauptinhalt springen/i })).toHaveFocus();
  });
});
