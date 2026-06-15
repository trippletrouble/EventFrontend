/** @jest-environment jsdom */
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/app/providers/AuthProvider';
import { navigateTo } from '../src/app/lib/navigation';

// Mock fetch
global.fetch = jest.fn();

// Mock navigateTo
jest.mock('../src/app/lib/navigation', () => ({
  navigateTo: jest.fn(),
}));

// Component to access useAuth hook
const TestComponent = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="loading">{isLoading ? 'loading' : 'done'}</div>
      <div data-testid="auth">{isAuthenticated ? 'authenticated' : 'unauthenticated'}</div>
      <div data-testid="email">{user?.email || 'no-email'}</div>
      <button data-testid="btn-login" onClick={login}>Login</button>
      <button data-testid="btn-logout" onClick={logout}>Logout</button>
    </div>
  );
};

describe('AuthProvider Component', () => {
  const mockFetch = global.fetch as jest.Mock;
  const mockNavigateTo = navigateTo as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws an error when useAuth is used outside AuthProvider', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow('useAuth must be used within an AuthProvider');
    consoleErrorSpy.mockRestore();
  });

  it('renders children and loads session successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: { userId: 1, email: 'test@example.com', role: 'USER' },
        isAuthenticated: true,
      }),
    } as any);

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId('loading').textContent).toBe('done');
    expect(screen.getByTestId('auth').textContent).toBe('authenticated');
    expect(screen.getByTestId('email').textContent).toBe('test@example.com');
  });

  it('handles session load failure/unauthenticated state', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: null,
        isAuthenticated: false,
      }),
    } as any);

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    expect(screen.getByTestId('loading').textContent).toBe('done');
    expect(screen.getByTestId('auth').textContent).toBe('unauthenticated');
    expect(screen.getByTestId('email').textContent).toBe('no-email');
  });

  it('login redirects to backend', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: null, isAuthenticated: false }),
    } as any);

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    const loginBtn = screen.getByTestId('btn-login');
    act(() => {
      loginBtn.click();
    });

    expect(mockNavigateTo).toHaveBeenCalledWith(expect.stringContaining('/auth/oauth'));
  });

  it('logout redirects to API route', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ user: null, isAuthenticated: false }),
    } as any);

    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });

    const logoutBtn = screen.getByTestId('btn-logout');
    act(() => {
      logoutBtn.click();
    });

    expect(mockNavigateTo).toHaveBeenCalledWith('/api/auth/logout');
  });
});
