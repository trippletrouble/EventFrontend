import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MobileMenu } from './MobileMenu';

expect.extend(toHaveNoViolations);

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

const mockNavLinks = [
  { href: '#event-info', label: 'Das Event' },
  { href: '#exhibitor-info', label: 'Für Aussteller' },
];

const defaultProps = {
  navLinks: mockNavLinks,
  isAuthenticated: false,
  logout: jest.fn(),
  onDarkBg: true,
  dropdownCls: 'dropdown-cls',
  dropdownItemCls: 'item-cls',
};

describe('MobileMenu', () => {
  it('hat keine A11y-Violations', async () => {
    const { container } = render(<MobileMenu {...defaultProps} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('rendert den Hamburger-Button mit korrekten ARIA-Attributen', () => {
    render(<MobileMenu {...defaultProps} />);
    const button = screen.getByRole('button', { name: /menü öffnen/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('aria-expanded', 'false');
  });

  it('öffnet das Menü bei Klick und zeigt die Links an', async () => {
    const user = userEvent.setup();
    render(<MobileMenu {...defaultProps} />);

    const button = screen.getByRole('button', { name: /menü öffnen/i });
    await user.click(button);

    // Check that the menu items are visible
    const link1 = screen.getByRole('menuitem', { name: 'Das Event' });
    const link2 = screen.getByRole('menuitem', { name: 'Für Aussteller' });
    expect(link1).toBeInTheDocument();
    expect(link2).toBeInTheDocument();
  });
});
