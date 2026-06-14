import 'server-only';
import { cookies } from 'next/headers';
import * as jose from 'jose';

export interface Session {
  userId: number;
  email: string;
  role: string;
  sub: string;
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('session_token')?.value;
    if (!token) {
      return null;
    }

    const payload = jose.decodeJwt(token);

    // Validate expiration
    if (!payload.exp) {
      return null;
    }

    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
      return null;
    }

    if (
      typeof payload.userId !== 'number' ||
      typeof payload.email !== 'string' ||
      typeof payload.role !== 'string' ||
      typeof payload.sub !== 'string'
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
      sub: payload.sub,
    };
  } catch {
    return null;
  }
}
