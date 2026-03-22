export type GroceryCategory = 'proteins' | 'produce' | 'dairy' | 'pantry' | 'spices';
export type ScaleType = 'linear' | 'seasoning' | 'fixed';
export type RatingValue = 'liked' | 'disliked';
export type PreferenceType = 'blocked' | 'preferred';

export interface Ingredient {
  item: string;
  amount: number;
  unit: string;
  category: GroceryCategory;
  scaleType?: ScaleType;
  note?: string;
}

export interface Recipe {
  ingredients: Ingredient[];
  steps: string[];
}

export interface PrepGuide {
  steps: string[];
  vacuumTips: string[];
}

// Shape stored in Meal.recipe (JSON string)
export type RecipeJSON = Recipe;
// Shape stored in Meal.prepGuide (JSON string)
export type PrepGuideJSON = PrepGuide;
