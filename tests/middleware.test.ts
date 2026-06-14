import { proxy } from '../src/proxy';
import { NextRequest } from 'next/server';

describe('Middleware / proxy.ts Routing Guard', () => {
  const mockNextRequest = (pathname: string, hasCookie: boolean): NextRequest => {
    return {
      nextUrl: {
        pathname,
      },
      url: `http://localhost:3000${pathname}`,
      cookies: {
        has: jest.fn().mockReturnValue(hasCookie),
      },
    } as unknown as NextRequest;
  };

  it('redirects unauthenticated users from /dashboard to /login', () => {
    const req = mockNextRequest('/dashboard', false);
    const res = proxy(req);

    expect(res).toBeDefined();
    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toBe('http://localhost:3000/login');
  });

  it('allows authenticated users to access /dashboard', () => {
    const req = mockNextRequest('/dashboard', true);
    const res = proxy(req);

    expect(res).toBeDefined();
    expect(res?.headers.get('x-middleware-next')).toBe('1');
  });

  it('redirects authenticated users away from /login to /', () => {
    const req = mockNextRequest('/login', true);
    const res = proxy(req);

    expect(res).toBeDefined();
    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toBe('http://localhost:3000/');
  });

  it('allows unauthenticated users to access /login', () => {
    const req = mockNextRequest('/login', false);
    const res = proxy(req);

    expect(res).toBeDefined();
    expect(res?.headers.get('x-middleware-next')).toBe('1');
  });

  it('allows access to public pages (e.g. /)', () => {
    const req = mockNextRequest('/', false);
    const res = proxy(req);

    expect(res).toBeDefined();
    expect(res?.headers.get('x-middleware-next')).toBe('1');
  });
});
