import 'server-only';
import { getSession, Session } from './session';

export async function verifySession(): Promise<Session | null> {
  return getSession();
}
