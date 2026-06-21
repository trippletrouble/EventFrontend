import 'server-only';
import { cookies } from 'next/headers';
import { decodeJwt } from 'jose';

export interface Session {
  sub: string;
  email: string;
  role: string;
}

export async function getSession(): Promise<Session | null> {
  if (process.env.NODE_ENV === 'development') {
    return {
      sub: 'mock-sub-123',
      email: 'mock-user@hof-university.de',
      role: 'exhibitor',
    };
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('access_token')?.value;
    if (!token) return null;

    const payload = decodeJwt(token);

    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    const sub = typeof payload.sub === 'string' ? payload.sub : null;
    const email = typeof payload.email === 'string' ? payload.email : null;
    if (!sub || !email) return null;

    const realmRoles =
      (payload.realm_access as { roles?: string[] } | undefined)?.roles ?? [];
    const role = realmRoles[0] ?? '';

    return { sub, email, role };
  } catch {
    return null;
  }
}