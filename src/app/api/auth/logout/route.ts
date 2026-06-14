import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('session_token')?.value;

  // Clear session_token cookie on frontend side
  cookieStore.delete('session_token');

  // Trigger POST /auth/logout request to the backend
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3100';
  try {
    await fetch(`${backendUrl}/auth/logout`, {
      method: 'POST',
      headers: {
        Cookie: token ? `session_token=${token}` : '',
      },
    });
  } catch (error) {
    console.error('Failed to notify backend of logout:', error);
  }

  // Redirect to login page
  const loginUrl = new URL('/login', request.url);
  return NextResponse.redirect(loginUrl);
}
