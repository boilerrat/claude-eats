import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { generateMeals } from '@/lib/generateMeals';
import { getAppSettings } from '@/lib/appSettings';

const TARGET_SERVINGS = 6;

export async function POST(req: NextRequest) {
  const { planId, day } = await req.json();

  if (!planId || !day) {
    return NextResponse.json({ error: 'planId and day are required' }, { status: 400 });
  }

  const plan = await prisma.weeklyPlan.findUnique({
    where: { id: planId },
    include: { meals: { include: { meal: true } } },
  });
  if (!plan) return NextResponse.json({ error: 'Plan not found' }, { status: 404 });

  const [preferences, allRatings, settings] = await Promise.all([
    prisma.ingredientPreference.findMany(),
    prisma.mealRating.findMany({ include: { meal: true } }),
    getAppSettings(),
  ]);

  if (!settings.anthropicApiKey) {
    return NextResponse.json({ error: 'No API key configured — visit Settings to add one' }, { status: 503 });
  }

  const blockedIngredients = preferences.filter(p => p.type === 'blocked').map(p => p.ingredient);
  const preferredIngredients = preferences.filter(p => p.type === 'preferred').map(p => p.ingredient);
  const existingMealNames = plan.meals.map(m => m.meal.name);

  const latestRatingByMeal = new Map<string, string>();
  for (const r of allRatings.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())) {
    latestRatingByMeal.set(r.mealId, r.rating);
  }
  const dislikedMealNames = allRatings
    .filter(r => latestRatingByMeal.get(r.mealId) === 'disliked')
    .map(r => r.meal.name);

  // Generate 1 replacement meal that differs from current week
  const [generated] = await generateMeals({
    count: 1,
    blockedIngredients,
    preferredIngredients,
    likedMealNames: [],
    dislikedMealNames: [...new Set([...dislikedMealNames, ...existingMealNames])],
    targetServings: TARGET_SERVINGS,
    apiKey: settings.anthropicApiKey,
  });

  await prisma.$transaction(async tx => {
    // Save new meal
    const meal = await tx.meal.create({
      data: {
        name: generated.name,
        description: generated.description,
        recipe: JSON.stringify(generated.recipe),
        prepGuide: JSON.stringify(generated.prepGuide),
      },
    });

    // Replace the plan meal for this day
    await tx.weeklyPlanMeal.deleteMany({ where: { planId, dayOfWeek: day } });
    await tx.weeklyPlanMeal.create({
      data: { planId, mealId: meal.id, dayOfWeek: day, servings: TARGET_SERVINGS },
    });

    // Rebuild shopping list for the plan
    const updatedPlanMeals = await tx.weeklyPlanMeal.findMany({
      where: { planId },
      include: { meal: true },
    });
    await tx.shoppingListItem.deleteMany({ where: { planId } });

    const items = aggregateShoppingList(
      updatedPlanMeals.map(pm => ({ recipe: JSON.parse(pm.meal.recipe) }))
    );
    if (items.length > 0) {
      await tx.shoppingListItem.createMany({
        data: items.map(i => ({ ...i, planId })),
      });
    }
  });

  return NextResponse.json({ ok: true });
}

function aggregateShoppingList(meals: { recipe: { ingredients: Array<{ item: string; amount: number; unit: string; category: string; note?: string }> } }[]) {
  const map = new Map<string, { amount: number; unit: string; category: string; note?: string }>();
  for (const meal of meals) {
    for (const ing of meal.recipe.ingredients) {
      const key = `${ing.item.toLowerCase()}__${ing.unit.toLowerCase()}`;
      const existing = map.get(key);
      if (existing) existing.amount += ing.amount;
      else map.set(key, { amount: ing.amount, unit: ing.unit, category: ing.category, note: ing.note });
    }
  }
  return Array.from(map.entries()).map(([key, val]) => ({
    item: key.split('__')[0],
    amount: formatAmount(val.amount, val.unit),
    unit: val.unit,
    category: val.category,
    note: val.note ?? null,
  }));
}

function formatAmount(amount: number, unit: string): string {
  const isSmallVolume = ['tsp', 'tbsp'].includes(unit.toLowerCase());
  const n = isSmallVolume ? Math.round(amount * 4) / 4 : amount;
  if (Number.isInteger(n)) return String(n);
  const str = n.toFixed(1);
  return str.endsWith('.0') ? str.slice(0, -2) : str;
}
