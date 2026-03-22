/**
 * Grocery list aggregation.
 *
 * Takes a list of scaled recipes and produces a deduplicated, categorised
 * grocery list. Ingredients with the same item name and unit are summed.
 *
 * This is the key advantage of data-driven recipes over hard-coded strings:
 * the grocery list is always derived from actual recipe data and stays in sync
 * when recipes or servings change.
 */

import type { GroceryCategory, Ingredient, Recipe } from '../types';
import { formatIngredientLine } from './scale';

// ── Aggregated item ───────────────────────────────────────────────────────────

export interface GroceryItem {
  item: string;
  amount: number;
  unit: string;
  note?: string;
  category: GroceryCategory;
  /** Formatted display string, e.g. "1.5 kg beef chuck or blade roast" */
  display: string;
}

export type GroceryList = Record<GroceryCategory, GroceryItem[]>;

// ── Category display config ───────────────────────────────────────────────────

export const CATEGORY_CONFIG: Record<
  GroceryCategory,
  { label: string; emoji: string; color: string; bg: string }
> = {
  proteins: { label: 'Proteins',           emoji: '🥩', color: '#C0392B', bg: '#FDF0EE' },
  produce:  { label: 'Produce',            emoji: '🥦', color: '#27AE60', bg: '#EEF9F2' },
  dairy:    { label: 'Dairy & Refrigerated', emoji: '🧀', color: '#E67E22', bg: '#FEF6EE' },
  pantry:   { label: 'Pantry & Dry Goods', emoji: '🥫', color: '#2980B9', bg: '#EEF4FB' },
  spices:   { label: 'Spices',             emoji: '🫙', color: '#8E44AD', bg: '#F5EEF8' },
};

export const CATEGORY_ORDER: GroceryCategory[] = [
  'proteins', 'produce', 'dairy', 'pantry', 'spices',
];

// ── Aggregation key ───────────────────────────────────────────────────────────

/**
 * Two ingredient entries are considered the same item if their normalised
 * item name and unit match. Notes are dropped from the key so "olive oil
 * (stew)" and "olive oil (burgers)" aggregate into one entry.
 */
function aggregationKey(ingredient: Ingredient): string {
  return `${ingredient.item.toLowerCase().trim()}::${ingredient.unit.toLowerCase().trim()}`;
}

// ── Build grocery list ────────────────────────────────────────────────────────

/**
 * Builds a categorised grocery list from an array of (already-scaled) recipes.
 *
 * Items with the same item+unit are summed. The note from the first occurrence
 * is kept; if you need per-recipe notes to survive aggregation, that's a future
 * enhancement (see TODO below).
 */
export function buildGroceryList(recipes: Recipe[]): GroceryList {
  // Flat map all ingredients across all recipes
  const allIngredients: Ingredient[] = recipes.flatMap(r => r.ingredients);

  // Aggregate by key
  const map = new Map<string, GroceryItem>();

  for (const ingredient of allIngredients) {
    const key = aggregationKey(ingredient);
    const existing = map.get(key);

    if (existing) {
      // Sum the amounts; keep first note
      existing.amount += ingredient.amount;
      // Regenerate display after summing
      existing.display = formatIngredientLine({
        ...ingredient,
        amount: existing.amount,
        note: existing.note,
      });
    } else {
      const item: GroceryItem = {
        item: ingredient.item,
        amount: ingredient.amount,
        unit: ingredient.unit,
        note: ingredient.note,
        category: ingredient.category,
        display: formatIngredientLine(ingredient),
      };
      map.set(key, item);
    }
  }

  // Group into categories
  const list: GroceryList = {
    proteins: [],
    produce: [],
    dairy: [],
    pantry: [],
    spices: [],
  };

  for (const item of map.values()) {
    list[item.category].push(item);
  }

  // TODO: preserve insertion order within categories (currently follows Map
  // iteration order which matches first-recipe-first ordering — good enough
  // for now but could be alphabetised or manually ordered in a future pass).

  return list;
}
