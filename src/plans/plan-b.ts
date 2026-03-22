/**
 * Plan B — Alternate Week
 *
 * Swap in any meal from this plan if something's on sale or you want a change.
 * All amounts written for baseServings = 4; scaled at output time.
 */

import type { MealPlan, Recipe } from '../types';

const recipes: Recipe[] = [

  // ── Monday ───────────────────────────────────────────────────────────────

  {
    day: 'Monday',
    name: 'Monday — Dutch Oven Chicken & White Bean Stew',
    baseServings: 4,
    prepTime: '20 minutes',
    cookTime: '50 minutes',
    note: 'A lighter, brothier stew than the beef version — the white beans thicken it naturally and make it very filling. Serve with crusty bread to soak up the broth.',
    ingredients: [
      { item: 'chicken thighs (bone-in preferred)', amount: 1.5, unit: 'kg', category: 'proteins' },
      { item: 'canned cannellini beans, drained', amount: 2, unit: 'tins (400ml)', category: 'pantry' },
      { item: 'chicken stock', amount: 1, unit: 'litres', category: 'pantry' },
      { item: 'large onion, diced', amount: 1, unit: 'pieces', category: 'produce', scaleType: 'fixed' },
      { item: 'celery stalks, sliced', amount: 3, unit: 'pieces', category: 'produce' },
      { item: 'medium carrots, sliced into rounds', amount: 3, unit: 'pieces', category: 'produce' },
      { item: 'garlic cloves, minced', amount: 4, unit: 'cloves', category: 'produce', scaleType: 'fixed' },
      { item: 'fresh rosemary sprigs', amount: 2, unit: 'pieces', category: 'produce', scaleType: 'fixed' },
      { item: 'fresh thyme sprigs', amount: 4, unit: 'pieces', category: 'produce', scaleType: 'fixed' },
      { item: 'bay leaves', amount: 2, unit: 'pieces', category: 'spices', scaleType: 'fixed' },
      { item: 'olive oil', amount: 1, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
    ],
    steps: [
      'Pat chicken dry and season generously with salt and pepper.',
      'Heat olive oil in Dutch oven over medium-high heat. Brown chicken pieces 3 to 4 minutes per side. Set aside.',
      'Reduce heat to medium. Add onion, celery, and carrot. Cook 4 minutes until softened.',
      'Add garlic, cook 1 minute.',
      'Pour in chicken stock and scrape up any browned bits from the bottom.',
      'Return chicken to pot. Add herbs and bay leaves. Bring to a simmer.',
      'Cover and cook on low heat for 30 minutes.',
      'Add white beans and stir gently. Cook uncovered for a further 15 minutes until broth has thickened slightly.',
      'Remove bay leaves. Shred bone-in chicken off the bone if preferred. Taste and adjust seasoning. Serve with crusty bread.',
    ],
    prep: {
      label: '1. Chicken & White Bean Stew (Monday)',
      steps: [
        'Cut chicken thighs into large bite-sized pieces if using boneless, or leave bone-in for more flavour.',
        'Drain and rinse white beans. Store in a container.',
        'Dice onion, celery, and carrot. Store together in a container in the fridge.',
        'Mince garlic. Store in a small container.',
        'Pick rosemary and thyme leaves. Wrap in a damp paper towel and store in a zip bag.',
      ],
      vacuumTips: [
        'Vacuum seal the chicken pieces with a drizzle of olive oil, salt, pepper, and half the garlic. Even a few hours of contact improves the flavour noticeably.',
      ],
    },
  },

  // ── Tuesday ──────────────────────────────────────────────────────────────

  {
    day: 'Tuesday',
    name: 'Tuesday — Sheet Pan Sausage with Peppers, Onions & Potatoes',
    baseServings: 4,
    prepTime: '10 min (5 min if prepped Sunday)',
    cookTime: '35 to 40 minutes',
    note: 'One tray, one cleanup. Everything roasts together and the sausage drippings flavour the vegetables underneath.',
    ingredients: [
      { item: 'sausages (Italian or mild)', amount: 600, unit: 'g', category: 'proteins' },
      { item: 'bell peppers (mixed colours), cut into strips', amount: 3, unit: 'pieces', category: 'produce' },
      { item: 'medium onions, cut into wedges', amount: 2, unit: 'pieces', category: 'produce' },
      { item: 'potatoes, cut into 2cm chunks', amount: 500, unit: 'g', category: 'produce' },
      { item: 'olive oil', amount: 3, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'Italian seasoning', amount: 1.5, unit: 'tsp', category: 'spices', scaleType: 'seasoning' },
      { item: 'garlic powder', amount: 1, unit: 'tsp', category: 'spices', scaleType: 'seasoning' },
    ],
    steps: [
      'Preheat oven to 210°C (410°F).',
      'If not prepped Sunday: toss peppers, onion, and potatoes with olive oil, Italian seasoning, garlic powder, salt, and pepper.',
      'Spread vegetables on a large baking tray in a single layer. Nestle sausages on top or alongside.',
      'Roast for 20 minutes. Flip vegetables and turn sausages.',
      'Continue roasting for 15 to 20 minutes until potatoes are golden and sausages are cooked through.',
      'Scatter fresh parsley over the top if using. Serve directly from the tray.',
    ],
    prep: {
      label: '2. Sheet Pan Sausage (Tuesday)',
      steps: [
        'Slice sausages into thick rounds or leave whole — your preference.',
        'Cut peppers into strips, onion into wedges, and potatoes into small chunks.',
        'Toss everything together with olive oil, Italian seasoning, salt, and pepper.',
      ],
      vacuumTips: [
        'Vacuum seal the sausage and vegetables together in a single flat bag. On Tuesday, cut open and tip straight onto the baking tray. No bowl to wash.',
      ],
    },
  },

  // ── Wednesday ────────────────────────────────────────────────────────────

  {
    day: 'Wednesday',
    name: 'Wednesday — Baked Mac & Cheese with Crispy Breadcrumb Top',
    baseServings: 4,
    prepTime: '20 minutes',
    cookTime: '35 minutes',
    note: 'Grate the cheese yourself — pre-shredded has anti-caking agents that make the sauce grainy. The breadcrumb top can be prepped Sunday.',
    ingredients: [
      { item: 'elbow macaroni', amount: 500, unit: 'g', category: 'pantry' },
      { item: 'old cheddar, freshly grated', amount: 400, unit: 'g', category: 'dairy' },
      { item: 'Gruyere or extra old white cheddar (optional)', amount: 100, unit: 'g', category: 'dairy', scaleType: 'fixed' },
      { item: 'butter', amount: 4, unit: 'tbsp', category: 'dairy' },
      { item: 'all-purpose flour', amount: 4, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'whole milk', amount: 500, unit: 'ml', category: 'dairy' },
      { item: 'Dijon mustard', amount: 1, unit: 'tsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'cayenne pepper', amount: 1, unit: 'pinch', category: 'spices', scaleType: 'fixed' },
      { item: 'panko breadcrumbs (topping)', amount: 1, unit: 'cups', category: 'pantry', scaleType: 'seasoning' },
      { item: 'butter, melted (topping)', amount: 2, unit: 'tbsp', category: 'dairy', scaleType: 'seasoning' },
      { item: 'garlic powder (topping)', amount: 1, unit: 'pinch', category: 'spices', scaleType: 'fixed' },
    ],
    steps: [
      'Preheat oven to 190°C (375°F). Cook macaroni in heavily salted water until just under al dente. Reserve 250ml pasta water before draining.',
      'Melt butter in a large saucepan over medium heat. Whisk in flour and cook 1 to 2 minutes until lightly golden.',
      'Gradually whisk in milk until smooth. Keep whisking until sauce thickens to coat the back of a spoon, about 5 minutes.',
      'Remove from heat. Stir in mustard, then add cheese in three batches, stirring until each addition melts fully.',
      'Add a splash of reserved pasta water to loosen if needed. Season well with salt, pepper, and cayenne.',
      'Fold drained macaroni into the cheese sauce. Transfer to a buttered baking dish or Dutch oven.',
      'Mix breadcrumbs with melted butter and garlic powder. Scatter evenly over the top.',
      'Bake 25 to 30 minutes until top is deep golden and sauce is bubbling at the edges.',
      'Rest 5 minutes before serving.',
    ],
    prep: {
      label: '3. Baked Mac & Cheese (Wednesday)',
      steps: [
        'Mac & cheese is best made fresh on the night — the sauce does not hold well. However you can grate the cheese ahead and store in a zip bag.',
        'Measure out the breadcrumbs and mix with melted butter and a pinch of garlic powder. Store in a container — goes straight on top Wednesday.',
      ],
      vacuumTips: [],
    },
  },

  // ── Thursday ─────────────────────────────────────────────────────────────

  {
    day: 'Thursday',
    name: 'Thursday — Beef & Broccoli with Egg Noodles',
    baseServings: 4,
    prepTime: '10 min on the night (beef marinated Sunday)',
    cookTime: '20 minutes',
    note: 'Have everything prepped before the wok goes on — it moves fast. Thin slices and very high heat are the two non-negotiables.',
    ingredients: [
      { item: 'flank steak or sirloin, sliced thinly against the grain', amount: 600, unit: 'g', category: 'proteins' },
      { item: 'soy sauce (marinade)', amount: 2, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'oyster sauce (marinade)', amount: 1, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'sesame oil (marinade)', amount: 1, unit: 'tsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'cornstarch (marinade)', amount: 1, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'broccoli, cut into small florets', amount: 1, unit: 'head', category: 'produce' },
      { item: 'egg noodles or lo mein noodles', amount: 300, unit: 'g', category: 'pantry' },
      { item: 'soy sauce (stir-fry sauce)', amount: 3, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'oyster sauce (stir-fry sauce)', amount: 2, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'beef stock', amount: 100, unit: 'ml', category: 'pantry', scaleType: 'seasoning' },
      { item: 'brown sugar', amount: 1, unit: 'tsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'cornstarch (stir-fry sauce)', amount: 1, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'garlic cloves, minced (sauce)', amount: 3, unit: 'cloves', category: 'produce', scaleType: 'fixed' },
      { item: 'fresh ginger, grated', amount: 1, unit: 'tsp', category: 'produce', scaleType: 'seasoning' },
    ],
    steps: [
      'Cook egg noodles according to package. Drain and toss with a little sesame oil to prevent sticking.',
      'Mix all stir-fry sauce ingredients in a small bowl. Set aside.',
      'Blanch broccoli in boiling water for 90 seconds. Drain and set aside.',
      'Heat 1 tbsp oil in a wok or large pan over very high heat until smoking.',
      'Add beef in a single layer — do not stir for 90 seconds until a crust forms. Toss and cook another 60 seconds. Remove and set aside.',
      'Add another tbsp oil. Add broccoli and stir-fry 2 minutes.',
      'Return beef to the pan. Pour in stir-fry sauce. Toss everything and cook 1 to 2 minutes until sauce thickens.',
      'Serve over egg noodles. Garnish with sesame seeds and sliced green onion if using.',
    ],
    prep: {
      label: '4. Beef & Broccoli (Thursday)',
      steps: [
        'Slice beef thinly against the grain — flank steak or sirloin works well. Thin slices are key for quick stir-frying.',
        'Mix the marinade: soy sauce, oyster sauce, sesame oil, cornstarch.',
        'Cut broccoli into small florets.',
        'Mix the stir-fry sauce: soy sauce, oyster sauce, beef stock, brown sugar, cornstarch, garlic, ginger.',
      ],
      vacuumTips: [
        'Vacuum seal the sliced beef with the marinade. By Thursday the beef will be tender and deeply flavoured. This works exceptionally well with vacuum sealing — the marinade penetrates the thin slices fully.',
        'Store the broccoli florets in a zip bag in the fridge.',
      ],
    },
  },

  // ── Friday ───────────────────────────────────────────────────────────────

  {
    day: 'Friday',
    name: 'Friday — Crispy Baked Fish Tacos with Slaw & Lime Crema',
    baseServings: 4,
    prepTime: '15 min (slaw made Sunday)',
    cookTime: '20 minutes',
    note: 'Baked rather than fried. The slaw is better the longer it sits — making it Sunday is ideal.',
    ingredients: [
      { item: 'white fish fillets (cod, haddock, or tilapia)', amount: 4, unit: 'pieces (~130g each)', category: 'proteins' },
      { item: 'all-purpose flour (coating)', amount: 3, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'cumin (coating)', amount: 1, unit: 'tsp', category: 'spices', scaleType: 'seasoning' },
      { item: 'smoked paprika (coating)', amount: 1, unit: 'tsp', category: 'spices', scaleType: 'seasoning' },
      { item: 'garlic powder (coating)', amount: 0.5, unit: 'tsp', category: 'spices', scaleType: 'seasoning' },
      { item: 'cayenne pepper (coating)', amount: 1, unit: 'pinch', category: 'spices', scaleType: 'fixed' },
      { item: 'small corn or flour tortillas', amount: 12, unit: 'pieces', category: 'pantry' },
      { item: 'half head of cabbage, shredded (slaw)', amount: 0.5, unit: 'head', category: 'produce' },
      { item: 'mayo (slaw)', amount: 2, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'limes (slaw + crema)', amount: 4, unit: 'pieces', category: 'produce' },
      { item: 'sour cream (lime crema)', amount: 4, unit: 'tbsp', category: 'dairy', scaleType: 'seasoning' },
      { item: 'hot sauce', amount: 1, unit: 'bottle', category: 'pantry', scaleType: 'fixed' },
    ],
    steps: [
      'Preheat oven to 220°C (425°F). Line a baking tray with parchment and drizzle generously with olive oil.',
      'Mix flour, cumin, paprika, garlic powder, cayenne, and salt in a shallow bowl.',
      'Pat fish fillets dry. Dredge in seasoned flour, pressing to coat all sides. Shake off excess.',
      'Place coated fish on the oiled tray. Drizzle or spray tops with a little more oil.',
      'Bake for 15 to 18 minutes until fish is cooked through and coating is golden.',
      'Warm tortillas in a dry pan or directly over a gas burner for 20 to 30 seconds.',
      'Break fish into chunks. Build tacos: tortilla, fish, slaw, lime crema, hot sauce.',
      'Serve with lime wedges.',
    ],
    prep: {
      label: '5. Fish Tacos (Friday)',
      steps: [
        'Portion white fish fillets if needed — roughly 130g per person.',
        'Mix the seasoning: cumin, smoked paprika, garlic powder, salt, pinch of cayenne.',
        'Make the slaw: shred cabbage, mix with lime juice, mayo, salt, pinch of sugar. Refrigerate — it improves as it sits.',
        'Make the lime crema: sour cream, lime juice, zest, pinch of salt. Store in a small container.',
      ],
      vacuumTips: [
        'Vacuum seal the seasoned fish fillets. Store in the fridge — do not season more than 24 hours ahead as acid can begin to denature the protein.',
      ],
    },
  },

];

export const planB: MealPlan = {
  id: 'b',
  label: 'Plan B — Alternate Week',
  description: 'Alternate week. Swap in any meal if something is on sale or you want a change.',
  recipes,
};
