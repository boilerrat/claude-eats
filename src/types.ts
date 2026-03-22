/**
 * Core domain types for the meal plan generator.
 *
 * Design note: ingredients carry their own category and scale type so that
 * grocery list aggregation and portion scaling are both data-driven rather
 * than hard-coded in the generators.
 */

// ── Grocery categories ────────────────────────────────────────────────────────

export type GroceryCategory =
  | 'proteins'
  | 'produce'
  | 'dairy'
  | 'pantry'
  | 'spices';

// ── Scaling behaviour ─────────────────────────────────────────────────────────

/**
 * Controls how an ingredient amount changes when the serving count is adjusted.
 *
 * - linear:    amount scales 1:1 with the serving multiplier (most ingredients)
 * - seasoning: scales at ~75% of the multiplier — spices and flavourings don't
 *              need full linear scaling; a 1.5x batch doesn't need 1.5x cumin
 * - fixed:     amount does not scale — aromatics like a head of garlic, a bay
 *              leaf count, or a "to taste" item stay constant
 */
export type ScaleType = 'linear' | 'seasoning' | 'fixed';

// ── Ingredient ─────────────────────────────────────────────────────────────────

export interface Ingredient {
  /** Display name, e.g. "beef chuck or blade roast" */
  item: string;
  /** Numeric quantity at base serving count */
  amount: number;
  /**
   * Unit string, e.g. "kg", "g", "tbsp", "tsp", "cups", "litres", "pieces",
   * "heads", "tins" — kept as a plain string so unusual units don't need an
   * enum entry.
   */
  unit: string;
  /** Optional clarifying note shown in parentheses, e.g. "(casserole + burgers)" */
  note?: string;
  /** Defaults to 'linear' if omitted */
  scaleType?: ScaleType;
  category: GroceryCategory;
}

// ── Prep guide ────────────────────────────────────────────────────────────────

export interface PrepBlock {
  /** e.g. "1. Beef Stew (Monday)" */
  label: string;
  steps: string[];
  /** Shown with the VS (vacuum sealer) badge */
  vacuumTips: string[];
}

// ── Recipe ────────────────────────────────────────────────────────────────────

export interface Recipe {
  /** Short day label, e.g. "Monday" */
  day: string;
  /** Full display name, e.g. "Monday — Dutch Oven Beef Stew" */
  name: string;
  /**
   * The serving count these ingredient amounts are written for.
   * Scaling is applied relative to this value.
   */
  baseServings: number;
  prepTime: string;
  cookTime: string;
  /** Italic context note shown above the ingredient list */
  note?: string;
  ingredients: Ingredient[];
  steps: string[];
  /** Sunday prep guidance for this meal (optional) */
  prep?: PrepBlock;
}

// ── Meal plan ─────────────────────────────────────────────────────────────────

export interface MealPlan {
  /** Short ID, e.g. "a" or "b" */
  id: string;
  /** Display label, e.g. "Plan A — Primary Week" */
  label: string;
  /** One-line description shown on divider pages */
  description: string;
  recipes: Recipe[];
}

// ── Generator config ──────────────────────────────────────────────────────────

export interface GeneratorConfig {
  /**
   * Target serving count. All ingredient amounts will be scaled from each
   * recipe's baseServings to this value before output.
   *
   * Examples:
   *   4  → standard family of 4, no planned leftovers
   *   6  → family of 4 with ~2 portions for lunches or freezing
   *   8  → generous batch cooking, multiple freeze portions
   */
  targetServings: number;
  plans: MealPlan[];
  /** Directory where generated files are written */
  outputDir: string;
  /**
   * Optional label appended to output filenames to distinguish runs.
   * e.g. "serves6" → meal_plan_serves6.docx
   * Defaults to `serves${targetServings}` if omitted.
   */
  outputSuffix?: string;
}
