import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/login'];

export function proxy(request: NextRequest) {
  const { nextUrl, cookies } = request;
  const hasToken = cookies.has('session_token');
  const path = nextUrl.pathname;

  // 1. Redirect unauthenticated users from protected routes to /login
  const isProtected = protectedRoutes.some((route) => path.startsWith(route));
  if (isProtected && !hasToken) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect authenticated users away from auth routes (/login) to /
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));
  if (isAuthRoute && hasToken) {
    const homeUrl = new URL('/', request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

