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

  // Order meals by day
  const mealsByDay = DAYS.map(day => ({
    day,
    planMeal: plan?.meals.find(m => m.dayOfWeek === day) ?? null,
  }));

  return <WeeklyPlanView weekStart={weekStart} mealsByDay={mealsByDay} planId={plan?.id ?? null} />;
}
