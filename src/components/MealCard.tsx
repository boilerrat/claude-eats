'use client';

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
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
          {day}
        </span>
        {planMeal && (
          <span className="text-xs text-gray-500">{planMeal.servings} servings</span>
        )}
      </div>

      {planMeal ? (
        <>
          <div className="flex-1">
            <Link
              href={`/meals/${planMeal.meal.id}`}
              className="font-semibold text-white hover:text-orange-300 transition-colors leading-snug"
            >
              {planMeal.meal.name}
            </Link>
            {planMeal.meal.description && (
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                {planMeal.meal.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-gray-800">
            <button
              onClick={() => handleRate('liked')}
              disabled={ratingLoading}
              className={`text-lg transition-transform hover:scale-110 ${rating === 'liked' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
              title="Like this meal"
            >
              👍
            </button>
            <button
              onClick={() => handleRate('disliked')}
              disabled={ratingLoading}
              className={`text-lg transition-transform hover:scale-110 ${rating === 'disliked' ? 'opacity-100' : 'opacity-40 hover:opacity-100'}`}
              title="Dislike this meal"
            >
              👎
            </button>
            <div className="flex-1" />
            <button
              onClick={onSwap}
              disabled={swapping}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors disabled:opacity-40"
            >
              Swap ↺
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center py-6 text-gray-600 text-sm">
          Empty
        </div>
      )}
    </div>
  );
}
