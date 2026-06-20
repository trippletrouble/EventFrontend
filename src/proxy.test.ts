import { proxy } from '@/proxy';
import { NextRequest } from 'next/server';
import * as jose from 'jose';

jest.mock('jose', () => ({
  decodeJwt: jest.fn(),
}));

describe('Middleware / proxy.ts Routing Guard', () => {
  const mockDecodeJwt = jose.decodeJwt as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockNextRequest = (pathname: string, hasCookie: boolean): NextRequest => {
    const getMock = jest.fn().mockImplementation((name: string) => {
      if (name === 'access_token' && hasCookie) {
        return { value: 'valid-token' };
      }
      return undefined;
    });

    if (hasCookie) {
      mockDecodeJwt.mockReturnValue({
        exp: Math.floor(Date.now() / 1000) + 60,
      });
    }

    return {
      nextUrl: {
        pathname,
      },
      url: `http://localhost:3000${pathname}`,
      cookies: {
        has: jest.fn().mockReturnValue(hasCookie),
        get: getMock,
      },
    } as unknown as NextRequest;
  };

  it('redirects unauthenticated users from /dashboard to /login', async () => {
    const req = mockNextRequest('/dashboard', false);
    const res = await proxy(req);

    expect(res).toBeDefined();
    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toBe('http://localhost:3000/login');
  });

  it('allows authenticated users to access /dashboard', async () => {
    const req = mockNextRequest('/dashboard', true);
    const res = await proxy(req);

    expect(res).toBeDefined();
    expect(res?.headers.get('x-middleware-next')).toBe('1');
  });

  it('redirects authenticated users away from /login to /', async () => {
    const req = mockNextRequest('/login', true);
    const res = await proxy(req);

    expect(res).toBeDefined();
    expect(res?.status).toBe(307);
    expect(res?.headers.get('location')).toBe('http://localhost:3000/');
  });

  it('allows unauthenticated users to access /login', async () => {
    const req = mockNextRequest('/login', false);
    const res = await proxy(req);

    expect(res).toBeDefined();
    expect(res?.headers.get('x-middleware-next')).toBe('1');
  });

  it('allows access to public pages (e.g. /)', async () => {
    const req = mockNextRequest('/', false);
    const res = await proxy(req);

    expect(res).toBeDefined();
    expect(res?.headers.get('x-middleware-next')).toBe('1');
  });
});
