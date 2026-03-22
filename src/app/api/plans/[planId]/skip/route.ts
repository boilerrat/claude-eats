import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/plans/[planId]/skip  body: { day: string, skipped: boolean }
export async function POST(req: NextRequest, { params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params;
  const { day, skipped } = await req.json();

  if (!day || typeof skipped !== 'boolean') {
    return NextResponse.json({ error: 'day and skipped are required' }, { status: 400 });
  }

  const plan = await prisma.weeklyPlan.findUnique({ where: { id: planId } });
  if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

  const skippedDays: string[] = JSON.parse(plan.skippedDays);

  if (skipped) {
    // Add to skipped days and remove any existing meal for that day
    if (!skippedDays.includes(day)) skippedDays.push(day);
    await prisma.$transaction([
      prisma.weeklyPlan.update({ where: { id: planId }, data: { skippedDays: JSON.stringify(skippedDays) } }),
      prisma.weeklyPlanMeal.deleteMany({ where: { planId, dayOfWeek: day } }),
    ]);
    // Rebuild shopping list without this day's meal
    await rebuildShoppingList(planId);
  } else {
    // Remove from skipped days (meal slot will be empty until swapped/generated)
    const updated = skippedDays.filter(d => d !== day);
    await prisma.weeklyPlan.update({ where: { id: planId }, data: { skippedDays: JSON.stringify(updated) } });
  }

  return NextResponse.json({ ok: true });
}

async function rebuildShoppingList(planId: string) {
  const planMeals = await prisma.weeklyPlanMeal.findMany({
    where: { planId },
    include: { meal: true },
  });

  const map = new Map<string, { amount: number; unit: string; category: string; note?: string }>();
  for (const pm of planMeals) {
    const recipe = JSON.parse(pm.meal.recipe);
    for (const ing of recipe.ingredients) {
      const key = `${ing.item.toLowerCase()}__${ing.unit.toLowerCase()}`;
      const ex = map.get(key);
      if (ex) ex.amount += ing.amount;
      else map.set(key, { amount: ing.amount, unit: ing.unit, category: ing.category, note: ing.note });
    }
  }

  const items = Array.from(map.entries()).map(([key, val]) => ({
    item: key.split('__')[0],
    amount: String(val.amount),
    unit: val.unit,
    category: val.category,
    note: val.note ?? null,
    planId,
  }));

  await prisma.$transaction([
    prisma.shoppingListItem.deleteMany({ where: { planId } }),
    ...(items.length > 0 ? [prisma.shoppingListItem.createMany({ data: items })] : []),
  ]);
}
