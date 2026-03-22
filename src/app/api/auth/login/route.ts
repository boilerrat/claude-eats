import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth-node';
import { createSessionToken, SESSION_COOKIE } from '@/lib/auth';
import { getAppSettings } from '@/lib/appSettings';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  if (!password) {
    return NextResponse.json({ error: 'Password required' }, { status: 400 });
  }

  const settings = await getAppSettings();
  if (!settings.passwordHash) {
    return NextResponse.json({ error: 'App not configured — visit /setup first' }, { status: 403 });
  }

  if (!verifyPassword(password, settings.passwordHash)) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const secret = process.env.APP_SECRET!;
  const token = await createSessionToken(secret);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}
