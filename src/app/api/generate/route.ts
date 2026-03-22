import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getCurrentWeekStart } from '@/lib/dates';
import { generateMeals } from '@/lib/generateMeals';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const MEALS_TO_GENERATE = 7;
const TARGET_SERVINGS = 6; // 4 family + 2 extra

export async function POST() {
  try {
    // Gather preferences and history
    const [preferences, allRatings] = await Promise.all([
      prisma.ingredientPreference.findMany(),
      prisma.mealRating.findMany({ include: { meal: true } }),
    ]);

    const blockedIngredients = preferences
      .filter(p => p.type === 'blocked')
      .map(p => p.ingredient);
    const preferredIngredients = preferences
      .filter(p => p.type === 'preferred')
      .map(p => p.ingredient);

    // Determine liked/disliked meals by most recent rating
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

    // Generate meals via Claude
    const generated = await generateMeals({
      count: MEALS_TO_GENERATE,
      blockedIngredients,
      preferredIngredients,
      likedMealNames: [...new Set(likedMealNames)],
      dislikedMealNames: [...new Set(dislikedMealNames)],
      targetServings: TARGET_SERVINGS,
    });

    // Pick first 5 for the week; remaining 2 can be used for swaps later
    const weekMeals = generated.slice(0, 5);
    const weekStart = getCurrentWeekStart();

    // Upsert the WeeklyPlan (replace if it already exists for this week)
    await prisma.$transaction(async tx => {
      // Delete existing plan for this week if any
      const existing = await tx.weeklyPlan.findUnique({ where: { weekStart } });
      if (existing) {
        await tx.weeklyPlanMeal.deleteMany({ where: { planId: existing.id } });
        await tx.shoppingListItem.deleteMany({ where: { planId: existing.id } });
        await tx.weeklyPlan.delete({ where: { id: existing.id } });
      }

      // Save all 7 meals to the Meal table (even the 2 reserve ones)
      const savedMeals = await Promise.all(
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

      // Create the plan
      const plan = await tx.weeklyPlan.create({ data: { weekStart } });

      // Assign first 5 meals to Mon–Fri
      await tx.weeklyPlanMeal.createMany({
        data: weekMeals.map((_, i) => ({
          planId: plan.id,
          mealId: savedMeals[i].id,
          dayOfWeek: DAYS[i],
          servings: TARGET_SERVINGS,
        })),
      });

      // Aggregate shopping list
      const shoppingItems = aggregateShoppingList(weekMeals.map(m => ({
        recipe: m.recipe,
        servings: TARGET_SERVINGS,
        planId: plan.id,
      })));

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
  planId: string;
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
        map.set(key, {
          amount: ing.amount,
          unit: ing.unit,
          category: ing.category,
          note: ing.note,
        });
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
