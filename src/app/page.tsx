import { prisma } from '@/lib/db';
import { getCurrentWeekStart } from '@/lib/dates';
import WeeklyPlanView from '@/components/WeeklyPlanView';

export const dynamic = 'force-dynamic';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

export default async function HomePage() {
  const weekStart = getCurrentWeekStart();

  const plan = await prisma.weeklyPlan.findUnique({
    where: { weekStart },
    include: {
      meals: {
        include: { meal: true },
        orderBy: { dayOfWeek: 'asc' },
      },
    },
  });

  // Cast to any to work around stale TS language server cache after prisma generate
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const planAny = plan as any;
  const skippedDays: string[] = planAny?.skippedDays ? JSON.parse(planAny.skippedDays) : [];

  const mealsByDay = DAYS.map(day => {
    const pm = plan?.meals.find(m => m.dayOfWeek === day);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pmAny = pm as any;
    return {
      day,
      planMeal: pm
        ? {
            id: pm.id,
            dayOfWeek: pm.dayOfWeek,
            servings: pm.servings,
            locked: pmAny.locked as boolean,
            meal: {
              id: pm.meal.id,
              name: pm.meal.name,
              description: pm.meal.description,
            },
          }
        : null,
      skipped: skippedDays.includes(day),
    };
  });

  return <WeeklyPlanView weekStart={weekStart} mealsByDay={mealsByDay} planId={plan?.id ?? null} />;
}
