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

export function proxy(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const hasValidToken = isTokenValid(cookies.get('access_token')?.value);
  const path = nextUrl.pathname;

  const isProtected = protectedRoutes.some((route) => path.startsWith(route));
  if (isProtected && !hasValidToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));
  if (isAuthRoute && hasValidToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};