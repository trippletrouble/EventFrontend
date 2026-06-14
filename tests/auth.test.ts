import { getSession } from '../src/app/lib/session';
import { verifySession } from '../src/app/lib/dal';
import { requireAuth } from '../src/app/lib/protect';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import { unauthorized } from 'next/navigation';

jest.mock('next/headers', () => ({
  cookies: jest.fn(),
}));

jest.mock('jose', () => ({
  decodeJwt: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  unauthorized: jest.fn(),
}));

describe('Authentication Helpers', () => {
  const mockCookies = cookies as jest.Mock;
  const mockDecodeJwt = jose.decodeJwt as jest.Mock;
  const mockUnauthorized = unauthorized as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('session.ts - getSession', () => {
    it('should return null if no cookie is present', async () => {
      const getMock = jest.fn().mockReturnValue(undefined);
      mockCookies.mockResolvedValue({ get: getMock });

      const result = await getSession();
      expect(result).toBeNull();
      expect(getMock).toHaveBeenCalledWith('session_token');
    });

    it('should return null if payload has no exp claim', async () => {
      const getMock = jest.fn().mockReturnValue({ value: 'some-token' });
      mockCookies.mockResolvedValue({ get: getMock });
      mockDecodeJwt.mockReturnValue({
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
        sub: 'sub-123',
      });

      const result = await getSession();
      expect(result).toBeNull();
    });

    it('should return null if token is expired', async () => {
      const getMock = jest.fn().mockReturnValue({ value: 'some-token' });
      mockCookies.mockResolvedValue({ get: getMock });
      mockDecodeJwt.mockReturnValue({
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
        sub: 'sub-123',
        exp: Math.floor(Date.now() / 1000) - 10,
      });

      const result = await getSession();
      expect(result).toBeNull();
    });

    it('should return null if token payload is missing fields', async () => {
      const getMock = jest.fn().mockReturnValue({ value: 'some-token' });
      mockCookies.mockResolvedValue({ get: getMock });
      mockDecodeJwt.mockReturnValue({
        userId: 1,
        email: 'test@example.com',
        exp: Math.floor(Date.now() / 1000) + 10,
      });

      const result = await getSession();
      expect(result).toBeNull();
    });

    it('should return decoded session if token is valid', async () => {
      const getMock = jest.fn().mockReturnValue({ value: 'some-token' });
      mockCookies.mockResolvedValue({ get: getMock });
      mockDecodeJwt.mockReturnValue({
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
        sub: 'sub-123',
        exp: Math.floor(Date.now() / 1000) + 60,
      });

      const result = await getSession();
      expect(result).toEqual({
        userId: 1,
        email: 'test@example.com',
        role: 'USER',
        sub: 'sub-123',
      });
    });

    it('should return null on catch block error', async () => {
      mockCookies.mockRejectedValue(new Error('Cookie error'));
      const result = await getSession();
      expect(result).toBeNull();
    });
  });

  describe('dal.ts - verifySession', () => {
    it('should delegate to getSession and return session info', async () => {
      const getMock = jest.fn().mockReturnValue({ value: 'some-token' });
      mockCookies.mockResolvedValue({ get: getMock });
      mockDecodeJwt.mockReturnValue({
        userId: 2,
        email: 'admin@example.com',
        role: 'ADMIN',
        sub: 'sub-456',
        exp: Math.floor(Date.now() / 1000) + 60,
      });

      const result = await verifySession();
      expect(result).toEqual({
        userId: 2,
        email: 'admin@example.com',
        role: 'ADMIN',
        sub: 'sub-456',
      });
    });

    it('should return null if getSession returns null', async () => {
      const getMock = jest.fn().mockReturnValue(undefined);
      mockCookies.mockResolvedValue({ get: getMock });

      const result = await verifySession();
      expect(result).toBeNull();
    });
  });

  describe('protect.ts - requireAuth', () => {
    it('should return session if verifySession resolves to valid session', async () => {
      const getMock = jest.fn().mockReturnValue({ value: 'some-token' });
      mockCookies.mockResolvedValue({ get: getMock });
      mockDecodeJwt.mockReturnValue({
        userId: 3,
        email: 'user@example.com',
        role: 'USER',
        sub: 'sub-789',
        exp: Math.floor(Date.now() / 1000) + 60,
      });

      const result = await requireAuth();
      expect(result).toEqual({
        userId: 3,
        email: 'user@example.com',
        role: 'USER',
        sub: 'sub-789',
      });
      expect(mockUnauthorized).not.toHaveBeenCalled();
    });

    it('should trigger unauthorized() if session is invalid', async () => {
      const getMock = jest.fn().mockReturnValue(undefined);
      mockCookies.mockResolvedValue({ get: getMock });

      await requireAuth();
      expect(mockUnauthorized).toHaveBeenCalled();
    });
  });
});
