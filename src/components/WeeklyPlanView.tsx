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
      // Reload the page to pick up the new plan from the server
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">This Week</h1>
          <p className="text-gray-400 text-sm mt-0.5">{formatWeekRange(weekStart)}</p>
        </div>
        <GenerateButton
          hasPlan={hasPlan}
          loading={generating}
          onClick={handleGenerate}
        />
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 rounded bg-red-950 border border-red-800 text-red-300 text-sm">
          {error}
        </div>
      )}

      {!hasPlan ? (
        <div className="text-center py-24 text-gray-500">
          <p className="text-lg mb-2">No plan for this week yet.</p>
          <p className="text-sm">Press &ldquo;Generate Week&rdquo; to create one.</p>
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
