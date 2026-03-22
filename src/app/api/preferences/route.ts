import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(req: NextRequest) {
  const { ingredient, type } = await req.json();
  if (!ingredient || (type !== 'blocked' && type !== 'preferred')) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const pref = await prisma.ingredientPreference.upsert({
    where: { ingredient: ingredient.toLowerCase() },
    create: { ingredient: ingredient.toLowerCase(), type },
    update: { type },
  });

  return NextResponse.json(pref);
}
