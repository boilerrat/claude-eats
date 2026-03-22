import Anthropic from '@anthropic-ai/sdk';
import type { RecipeJSON, PrepGuideJSON, GroceryCategory } from './types';

export interface GeneratedMeal {
  name: string;
  description: string;
  recipe: RecipeJSON;
  prepGuide: PrepGuideJSON;
}

interface GenerateOptions {
  count: number;
  blockedIngredients: string[];
  preferredIngredients: string[];
  likedMealNames: string[];
  dislikedMealNames: string[];
  targetServings: number;
  apiKey: string;
}

const CATEGORIES: GroceryCategory[] = ['proteins', 'produce', 'dairy', 'pantry', 'spices'];

export async function generateMeals(opts: GenerateOptions): Promise<GeneratedMeal[]> {
  const {
    count,
    blockedIngredients,
    preferredIngredients,
    likedMealNames,
    dislikedMealNames,
    targetServings,
    apiKey,
  } = opts;

  const client = new Anthropic({ apiKey });

  const prompt = `You are a family meal planner. Generate exactly ${count} weeknight dinner recipes for a family of 4 with ${targetServings - 4} extra portions (total ${targetServings} servings) for leftovers/freezing.

REQUIREMENTS:
- Quick to prepare on weeknights (max 60 min active time)
- Family-friendly, filling, and nutritious
- Varied — no two meals from the same cuisine or protein
- Include a full Sunday batch-prep guide per meal, optimised for vacuum sealing
- The family owns a vacuum sealer — use this where helpful for prep

INGREDIENT PREFERENCES:
${blockedIngredients.length > 0 ? `- NEVER use: ${blockedIngredients.join(', ')}` : '- No blocked ingredients'}
${preferredIngredients.length > 0 ? `- Favour if possible: ${preferredIngredients.join(', ')}` : ''}

MEAL HISTORY:
${likedMealNames.length > 0 ? `- Previously liked (can repeat or do similar): ${likedMealNames.join(', ')}` : ''}
${dislikedMealNames.length > 0 ? `- NEVER suggest again: ${dislikedMealNames.join(', ')}` : ''}

Respond with a JSON array of exactly ${count} meals. Each meal must match this TypeScript type exactly:

{
  name: string,                        // Short name, e.g. "Honey Garlic Salmon"
  description: string,                 // 1–2 sentence description
  recipe: {
    ingredients: Array<{
      item: string,
      amount: number,                  // Numeric, scaled to ${targetServings} servings
      unit: string,                    // e.g. "kg", "g", "tbsp", "tsp", "cups", "litres", "pieces", "heads", "tins"
      category: "${CATEGORIES.join('" | "')}",
      scaleType?: "linear" | "seasoning" | "fixed",
      note?: string
    }>,
    steps: string[]                    // Numbered cooking steps
  },
  prepGuide: {
    steps: string[],                   // Sunday prep steps
    vacuumTips: string[]               // Vacuum sealer specific tips (can be empty array)
  }
}

Return ONLY the JSON array, no markdown, no explanation.`;

  const message = await client.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 16000,
    messages: [{ role: 'user', content: prompt }],
  });

  if (message.stop_reason === 'max_tokens') {
    throw new Error('Claude response was truncated — response too long for token limit');
  }

  const text = message.content.find(b => b.type === 'text')?.text ?? '';

  // Strip any accidental markdown fences
  const json = text.replace(/^```[a-z]*\n?/m, '').replace(/```$/m, '').trim();

  const meals: GeneratedMeal[] = JSON.parse(json);

  if (!Array.isArray(meals) || meals.length !== count) {
    throw new Error(`Expected ${count} meals, got ${meals.length}`);
  }

  return meals;
}
