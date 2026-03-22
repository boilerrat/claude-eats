import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentWeekStart } from '@/lib/dates';
import { generateMeals } from '@/lib/generateMeals';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TARGET_SERVINGS = 6; // 4 family + 2 extra

export async function POST() {
  try {
    const weekStart = getCurrentWeekStart();

    // Load existing plan to find locked meals and skipped days
    const existing = await prisma.weeklyPlan.findUnique({
      where: { weekStart },
      include: { meals: { include: { meal: true } } },
    });

    const skippedDays: string[] = existing ? JSON.parse(existing.skippedDays) : [];
    const lockedMeals = existing?.meals.filter(m => m.locked) ?? [];
    const lockedDays = new Set(lockedMeals.map(m => m.dayOfWeek));

    // Days that need new meals generated
    const daysToGenerate = DAYS.filter(d => !lockedDays.has(d) && !skippedDays.includes(d));
    const count = daysToGenerate.length;

    // Gather preferences and ratings history
    const [preferences, allRatings] = await Promise.all([
      prisma.ingredientPreference.findMany(),
      prisma.mealRating.findMany({ include: { meal: true } }),
    ]);

    const blockedIngredients = preferences.filter(p => p.type === 'blocked').map(p => p.ingredient);
    const preferredIngredients = preferences.filter(p => p.type === 'preferred').map(p => p.ingredient);

    const latestRatingByMeal = new Map<string, string>();
    for (const r of allRatings.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())) {
      latestRatingByMeal.set(r.mealId, r.rating);
    }
    const likedMealNames: string[] = [];
    const dislikedMealNames: string[] = [];
    for (const r of allRatings) {
      const latest = latestRatingByMeal.get(r.mealId);
      if (latest === 'liked') likedMealNames.push(r.meal.name);
      else if (latest === 'disliked') dislikedMealNames.push(r.meal.name);
    }

    // Generate only for unlocked, non-skipped days
    const generated = count > 0
      ? await generateMeals({
          count,
          blockedIngredients,
          preferredIngredients,
          likedMealNames: [...new Set(likedMealNames)],
          dislikedMealNames: [...new Set(dislikedMealNames)],
          targetServings: TARGET_SERVINGS,
        })
      : [];

    await prisma.$transaction(async tx => {
      // Delete old plan (cascade deletes planMeals and shoppingItems)
      if (existing) {
        await tx.weeklyPlan.delete({ where: { id: existing.id } });
      }

      // Save new meals to Meal table
      const savedNewMeals = await Promise.all(
        generated.map(m =>
          tx.meal.create({
            data: {
              name: m.name,
              description: m.description,
              recipe: JSON.stringify(m.recipe),
              prepGuide: JSON.stringify(m.prepGuide),
            },
          })
        )
      );

      // Create new plan (preserve skippedDays)
      const plan = await tx.weeklyPlan.create({
        data: { weekStart, skippedDays: JSON.stringify(skippedDays) },
      });

      // Assign meals to days
      let newMealIndex = 0;
      const planMealData: Array<{ planId: string; mealId: string; dayOfWeek: string; servings: number; locked: boolean }> = [];
      const mealsForShopping: Array<{ recipe: { ingredients: Array<{ item: string; amount: number; unit: string; category: string; note?: string }> }; servings: number }> = [];

      for (const day of DAYS) {
        if (skippedDays.includes(day)) continue;

        if (lockedDays.has(day)) {
          const locked = lockedMeals.find(m => m.dayOfWeek === day)!;
          planMealData.push({ planId: plan.id, mealId: locked.mealId, dayOfWeek: day, servings: TARGET_SERVINGS, locked: true });
          mealsForShopping.push({ recipe: JSON.parse(locked.meal.recipe), servings: TARGET_SERVINGS });
        } else {
          const meal = savedNewMeals[newMealIndex++];
          planMealData.push({ planId: plan.id, mealId: meal.id, dayOfWeek: day, servings: TARGET_SERVINGS, locked: false });
          mealsForShopping.push({ recipe: generated[newMealIndex - 1].recipe, servings: TARGET_SERVINGS });
        }
      }

      await tx.weeklyPlanMeal.createMany({ data: planMealData });

      // Rebuild shopping list from all active meals
      const shoppingItems = aggregateShoppingList(mealsForShopping);
      if (shoppingItems.length > 0) {
        await tx.shoppingListItem.createMany({
          data: shoppingItems.map(item => ({ ...item, planId: plan.id })),
        });
      }
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Generation error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Generation failed' },
      { status: 500 }
    );
  }
}

interface ShoppingInput {
  recipe: { ingredients: Array<{ item: string; amount: number; unit: string; category: string; note?: string }> };
  servings: number;
}

function aggregateShoppingList(meals: ShoppingInput[]) {
  const map = new Map<string, { amount: number; unit: string; category: string; note?: string }>();

  for (const meal of meals) {
    for (const ing of meal.recipe.ingredients) {
      const key = `${ing.item.toLowerCase()}__${ing.unit.toLowerCase()}`;
      const existing = map.get(key);
      if (existing) {
        existing.amount += ing.amount;
      } else {
        map.set(key, { amount: ing.amount, unit: ing.unit, category: ing.category, note: ing.note });
      }
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
  let n = isSmallVolume ? Math.round(amount * 4) / 4 : amount;
  if (Number.isInteger(n)) return String(n);
  const str = n.toFixed(1);
  return str.endsWith('.0') ? str.slice(0, -2) : str;
}
