import { prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function HistoryPage() {
  const plans = await prisma.weeklyPlan.findMany({
    orderBy: { weekStart: 'desc' },
    include: {
      meals: {
        include: {
          meal: {
            include: { ratings: { orderBy: { createdAt: 'desc' }, take: 1 } },
          },
        },
        orderBy: { dayOfWeek: 'asc' },
      },
    },
  });

  const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">History</h1>

      {plans.length === 0 ? (
        <p className="text-gray-500">No past plans yet.</p>
      ) : (
        <div className="space-y-10">
          {plans.map(plan => {
            const sortedMeals = [...plan.meals].sort(
              (a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek)
            );
            const weekLabel = plan.weekStart.toLocaleDateString('en-CA', {
              month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
            });

            return (
              <section key={plan.id}>
                <h2 className="text-sm font-semibold text-gray-400 mb-3">Week of {weekLabel}</h2>
                <div className="rounded-xl border border-gray-800 divide-y divide-gray-800">
                  {sortedMeals.map(({ meal, dayOfWeek }) => {
                    const latestRating = meal.ratings[0]?.rating ?? null;
                    return (
                      <div key={meal.id} className="flex items-center gap-4 px-4 py-3">
                        <span className="text-xs text-orange-400 font-semibold w-24 shrink-0">
                          {dayOfWeek}
                        </span>
                        <Link
                          href={`/meals/${meal.id}`}
                          className="flex-1 text-sm text-white hover:text-orange-300 transition-colors"
                        >
                          {meal.name}
                        </Link>
                        {latestRating === 'liked' && <span className="text-lg">👍</span>}
                        {latestRating === 'disliked' && <span className="text-lg">👎</span>}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
