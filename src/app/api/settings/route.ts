import { NextRequest, NextResponse } from 'next/server';
import { getAppSettings, updateAppSettings } from '@/lib/appSettings';
import { hashPassword, verifyPassword } from '@/lib/auth-node';

const ALL_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export async function GET() {
  const settings = await getAppSettings();
  return NextResponse.json({
    anthropicApiKeySet: settings.anthropicApiKey.length > 0,
    planDays: JSON.parse(settings.planDays),
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const updates: Parameters<typeof updateAppSettings>[0] = {};

  // Update API key
  if (body.anthropicApiKey !== undefined) {
    if (!body.anthropicApiKey.startsWith('sk-')) {
      return NextResponse.json({ error: 'Invalid API key format' }, { status: 400 });
    }
    updates.anthropicApiKey = body.anthropicApiKey;
  }

  // Update plan days
  if (body.planDays !== undefined) {
    const days: string[] = body.planDays;
    if (!Array.isArray(days) || days.length === 0 || days.some(d => !ALL_DAYS.includes(d))) {
      return NextResponse.json({ error: 'Invalid planDays' }, { status: 400 });
    }
    updates.planDays = JSON.stringify(days);
  }

  // Change password
  if (body.newPassword !== undefined) {
    if (!body.currentPassword) {
      return NextResponse.json({ error: 'Current password required' }, { status: 400 });
    }
    if (body.newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });
    }
    const settings = await getAppSettings();
    if (!verifyPassword(body.currentPassword, settings.passwordHash)) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });
    }
    updates.passwordHash = hashPassword(body.newPassword);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });
  }

  await updateAppSettings(updates);
  return NextResponse.json({ ok: true });
}
