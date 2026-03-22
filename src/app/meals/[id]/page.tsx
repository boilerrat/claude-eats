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
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-subtle hover:text-muted mb-7 transition-colors"
      >
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
          <path d="M10 4L6 8l4 4"/>
        </svg>
        This week
      </Link>

      {/* Title */}
      <h1 className="font-display italic text-3xl sm:text-4xl text-text leading-tight mb-2">
        {meal.name}
      </h1>
      {meal.description && (
        <p className="text-muted mb-8 leading-relaxed">{meal.description}</p>
      )}

      {/* Ingredients */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-amber mb-4 flex items-center gap-2">
          <span className="w-5 h-px bg-amber/40 hidden sm:block" />
          Ingredients
        </h2>
        <div className="rounded-2xl border border-border bg-surface overflow-hidden">
          {recipe.ingredients.map((ing, i) => (
            <div
              key={i}
              className={`flex items-baseline gap-4 px-5 py-3 text-sm ${
                i < recipe.ingredients.length - 1 ? 'border-b border-border' : ''
              }`}
            >
              <span className="text-muted w-28 shrink-0 tabular-nums text-right">
                {ing.amount} {ing.unit}
              </span>
              <span className="text-text">
                {ing.item}
                {ing.note && <span className="text-subtle"> ({ing.note})</span>}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Method */}
      <section className="mb-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-amber mb-4 flex items-center gap-2">
          <span className="w-5 h-px bg-amber/40 hidden sm:block" />
          Method
        </h2>
        <ol className="space-y-4">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="font-display italic text-amber text-lg leading-none shrink-0 w-6 text-right">
                {i + 1}
              </span>
              <p className="text-text text-sm leading-relaxed pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Sunday Prep */}
      <section className="rounded-2xl border border-border bg-surface overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-amber">
            Sunday Prep
          </h2>
        </div>
        <div className="px-5 py-4 space-y-4">
          <ul className="space-y-3">
            {prep.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="text-amber/50 shrink-0 font-mono text-xs mt-0.5 w-4 text-right">{i + 1}.</span>
                <span className="text-text leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
          {prep.vacuumTips.length > 0 && (
            <div className="pt-4 border-t border-border">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-subtle mb-3 flex items-center gap-1.5">
                <span>⚡</span> Vacuum Sealer Tips
              </p>
              <ul className="space-y-2">
                {prep.vacuumTips.map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="text-xs font-bold text-amber/60 shrink-0 font-mono mt-0.5">VS</span>
                    <span className="text-muted leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
