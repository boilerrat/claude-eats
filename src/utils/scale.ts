/**
 * Scaling and amount formatting utilities.
 *
 * The core contract: given a recipe written for N servings, produce scaled
 * ingredient amounts for M servings. Formatting turns numeric amounts back
 * into readable strings for document output.
 */

import type { Ingredient, ScaleType } from '../types';

// ── Scale factor ──────────────────────────────────────────────────────────────

/**
 * Returns the multiplier to apply to ingredient amounts when scaling from
 * baseServings to targetServings.
 */
export function scaleFactor(baseServings: number, targetServings: number): number {
  return targetServings / baseServings;
}

// ── Per-type scale coefficients ───────────────────────────────────────────────

/**
 * The effective coefficient applied to the raw multiplier for each ScaleType.
 *
 * 'seasoning' uses 0.75 because flavour compounds are non-linear — a 1.5x
 * batch doesn't need 1.5x cumin. This is a practical heuristic; adjust if
 * you find seasoning too light or heavy in practice.
 */
const SCALE_COEFFICIENTS: Record<ScaleType, number> = {
  linear:    1.0,
  seasoning: 0.75,
  fixed:     0.0,   // amount stays constant regardless of multiplier
};

// ── Scale a single ingredient ─────────────────────────────────────────────────

/**
 * Returns a new Ingredient with amount scaled from baseServings to targetServings.
 */
export function scaleIngredient(
  ingredient: Ingredient,
  baseServings: number,
  targetServings: number,
): Ingredient {
  if (baseServings === targetServings) return ingredient;

  const multiplier = scaleFactor(baseServings, targetServings);
  const scaleType: ScaleType = ingredient.scaleType ?? 'linear';
  const coeff = SCALE_COEFFICIENTS[scaleType];

  // For 'fixed': amount stays as-is
  // For others: apply (multiplier - 1) * coeff as the growth factor
  const scaledAmount =
    scaleType === 'fixed'
      ? ingredient.amount
      : ingredient.amount * (1 + (multiplier - 1) * coeff);

  return { ...ingredient, amount: scaledAmount };
}

/**
 * Scales all ingredients in a list.
 */
export function scaleIngredients(
  ingredients: Ingredient[],
  baseServings: number,
  targetServings: number,
): Ingredient[] {
  return ingredients.map(i => scaleIngredient(i, baseServings, targetServings));
}

// ── Amount formatting ─────────────────────────────────────────────────────────

/**
 * Formats a numeric amount into a clean display string.
 *
 * Rules:
 * - Whole numbers: no decimal (3, not 3.0)
 * - Halves: one decimal (1.5, 2.5)
 * - Small tsp/tbsp amounts: round to nearest 0.25 for cookability
 * - Everything else: one decimal place, trailing zero stripped
 */
export function formatAmount(amount: number, unit: string): string {
  const isSmallVolume = ['tsp', 'tbsp'].includes(unit.toLowerCase());

  let n = amount;

  if (isSmallVolume) {
    // Round to nearest quarter teaspoon / tablespoon
    n = Math.round(amount * 4) / 4;
  }

  // Strip unnecessary precision
  if (Number.isInteger(n)) return String(n);

  // One decimal, strip trailing zero
  const str = n.toFixed(1);
  return str.endsWith('.0') ? str.slice(0, -2) : str;
}

/**
 * Formats a full ingredient line for display in ingredient lists and
 * grocery checklists.
 *
 * Examples:
 *   "1.5 kg beef chuck or blade roast"
 *   "3 tbsp olive oil"
 *   "200 g shredded cheddar (casserole)"
 */
export function formatIngredientLine(ingredient: Ingredient): string {
  const amount = formatAmount(ingredient.amount, ingredient.unit);
  const note = ingredient.note ? ` (${ingredient.note})` : '';
  return `${amount} ${ingredient.unit} ${ingredient.item}${note}`;
}
