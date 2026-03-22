import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/meals/liked — returns meals whose most recent rating is 'liked'
export async function GET() {
  const allRatings = await prisma.mealRating.findMany({
    orderBy: { createdAt: 'asc' },
    include: { meal: true },
  });

  const latestRating = new Map<string, { rating: string; meal: typeof allRatings[0]['meal'] }>();
  for (const r of allRatings) {
    latestRating.set(r.mealId, { rating: r.rating, meal: r.meal });
  }

  const liked = [...latestRating.values()]
    .filter(r => r.rating === 'liked')
    .map(r => ({ id: r.meal.id, name: r.meal.name, description: r.meal.description }));

  return NextResponse.json(liked);
}
