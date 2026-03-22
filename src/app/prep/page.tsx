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
    include: {
      meals: {
        include: { meal: true },
      },
    },
  });

  const sortedMeals = plan?.meals.sort(
    (a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek)
  ) ?? [];

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Sunday Prep Guide</h1>
          {plan && (
            <p className="text-gray-400 text-sm mt-0.5">{formatWeekRange(weekStart)}</p>
          )}
        </div>
        {plan && (
          <a
            href="/api/export/prep?format=docx"
            className="px-3 py-1.5 rounded border border-gray-700 text-sm text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
          >
            Export DOCX
          </a>
        )}
      </div>

      {sortedMeals.length === 0 ? (
        <p className="text-gray-500">No plan yet — generate a meal plan first.</p>
      ) : (
        <div className="space-y-8">
          {sortedMeals.map(({ meal, dayOfWeek }, index) => {
            const prep: PrepGuideJSON = JSON.parse(meal.prepGuide);
            return (
              <section key={meal.id} className="rounded-xl border border-gray-800 bg-gray-900 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-1">
                      {index + 1}. {dayOfWeek}
                    </p>
                    <Link
                      href={`/meals/${meal.id}`}
                      className="font-semibold text-white hover:text-orange-300 transition-colors"
                    >
                      {meal.name}
                    </Link>
                  </div>
                </div>

                <ul className="space-y-2 mb-4">
                  {prep.steps.map((step, i) => (
                    <li key={i} className="flex gap-2 text-sm">
                      <span className="text-gray-500 shrink-0">•</span>
                      <span className="text-gray-200">{step}</span>
                    </li>
                  ))}
                </ul>

                {prep.vacuumTips.length > 0 && (
                  <>
                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                      Vacuum Sealer
                    </p>
                    <ul className="space-y-2">
                      {prep.vacuumTips.map((tip, i) => (
                        <li key={i} className="flex gap-2 text-sm text-gray-300">
                          <span className="text-blue-400 font-mono shrink-0">VS</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
