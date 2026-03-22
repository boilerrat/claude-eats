# claude-eats

Generates a weekly family meal plan as a Word document and interactive HTML grocery checklist. Portion sizes are fully configurable — scale up for leftovers or batch cooking.

## Quick start

```bash
npm install
npm run generate                   # Both plans, serves 4
npm run generate -- --servings 6   # Scaled to 6 (family of 4 + 2 leftover portions)
npm run generate -- --servings 8   # Scaled to 8 (generous batch cooking)
npm run generate -- --plan a       # Plan A only
```

Output files land in `./output/`.

## CLI options

| Flag | Default | Description |
|------|---------|-------------|
| `--servings <n>` | `4` | Target serving count. All ingredient amounts scale from each recipe's base (4 servings). |
| `--plan <id>` | `both` | `a`, `b`, or `both` |
| `--output <dir>` | `./output` | Output directory |
| `--suffix <label>` | `serves<N>` | Custom filename suffix |

## Scaling behaviour

Each ingredient has a `scaleType`:

- **`linear`** — scales 1:1 with the serving multiplier (proteins, produce, grains)
- **`seasoning`** — scales at 75% of the multiplier (spices, condiments, aromatics)
- **`fixed`** — does not scale (bay leaves, a head of garlic, condiment sets)

Adjust the coefficient in `src/utils/scale.ts` → `SCALE_COEFFICIENTS` if you find seasoning too heavy or light.

## Project structure

```
src/
├── types.ts               Core domain types (Recipe, Ingredient, MealPlan, etc.)
├── index.ts               CLI entry point
├── plans/
│   ├── plan-a.ts          Plan A recipe data (Primary Week)
│   └── plan-b.ts          Plan B recipe data (Alternate Week)
├── generators/
│   ├── docx.ts            Word document generator
│   └── checklist.ts       HTML grocery checklist generator
└── utils/
    ├── scale.ts            Scaling and amount formatting
    └── grocery.ts          Grocery list aggregation
```

## Adding a new meal

1. Open `src/plans/plan-a.ts` (or `plan-b.ts`)
2. Add a new `Recipe` object to the `recipes` array
3. Each `Ingredient` needs `item`, `amount`, `unit`, `category`, and optionally `scaleType` and `note`
4. The grocery list is derived automatically — no separate list to maintain

## Adding a new plan

1. Create `src/plans/plan-c.ts` following the same pattern as plan-a/b
2. Export a `planC: MealPlan` object
3. Import it in `src/index.ts` and add it to `allPlans`

## Typechecking

```bash
npm run typecheck
```

## Next steps / roadmap

- [ ] Pantry stock tracking — skip items you already have
- [ ] Per-meal calorie estimates
- [ ] Shopping order by supermarket aisle layout
- [ ] PDF output option
- [ ] Web UI for interactive plan editing
