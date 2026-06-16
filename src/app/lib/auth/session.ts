import { NextResponse } from 'next/server';

const base = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in?: number;
  refresh_expires_in?: number;
}

export function setSessionCookies(res: NextResponse, t: TokenResponse) {
  res.cookies.set('access_token', t.access_token, {
    ...base,
    maxAge: t.expires_in ?? 300,
  });
  if (t.refresh_token) {
    res.cookies.set('refresh_token', t.refresh_token, {
      ...base,
      maxAge: t.refresh_expires_in ?? 1800,
    });
  }
  if (t.id_token) {
    res.cookies.set('id_token', t.id_token, {
      ...base,
      maxAge: t.expires_in ?? 300,
    });
  }
}

export function clearSessionCookies(res: NextResponse) {
  for (const name of ['access_token', 'refresh_token', 'id_token']) {
    res.cookies.set(name, '', { ...base, maxAge: 0 });
  }
}