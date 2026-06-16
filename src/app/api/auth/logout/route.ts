import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { endpoints, oidc } from '@/app/lib/auth/config';
import { clearSessionCookies } from '@/app/lib/auth/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const cookieStore = await cookies();
  const idToken = cookieStore.get('id_token')?.value;
  const refreshToken = cookieStore.get('refresh_token')?.value;

  if (refreshToken) {
    await fetch(endpoints.revocation, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        token: refreshToken,
        token_type_hint: 'refresh_token',
        client_id: oidc.clientId,
        client_secret: oidc.clientSecret,
      }),
    }).catch(() => {});
  }

  const endUrl = new URL(endpoints.endSession);
  if (idToken) endUrl.searchParams.set('id_token_hint', idToken);
  endUrl.searchParams.set(
    'post_logout_redirect_uri',
    process.env.APP_ORIGIN ?? 'http://localhost:3000',
  );

  const res = NextResponse.redirect(endUrl);
  clearSessionCookies(res);
  return res;
}