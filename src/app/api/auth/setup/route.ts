import { NextRequest, NextResponse } from 'next/server';
import { hashPassword } from '@/lib/auth-node';
import { createSessionToken, SESSION_COOKIE } from '@/lib/auth';
import { getAppSettings, updateAppSettings } from '@/lib/appSettings';

export async function POST(req: NextRequest) {
  const settings = await getAppSettings();

  // Setup can only run once — if a password is already set, reject
  if (settings.passwordHash) {
    return NextResponse.json({ error: 'Already configured' }, { status: 403 });
  }

  const { password, anthropicApiKey } = await req.json();
  if (!password || password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
  }
  if (!anthropicApiKey || !anthropicApiKey.startsWith('sk-')) {
    return NextResponse.json({ error: 'A valid Anthropic API key is required' }, { status: 400 });
  }

  const passwordHash = hashPassword(password);
  await updateAppSettings({ passwordHash, anthropicApiKey });

  const secret = process.env.APP_SECRET!;
  const token = await createSessionToken(secret);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}
