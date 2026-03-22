import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/plans/[planId]/assign  body: { day: string, mealId: string }
// Assigns a previously liked meal to a specific day (replaces any existing meal)
export async function POST(req: NextRequest, { params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params;
  const { day, mealId } = await req.json();

  if (!day || !mealId) {
    return NextResponse.json({ error: 'day and mealId are required' }, { status: 400 });
  }

  const [plan, meal] = await Promise.all([
    prisma.weeklyPlan.findUnique({ where: { id: planId } }),
    prisma.meal.findUnique({ where: { id: mealId } }),
  ]);
  if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
  if (!meal) return NextResponse.json({ error: 'Meal not found' }, { status: 404 });

  await prisma.$transaction(async tx => {
    // Remove day from skipped list if it was skipped
    const skippedDays: string[] = JSON.parse(plan.skippedDays);
    const updated = skippedDays.filter(d => d !== day);
    if (updated.length !== skippedDays.length) {
      await tx.weeklyPlan.update({ where: { id: planId }, data: { skippedDays: JSON.stringify(updated) } });
    }

    // Upsert the plan meal for this day
    await tx.weeklyPlanMeal.deleteMany({ where: { planId, dayOfWeek: day } });
    await tx.weeklyPlanMeal.create({
      data: { planId, mealId, dayOfWeek: day, servings: 6, locked: false },
    });

    // Rebuild shopping list
    const planMeals = await tx.weeklyPlanMeal.findMany({ where: { planId }, include: { meal: true } });
    await tx.shoppingListItem.deleteMany({ where: { planId } });

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
    if (items.length > 0) await tx.shoppingListItem.createMany({ data: items });
  });

  return NextResponse.json({ ok: true });
}
