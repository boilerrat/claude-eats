'use client';

/*
 * Palette: amber #E5A23C · sage #5E9B5E · rose #C85A4C
 * Fonts: Playfair Display (display) · DM Sans (body)
 */

import { useState } from 'react';
import Link from 'next/link';

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

interface Props {
  day: string;
  planMeal: PlanMeal | null;
  onSwap: () => void;
  swapping: boolean;
}

export default function MealCard({ day, planMeal, onSwap, swapping }: Props) {
  const [rating, setRating] = useState<'liked' | 'disliked' | null>(null);
  const [ratingLoading, setRatingLoading] = useState(false);

  async function handleRate(value: 'liked' | 'disliked') {
    if (!planMeal || ratingLoading) return;
    setRatingLoading(true);
    try {
      await fetch(`/api/meals/${planMeal.meal.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: value }),
      });
      setRating(value);
    } finally {
      setRatingLoading(false);
    }
  }

  return (
    <div
      className={`group relative flex flex-col rounded-2xl border bg-surface overflow-hidden transition-all duration-200 ${
        planMeal
          ? 'border-border hover:border-border-bright hover:-translate-y-0.5 hover:shadow-xl hover:shadow-black/40'
          : 'border-border/30 opacity-50'
      }`}
    >
      {/* Day label */}
      <div className="px-5 pt-5 pb-0 flex items-center justify-between">
        <span className="font-display italic text-amber text-sm tracking-wide">
          {day}
        </span>
        {planMeal && (
          <span className="text-[11px] font-medium text-subtle tabular-nums">
            {planMeal.servings} servings
          </span>
        )}
      </div>

      {planMeal ? (
        <>
          {/* Meal info */}
          <div className="px-5 pt-3 pb-4 flex-1">
            <Link
              href={`/meals/${planMeal.meal.id}`}
              className="block font-display text-[1.1rem] leading-snug text-text hover:text-amber transition-colors"
            >
              {planMeal.meal.name}
            </Link>
            {planMeal.meal.description && (
              <p className="mt-2 text-xs text-muted leading-relaxed line-clamp-2">
                {planMeal.meal.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="px-4 py-3 border-t border-border flex items-center gap-1">
            {/* Like */}
            <button
              onClick={() => handleRate('liked')}
              disabled={ratingLoading}
              aria-label="Like this meal"
              className={`p-2 rounded-lg transition-all duration-150 ${
                rating === 'liked'
                  ? 'text-sage bg-sage/15'
                  : 'text-subtle hover:text-sage hover:bg-sage/10'
              }`}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
              </svg>
            </button>

            {/* Dislike */}
            <button
              onClick={() => handleRate('disliked')}
              disabled={ratingLoading}
              aria-label="Dislike this meal"
              className={`p-2 rounded-lg transition-all duration-150 ${
                rating === 'disliked'
                  ? 'text-rose bg-rose/15'
                  : 'text-subtle hover:text-rose hover:bg-rose/10'
              }`}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
              </svg>
            </button>

            <div className="flex-1" />

            {/* Swap */}
            <button
              onClick={onSwap}
              disabled={swapping}
              aria-label="Swap this meal"
              title="Swap meal"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-subtle hover:text-muted hover:bg-surface-2 transition-all duration-150 disabled:opacity-30 text-xs font-medium"
            >
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                <path d="M4 7h12M4 7l3-3M4 7l3 3M16 13H4M16 13l-3 3M16 13l-3-3" />
              </svg>
              Swap
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center py-10">
          <p className="font-display italic text-subtle text-sm">empty</p>
        </div>
      )}
    </div>
  );
}
