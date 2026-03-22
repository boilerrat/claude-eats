# CLAUDE.md

## Project overview

`claude-eats` is a full-stack Next.js web app — a weekly family meal planner powered by the Claude API. It generates Mon–Fri dinner plans for 4 people with 2 extra portions (6 total), produces a Sunday prep guide (vacuum-sealer aware), and maintains an interactive grocery checklist. Deployed via Docker on a VPS using Dokploy.

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run typecheck    # Type check without emitting
npx prisma migrate dev --name <name>   # Add a migration
npx prisma generate                    # Regenerate Prisma client after schema changes
npx prisma studio                      # Browse/edit database in browser
```

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router, TypeScript) |
| Styling | Tailwind CSS |
| Database | SQLite via Prisma 7 |
| AI | Claude API (`claude-opus-4-6`) via `@anthropic-ai/sdk` |
| Exports | `docx` package (DOCX generation) |
| Deployment | Docker → Dokploy (VPS) |

## Project structure

```text
src/
├── app/
│   ├── layout.tsx                  Root layout + nav
│   ├── page.tsx                    Weekly plan (main view)
│   ├── shopping/page.tsx           Interactive grocery checklist
│   ├── prep/page.tsx               Sunday prep guide
│   ├── preferences/page.tsx        Blocked/preferred ingredients
│   ├── history/page.tsx            Past weeks + ratings
│   ├── meals/[id]/page.tsx         Meal detail (recipe + prep)
│   └── api/
│       ├── generate/route.ts       POST — generate full week via Claude
│       ├── generate/swap/route.ts  POST — swap one day's meal
│       ├── meals/[id]/rate/route.ts POST — like or dislike a meal
│       ├── shopping/check/route.ts  POST — toggle item checked state
│       ├── preferences/route.ts     POST — add ingredient preference
│       ├── preferences/[id]/route.ts DELETE — remove preference
│       ├── export/shopping/route.ts GET — download shopping list as DOCX
│       ├── export/prep/route.ts     GET — download prep guide as DOCX
│       └── cron/weekly/route.ts     GET — Saturday auto-generate (Bearer token)
├── components/
│   ├── WeeklyPlanView.tsx          Client shell for main page
│   ├── MealCard.tsx                Day card with like/dislike/swap
│   ├── GenerateButton.tsx          Generate/Regenerate button
│   ├── ShoppingListView.tsx        Interactive checklist
│   └── PreferencesView.tsx         Add/remove ingredient preferences
├── lib/
│   ├── db.ts                       Prisma client singleton
│   ├── dates.ts                    getCurrentWeekStart(), formatWeekRange()
│   ├── types.ts                    Shared TS types (Recipe, PrepGuide, etc.)
│   └── generateMeals.ts            Claude API call + prompt
└── generated/prisma/               Auto-generated Prisma client (do not edit)
```

## Database schema

Models: `Meal`, `MealRating`, `IngredientPreference`, `WeeklyPlan`, `WeeklyPlanMeal`, `ShoppingListItem`

- `Meal.recipe` and `Meal.prepGuide` are JSON strings — parse with `JSON.parse()` and type as `RecipeJSON` / `PrepGuideJSON` from `@/lib/types`
- `WeeklyPlan` is keyed by `weekStart` (Monday 00:00:00 UTC)
- `MealRating.rating` is `'liked' | 'disliked'`
- `IngredientPreference.type` is `'blocked' | 'preferred'`

## AI generation

`src/lib/generateMeals.ts` calls Claude with:

- Count of meals to generate
- Blocked/preferred ingredients from DB
- Liked/disliked meal names from DB (to bias future suggestions)
- Target servings (default 6)

Returns an array of `GeneratedMeal` objects. The generate route saves all 7 to `Meal`, assigns first 5 to Mon–Fri, and rebuilds the shopping list.

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | `file:./dev.db` (dev) or `file:/data/db.sqlite` (prod) |
| `ANTHROPIC_API_KEY` | Yes | Claude API key |
| `CRON_SECRET` | No | If set, `/api/cron/weekly` requires `Authorization: Bearer <secret>` |

## Docker / Dokploy

- `Dockerfile` uses multi-stage build, `next.config.ts` has `output: 'standalone'`
- `docker-entrypoint.sh` runs `prisma migrate deploy` before starting
- SQLite lives on a named volume mounted at `/data/`
- Set `DATABASE_URL=file:/data/db.sqlite` in Dokploy environment variables

## Adding features

- **New page**: create `src/app/<route>/page.tsx` (server component) + add to nav in `layout.tsx`
- **New API**: add `src/app/api/<route>/route.ts`
- **Schema change**: edit `prisma/schema.prisma` → `npx prisma migrate dev --name <name>` → `npx prisma generate`
- **New export format**: add a route under `src/app/api/export/`
