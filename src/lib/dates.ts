/**
 * Returns the Monday 00:00:00 UTC of the current week.
 * Used as the unique key for WeeklyPlan records.
 */
export function getCurrentWeekStart(): Date {
  const now = new Date();
  const day = now.getUTCDay(); // 0 = Sunday, 1 = Monday …
  const diff = day === 0 ? -6 : 1 - day; // roll back to Monday
  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diff);
  monday.setUTCHours(0, 0, 0, 0);
  return monday;
}

export function formatWeekRange(weekStart: Date): string {
  const end = new Date(weekStart);
  end.setUTCDate(weekStart.getUTCDate() + 4); // Friday
  return `${weekStart.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', timeZone: 'UTC' })} – ${end.toLocaleDateString('en-CA', { month: 'short', day: 'numeric', timeZone: 'UTC' })}`;
}
