import { NextRequest, NextResponse } from 'next/server';
import { oidc, endpoints } from '@/app/lib/auth/config';
import {
  generateVerifier,
  challengeFromVerifier,
  randomToken,
} from '@/app/lib/auth/pkce';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const verifier = generateVerifier();
  const challenge = challengeFromVerifier(verifier);
  const state = randomToken();
  const nonce = randomToken();

  const raw = req.nextUrl.searchParams.get('returnTo') ?? '/';
  const returnTo =
    raw.startsWith('/') && !raw.startsWith('//') ? raw : '/';

  const url = new URL(endpoints.authorization);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', oidc.clientId);
  url.searchParams.set('redirect_uri', oidc.redirectUri);
  url.searchParams.set('scope', oidc.scope);
  url.searchParams.set('state', state);
  url.searchParams.set('nonce', nonce);
  url.searchParams.set('code_challenge', challenge);
  url.searchParams.set('code_challenge_method', 'S256');

  const res = NextResponse.redirect(url);
  const txOpts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/api/auth',
    maxAge: 300,
  };
  res.cookies.set('oidc_verifier', verifier, txOpts);
  res.cookies.set('oidc_state', state, txOpts);
  res.cookies.set('oidc_nonce', nonce, txOpts);
  res.cookies.set('oidc_return', returnTo, {
    ...txOpts,
    path: '/api/auth/callback',
  });
  return res;
}