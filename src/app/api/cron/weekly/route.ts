/**
 * GET /api/cron/weekly
 *
 * Called by an external cron every Saturday (e.g. Dokploy cron, cron-job.org,
 * or a system crontab). Generates the plan for the coming week.
 *
 * Protect with a shared secret: set CRON_SECRET in your environment and pass
 * it as the Authorization header: "Bearer <CRON_SECRET>"
 */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = req.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  // Delegate to the generate route (pass internal secret to bypass session middleware)
  const base = req.nextUrl.origin;
  const res = await fetch(`${base}/api/generate`, {
    method: 'POST',
    headers: { 'x-internal-secret': process.env.APP_SECRET ?? '' },
  });
  const body = await res.json();

  if (!res.ok) {
    return NextResponse.json({ error: body.error ?? 'Generation failed' }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: 'Weekly plan generated' });
}
