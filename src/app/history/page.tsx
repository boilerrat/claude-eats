import { prisma } from '@/lib/db';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

const DAY_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

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

  return (
    <div className="max-w-2xl">
      <h1 className="font-display italic text-3xl sm:text-4xl text-text leading-tight mb-8">
        History
      </h1>

      {plans.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-display italic text-xl text-muted mb-2">No past plans yet</p>
          <p className="text-subtle text-sm">Your meal history will appear here.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {plans.map(plan => {
            const sortedMeals = [...plan.meals].sort(
              (a, b) => DAY_ORDER.indexOf(a.dayOfWeek) - DAY_ORDER.indexOf(b.dayOfWeek)
            );
            const weekLabel = plan.weekStart.toLocaleDateString('en-CA', {
              month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC',
            });

            const likedCount = sortedMeals.filter(m => m.meal.ratings[0]?.rating === 'liked').length;
            const dislikedCount = sortedMeals.filter(m => m.meal.ratings[0]?.rating === 'disliked').length;

            return (
              <section key={plan.id}>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-muted">
                    Week of {weekLabel}
                  </h2>
                  {(likedCount > 0 || dislikedCount > 0) && (
                    <div className="flex items-center gap-3 text-xs text-subtle">
                      {likedCount > 0 && (
                        <span className="flex items-center gap-1 text-sage">
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M1 8.5a1.5 1.5 0 113 0v5a1.5 1.5 0 01-3 0v-5zM4 8.333v4.43a2 2 0 001.105 1.79l.05.025A4 4 0 006.943 15h4.416a2 2 0 001.962-1.608l1-5A2 2 0 0012.44 6H10V3a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L4.8 6.933A4 4 0 004 8.333z"/>
                          </svg>
                          {likedCount}
                        </span>
                      )}
                      {dislikedCount > 0 && (
                        <span className="flex items-center gap-1 text-rose">
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
                            <path d="M15 7.5a1.5 1.5 0 11-3 0v-5a1.5 1.5 0 013 0v5zM12 7.667v-4.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 009.057 1H4.64a2 2 0 00-1.962 1.608l-1 5A2 2 0 003.56 10H6v3a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866A4 4 0 0012 7.667z"/>
                          </svg>
                          {dislikedCount}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="rounded-2xl border border-border bg-surface overflow-hidden divide-y divide-border">
                  {sortedMeals.map(({ meal, dayOfWeek }) => {
                    const latestRating = meal.ratings[0]?.rating ?? null;
                    return (
                      <div key={meal.id} className="flex items-center gap-4 px-4 py-3 hover:bg-surface-2 transition-colors">
                        <span className="font-display italic text-amber text-xs w-20 shrink-0">
                          {dayOfWeek}
                        </span>
                        <Link
                          href={`/meals/${meal.id}`}
                          className="flex-1 text-sm text-text hover:text-amber transition-colors min-w-0 truncate"
                        >
                          {meal.name}
                        </Link>
                        {latestRating === 'liked' && (
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-sage shrink-0">
                            <path d="M1 8.5a1.5 1.5 0 113 0v5a1.5 1.5 0 01-3 0v-5zM4 8.333v4.43a2 2 0 001.105 1.79l.05.025A4 4 0 006.943 15h4.416a2 2 0 001.962-1.608l1-5A2 2 0 0012.44 6H10V3a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L4.8 6.933A4 4 0 004 8.333z"/>
                          </svg>
                        )}
                        {latestRating === 'disliked' && (
                          <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-rose shrink-0">
                            <path d="M15 7.5a1.5 1.5 0 11-3 0v-5a1.5 1.5 0 013 0v5zM12 7.667v-4.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 009.057 1H4.64a2 2 0 00-1.962 1.608l-1 5A2 2 0 003.56 10H6v3a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866A4 4 0 0012 7.667z"/>
                          </svg>
                        )}
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
