'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatWeekRange } from '@/lib/dates';
import MealCard from '@/components/MealCard';
import GenerateButton from '@/components/GenerateButton';

type PlanMeal = {
  id: string;
  dayOfWeek: string;
  servings: number;
  locked: boolean;
  meal: {
    id: string;
    name: string;
    description: string | null;
  };
};

type DaySlot = {
  day: string;
  planMeal: PlanMeal | null;
  skipped: boolean;
};

type LikedMeal = {
  id: string;
  name: string;
  description: string | null;
};

interface Props {
  weekStart: Date;
  mealsByDay: DaySlot[];
  planId: string | null;
}

export default function WeeklyPlanView({ weekStart, mealsByDay, planId }: Props) {
  const [slots, setSlots] = useState<DaySlot[]>(mealsByDay);
  const [currentPlanId, setCurrentPlanId] = useState(planId);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Liked meal picker state
  const [pickerDay, setPickerDay] = useState<string | null>(null);
  const [likedMeals, setLikedMeals] = useState<LikedMeal[]>([]);
  const [pickerLoading, setPickerLoading] = useState(false);

  const hasPlan = slots.some(s => s.planMeal !== null || s.skipped);

  // Load liked meals when picker opens
  useEffect(() => {
    if (pickerDay === null) return;
    setPickerLoading(true);
    fetch('/api/meals/liked')
      .then(r => r.json())
      .then(data => setLikedMeals(data))
      .catch(() => setLikedMeals([]))
      .finally(() => setPickerLoading(false));
  }, [pickerDay]);

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
    if (!currentPlanId) return;
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch('/api/generate/swap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: currentPlanId, day }),
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

  const handleSkipToggle = useCallback(async (day: string) => {
    if (!currentPlanId) return;
    const slot = slots.find(s => s.day === day);
    const nowSkipped = !slot?.skipped;

    try {
      const res = await fetch(`/api/plans/${currentPlanId}/skip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day, skipped: nowSkipped }),
      });
      if (!res.ok) throw new Error('Failed to update day');

      setSlots(prev => prev.map(s =>
        s.day === day
          ? { ...s, skipped: nowSkipped, planMeal: nowSkipped ? null : s.planMeal }
          : s
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    }
  }, [currentPlanId, slots]);

  const handleLockToggle = useCallback((day: string, locked: boolean) => {
    setSlots(prev => prev.map(s =>
      s.day === day && s.planMeal
        ? { ...s, planMeal: { ...s.planMeal, locked } }
        : s
    ));
  }, []);

  async function handleAssign(mealId: string) {
    if (!pickerDay || !currentPlanId) return;
    setPickerDay(null);
    setGenerating(true);
    try {
      const res = await fetch(`/api/plans/${currentPlanId}/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ day: pickerDay, mealId }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? 'Assignment failed');
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
          {slots.map(({ day, planMeal, skipped }) => (
            <MealCard
              key={day}
              day={day}
              planMeal={planMeal}
              skipped={skipped}
              planId={currentPlanId}
              onSwap={() => handleSwap(day)}
              onPickSaved={() => setPickerDay(day)}
              onSkipToggle={() => handleSkipToggle(day)}
              onLockToggle={(locked) => handleLockToggle(day, locked)}
              swapping={generating}
            />
          ))}
        </div>
      )}

      {/* Liked meal picker modal */}
      {pickerDay !== null && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setPickerDay(null)}
        >
          <div
            className="w-full max-w-md bg-surface rounded-2xl border border-border shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="px-5 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="font-display italic text-text text-lg leading-tight">Saved Meals</h2>
                <p className="text-xs text-subtle mt-0.5">Pick a liked meal for {pickerDay}</p>
              </div>
              <button
                onClick={() => setPickerDay(null)}
                className="p-1.5 rounded-lg text-subtle hover:text-muted hover:bg-surface-2 transition-colors"
                aria-label="Close"
              >
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" className="w-4 h-4">
                  <path d="M3 3l10 10M13 3L3 13" />
                </svg>
              </button>
            </div>

            {/* Modal body */}
            <div className="max-h-[60vh] overflow-y-auto">
              {pickerLoading ? (
                <div className="flex items-center justify-center py-12">
                  <svg className="w-5 h-5 text-amber animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                </div>
              ) : likedMeals.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="font-display italic text-muted text-base mb-1">No liked meals yet</p>
                  <p className="text-subtle text-xs">Like meals from your plan to save them here.</p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {likedMeals.map(meal => (
                    <li key={meal.id}>
                      <button
                        onClick={() => handleAssign(meal.id)}
                        className="w-full text-left px-5 py-4 hover:bg-surface-2 transition-colors"
                      >
                        <p className="font-display text-text leading-snug">{meal.name}</p>
                        {meal.description && (
                          <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2">{meal.description}</p>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
