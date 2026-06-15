import React from 'react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { render, screen } from '@testing-library/react';
import Header from './Header';

expect.extend(toHaveNoViolations);

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

// Mock useSession hook
const mockUseSession = jest.fn();
jest.mock('@/hooks/useSession', () => ({
  useSession: () => mockUseSession(),
}));

describe('Header', () => {
  beforeEach(() => {
    mockUseSession.mockReset();
  });

  it('hat keine A11y-Violations im unauthentifizierten Zustand', async () => {
    mockUseSession.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      logout: jest.fn(),
    });

    const { container } = render(<Header />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('zeigt Anmelde-Link wenn nicht eingeloggt', () => {
    mockUseSession.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      logout: jest.fn(),
    });

    render(<Header />);
    expect(screen.getByRole('link', { name: /anmelden/i })).toBeInTheDocument();
  });

  it('zeigt den Vornamen des Nutzers und das Dashboard-Link wenn eingeloggt', () => {
    mockUseSession.mockReturnValue({
      user: { firstName: 'Max' },
      isAuthenticated: true,
      isAdmin: false,
      logout: jest.fn(),
    });

    render(<Header />);
    expect(screen.getByText('Max')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
  });

  it('zeigt den Admin-Link wenn der Nutzer Admin ist', () => {
    mockUseSession.mockReturnValue({
      user: { firstName: 'AdminUser' },
      isAuthenticated: true,
      isAdmin: true,
      logout: jest.fn(),
    });

    render(<Header />);
    expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument();
  });
});
