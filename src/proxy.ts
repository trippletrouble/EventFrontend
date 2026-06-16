import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decodeJwt } from 'jose';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/login'];

function isTokenValid(token: string | undefined): boolean {
  if (!token) return false;
  try {
    const { exp } = decodeJwt(token);
    return !!exp && exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function route(request: NextRequest, hasValidToken: boolean): NextResponse {
  const path = request.nextUrl.pathname;

  const isProtected = protectedRoutes.some((r) => path.startsWith(r));
  if (isProtected && !hasValidToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const isAuthRoute = authRoutes.some((r) => path.startsWith(r));
  if (isAuthRoute && hasValidToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
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

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (accessToken && refreshToken) {
    try {
      const { exp } = decodeJwt(accessToken);
      const now = Math.floor(Date.now() / 1000);
      if (exp && exp > now && exp - now < 30) {
        const newTokens = await refreshAccessToken(refreshToken);
        if (newTokens) {
          const res = route(request, true);
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
      // ignore decode errors
    }
  }

  return route(request, isTokenValid(accessToken));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};