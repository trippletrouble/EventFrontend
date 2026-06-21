import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CarouselSection } from './CarouselSection';

expect.extend(toHaveNoViolations);

describe('CarouselSection', () => {
  it('hat keine A11y-Violations', async () => {
    const { container } = render(<CarouselSection />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert den Play-Button initial und wechselt zu Pause bei Klick', async () => {
    const user = userEvent.setup();
    render(<CarouselSection />);

    const button = screen.getByRole('button', { name: /logo-karussell abspielen/i });
    expect(button).toBeInTheDocument();

    await user.click(button);
    expect(screen.getByRole('button', { name: /logo-karussell pausieren/i })).toBeInTheDocument();
  });
});
