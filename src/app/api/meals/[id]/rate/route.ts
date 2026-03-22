import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { rating } = body;

  if (rating !== 'liked' && rating !== 'disliked') {
    return NextResponse.json({ error: 'rating must be liked or disliked' }, { status: 400 });
  }

  const meal = await prisma.meal.findUnique({ where: { id } });
  if (!meal) return NextResponse.json({ error: 'Meal not found' }, { status: 404 });

  await prisma.mealRating.create({ data: { mealId: id, rating } });

  return NextResponse.json({ ok: true });
}
