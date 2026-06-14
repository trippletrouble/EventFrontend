import 'server-only';
import { unauthorized } from 'next/navigation';
import { verifySession } from './dal';
import { Session } from './session';

export async function requireAuth(): Promise<Session> {
  const session = await verifySession();
  if (!session) {
    unauthorized();
  }
  return session;
}
