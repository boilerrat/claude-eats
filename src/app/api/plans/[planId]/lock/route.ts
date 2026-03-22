import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/plans/[planId]/lock  body: { day: string, locked: boolean }
export async function POST(req: NextRequest, { params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params;
  const { day, locked } = await req.json();

  if (!day || typeof locked !== 'boolean') {
    return NextResponse.json({ error: 'day and locked are required' }, { status: 400 });
  }

  const planMeal = await prisma.weeklyPlanMeal.findFirst({ where: { planId, dayOfWeek: day } });
  if (!planMeal) {
    return NextResponse.json({ error: 'Day not found in plan' }, { status: 404 });
  }

  await prisma.weeklyPlanMeal.update({ where: { id: planMeal.id }, data: { locked } });

  return NextResponse.json({ ok: true });
}
