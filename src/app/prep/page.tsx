import { prisma } from '@/lib/db';
import { getCurrentWeekStart, formatWeekRange } from '@/lib/dates';
import type { PrepGuideJSON } from '@/lib/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default async function PrepPage() {
  const weekStart = getCurrentWeekStart();
  const plan = await prisma.weeklyPlan.findUnique({
    where: { weekStart },
    include: { meals: { include: { meal: true } } },
  });

  const sortedMeals = plan?.meals.sort(
    (a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek)
  ) ?? [];

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display italic text-3xl sm:text-4xl text-text leading-tight">
            Sunday Prep
          </h1>
          {plan && (
            <p className="text-muted text-sm mt-1.5 font-medium">{formatWeekRange(weekStart)}</p>
          )}
        </div>
        {plan && (
          <a
            href="/api/export/prep?format=docx"
            className="shrink-0 mt-1 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-sm text-muted hover:text-text hover:border-border-bright transition-all"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
              <path d="M8 2v8M5 7l3 3 3-3M3 13h10"/>
            </svg>
            Export
          </a>
        )}
      </div>

      {sortedMeals.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display italic text-xl text-muted mb-2">No prep guide yet</p>
          <p className="text-subtle text-sm">Generate a meal plan first.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {sortedMeals.map(({ meal, dayOfWeek }, index) => {
            const prep: PrepGuideJSON = JSON.parse(meal.prepGuide);
            return (
              <section
                key={meal.id}
                className="rounded-2xl border border-border bg-surface overflow-hidden"
              >
                {/* Card header */}
                <div className="px-5 py-4 border-b border-border flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-amber/15 text-amber text-xs font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-display italic text-sm text-muted leading-none mb-0.5">
                      {dayOfWeek}
                    </p>
                    <Link
                      href={`/meals/${meal.id}`}
                      className="font-display text-base text-text hover:text-amber transition-colors leading-snug"
                    >
                      {meal.name}
                    </Link>
                  </div>
                </div>

                <div className="px-5 py-4 space-y-4">
                  {/* Prep steps */}
                  <ul className="space-y-2">
                    {prep.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="text-amber/50 shrink-0 font-mono text-xs mt-0.5 w-4 text-right">
                          {i + 1}.
                        </span>
                        <span className="text-text leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Vacuum sealer tips */}
                  {prep.vacuumTips.length > 0 && (
                    <div className="pt-3 border-t border-border">
                      <p className="text-[11px] font-semibold uppercase tracking-widest text-subtle mb-2 flex items-center gap-1.5">
                        <span>⚡</span> Vacuum Sealer
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
            );
          })}
        </div>
      )}
    </div>
  );
}
