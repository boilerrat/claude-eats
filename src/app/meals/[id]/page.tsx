import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { RecipeJSON, PrepGuideJSON } from '@/lib/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MealPage({ params }: Props) {
  const { id } = await params;
  const meal = await prisma.meal.findUnique({ where: { id } });
  if (!meal) notFound();

  const recipe: RecipeJSON = JSON.parse(meal.recipe);
  const prep: PrepGuideJSON = JSON.parse(meal.prepGuide);

  return (
    <div className="max-w-2xl">
      <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 mb-6 inline-block">
        ← Back to this week
      </Link>

      <h1 className="text-2xl font-bold mb-2">{meal.name}</h1>
      {meal.description && (
        <p className="text-gray-400 mb-8">{meal.description}</p>
      )}

      {/* Recipe */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-orange-400">Ingredients</h2>
        <ul className="space-y-1.5">
          {recipe.ingredients.map((ing, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="text-gray-400 w-24 shrink-0">{ing.amount} {ing.unit}</span>
              <span>{ing.item}{ing.note ? ` (${ing.note})` : ''}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-orange-400">Method</h2>
        <ol className="space-y-3">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="text-orange-500 font-mono shrink-0">{i + 1}.</span>
              <span className="text-gray-200">{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* Sunday Prep */}
      <section className="rounded-xl border border-gray-800 bg-gray-900 p-5">
        <h2 className="text-lg font-semibold mb-4 text-orange-400">Sunday Prep</h2>
        <ul className="space-y-2 mb-4">
          {prep.steps.map((step, i) => (
            <li key={i} className="flex gap-2 text-sm">
              <span className="text-gray-500 shrink-0">•</span>
              <span>{step}</span>
            </li>
          ))}
        </ul>
        {prep.vacuumTips.length > 0 && (
          <>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
              Vacuum Sealer Tips
            </p>
            <ul className="space-y-2">
              {prep.vacuumTips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-300">
                  <span className="text-blue-400 shrink-0">VS</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}
