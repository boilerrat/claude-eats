'use client';

import { useState } from 'react';
import { formatWeekRange } from '@/lib/dates';
import MealCard from '@/components/MealCard';
import GenerateButton from '@/components/GenerateButton';

type PlanMeal = {
  id: string;
  dayOfWeek: string;
  servings: number;
  meal: {
    id: string;
    name: string;
    description: string | null;
  };
};

type DaySlot = {
  day: string;
  planMeal: PlanMeal | null;
};

interface Props {
  weekStart: Date;
  mealsByDay: DaySlot[];
  planId: string | null;
}

export default function WeeklyPlanView({ weekStart, mealsByDay, planId }: Props) {
  const [slots, setSlots] = useState<DaySlot[]>(mealsByDay);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasPlan = slots.some(s => s.planMeal !== null);

  async function handleGenerate() {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/generate', { method: 'POST' });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Generation failed');
      }
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setGenerating(false);
    }
  }

  async function handleSwap(day: string) {
    if (!planId) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/generate/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, day }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Swap failed');
      }
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setGenerating(false);
    }
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl italic text-text leading-tight">
            This Week
          </h1>
          <p className="text-muted text-sm mt-1.5 font-medium">
            {formatWeekRange(weekStart)}
          </p>
        </div>
        <div className="shrink-0 mt-1">
          <GenerateButton
            hasPlan={hasPlan}
            loading={generating}
            onClick={handleGenerate}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 px-4 py-3 rounded-xl bg-rose/10 border border-rose/30 text-rose text-sm flex items-start gap-2">
          <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* No plan state */}
      {!hasPlan ? (
        <div className="flex flex-col items-center justify-center py-28 text-center">
          {/* Decorative plate SVG */}
          <svg viewBox="0 0 80 80" fill="none" className="w-20 h-20 mb-6 text-border-bright" aria-hidden>
            <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="2"/>
            <circle cx="40" cy="40" r="26" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 3"/>
            <path d="M30 40c0-5.523 4.477-10 10-10s10 4.477 10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="40" cy="40" r="3" fill="currentColor"/>
          </svg>
          <p className="font-display italic text-xl text-muted mb-2">
            No meals planned yet
          </p>
          <p className="text-subtle text-sm max-w-xs">
            Hit &ldquo;Generate Week&rdquo; and Claude will plan 5 dinners for your family.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map(({ day, planMeal }) => (
            <MealCard
              key={day}
              day={day}
              planMeal={planMeal}
              onSwap={() => handleSwap(day)}
              swapping={generating}
            />
          ))}
        </div>
      )}
    </div>
  );
}
