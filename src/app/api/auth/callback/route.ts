import { NextRequest, NextResponse } from 'next/server';
import { createRemoteJWKSet, jwtVerify } from 'jose';
import { oidc, endpoints } from '@/app/lib/auth/config';
import { setSessionCookies } from '@/app/lib/auth/session';

export const runtime = 'nodejs';

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(endpoints.jwks));
  }
  return jwks;
}

async function verifyIdToken(idToken: string, nonce: string | undefined) {
  const { payload } = await jwtVerify(idToken, getJwks(), {
    issuer: oidc.issuer,
    audience: oidc.clientId,
  });
  if (nonce && payload.nonce !== nonce) throw new Error('nonce mismatch');
  return payload;
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const oauthErr = url.searchParams.get('error');

  if (oauthErr) {
    return NextResponse.redirect(
      new URL(`/login?error=${oauthErr}`, url.origin),
    );
  }
  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/login?error=invalid_request', url.origin),
    );
  }

  const expectedState = req.cookies.get('oidc_state')?.value;
  const verifier = req.cookies.get('oidc_verifier')?.value;
  const nonce = req.cookies.get('oidc_nonce')?.value;
  const returnTo = req.cookies.get('oidc_return')?.value ?? '/';

  if (!expectedState || !verifier || state !== expectedState) {
    return NextResponse.redirect(
      new URL('/login?error=state_mismatch', url.origin),
    );
  }

  const tokenRes = await fetch(endpoints.token, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    cache: 'no-store',
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: oidc.redirectUri,
      client_id: oidc.clientId,
      client_secret: oidc.clientSecret,
      code_verifier: verifier,
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(
      new URL('/login?error=token_exchange', url.origin),
    );
  }

  const tokens = await tokenRes.json();
  try {
    await verifyIdToken(tokens.id_token, nonce);
  } catch {
    return NextResponse.redirect(
      new URL('/login?error=invalid_id_token', url.origin),
    );
  }

  const res = NextResponse.redirect(new URL(returnTo, url.origin));
  setSessionCookies(res, tokens);
  const clearOpts = { httpOnly: true, maxAge: 0, path: '/api/auth' };
  for (const name of ['oidc_verifier', 'oidc_state', 'oidc_nonce']) {
    res.cookies.set(name, '', clearOpts);
  }
  res.cookies.set('oidc_return', '', { ...clearOpts, path: '/api/auth/callback' });
  return res;
}