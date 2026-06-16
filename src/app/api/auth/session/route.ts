import { NextResponse } from 'next/server';
import { verifySession } from '@/app/lib/dal';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await verifySession();

  if (!session) {
    return NextResponse.json({ user: null, isAuthenticated: false });
  }

  return NextResponse.json({
    user: {
      sub: session.sub,
      email: session.email,
      role: session.role,
    },
    isAuthenticated: true,
  });
}
