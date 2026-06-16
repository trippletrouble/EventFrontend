import { NextRequest, NextResponse } from 'next/server';
import { decodeJwt } from 'jose';
import { proxy } from './proxy';

export { config } from './proxy';

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (accessToken && refreshToken) {
    try {
      const { exp } = decodeJwt(accessToken);
      const now = Math.floor(Date.now() / 1000);
      if (exp && exp > now && exp - now < 30) {
        const newTokens = await refreshAccessToken(refreshToken);
        if (newTokens) {
          const res = proxy(request);
          const cookieBase = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const,
            path: '/',
          };
          res.cookies.set('access_token', newTokens.access_token, {
            ...cookieBase,
            maxAge: newTokens.expires_in,
          });
          if (newTokens.refresh_token) {
            res.cookies.set('refresh_token', newTokens.refresh_token, {
              ...cookieBase,
              maxAge: newTokens.refresh_expires_in ?? 1800,
            });
          }
          return res;
        }
      }
    } catch {
      // ignore decode errors, fall through to proxy
    }
  }

  return proxy(request);
}

async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  refresh_expires_in?: number;
} | null> {
  try {
    const res = await fetch(
      `${process.env.OIDC_ISSUER}/protocol/openid-connect/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: process.env.OIDC_CLIENT_ID!,
          client_secret: process.env.OIDC_CLIENT_SECRET!,
        }),
      },
    );
    return res.ok ? res.json() : null;
  } catch {
    return null;
  }
}