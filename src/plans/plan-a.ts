/**
 * Plan A — Primary Week
 *
 * All ingredient amounts are written for baseServings = 4.
 * The generator scales them to targetServings at output time.
 *
 * Adding a new meal: copy an existing Recipe object, update the fields,
 * and add it to the recipes array. The grocery list and document are
 * generated automatically from this data.
 */

import type { MealPlan, Recipe } from '../types';

const recipes: Recipe[] = [

  // ── Monday ───────────────────────────────────────────────────────────────

  {
    day: 'Monday',
    name: 'Monday — Dutch Oven Beef Stew',
    baseServings: 4,
    prepTime: '20 min (minimal if prepped Sunday)',
    cookTime: '1 hour 45 minutes',
    note: 'Low effort, high reward. If you did the Sunday prep, the beef is already seasoned and the vegetables are cut — this becomes a 10-minute setup followed by hands-off braising.',
    ingredients: [
      { item: 'beef chuck or blade roast', amount: 1.5, unit: 'kg', category: 'proteins' },
      { item: 'medium carrots, cut into chunks', amount: 4, unit: 'pieces', category: 'produce' },
      { item: 'medium potatoes, cut into chunks', amount: 4, unit: 'pieces', category: 'produce' },
      { item: 'large onion, diced', amount: 1, unit: 'pieces', category: 'produce', scaleType: 'fixed' },
      { item: 'garlic cloves, minced', amount: 4, unit: 'cloves', category: 'produce', scaleType: 'fixed' },
      { item: 'tomato paste', amount: 2, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'beef stock', amount: 1, unit: 'litres', category: 'pantry' },
      { item: 'Worcestershire sauce', amount: 1, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'fresh or dried thyme', amount: 2, unit: 'tsp', category: 'spices', scaleType: 'seasoning' },
      { item: 'bay leaves', amount: 2, unit: 'pieces', category: 'spices', scaleType: 'fixed' },
      { item: 'all-purpose flour', amount: 2, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'olive oil', amount: 2, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
    ],
    steps: [
      'Preheat oven to 160°C (325°F). Pat beef dry and season with salt and pepper.',
      'Heat 2 tbsp olive oil in Dutch oven over high heat. Brown beef in batches — don\'t crowd the pan. Set beef aside.',
      'Reduce heat to medium. Add onion and garlic, cook 3 to 4 minutes until softened.',
      'Stir in tomato paste and flour, cook for 1 minute.',
      'Pour in beef stock and Worcestershire sauce, scraping up any browned bits from the bottom.',
      'Return beef to pot. Add thyme and bay leaves. Top up with water if needed to nearly cover the beef.',
      'Bring to a gentle simmer, cover, and transfer to oven. Cook for 1 hour.',
      'Add carrots and potatoes. Return to oven for a further 40 to 45 minutes until beef is fork-tender.',
      'Taste, adjust seasoning, remove bay leaves. Serve with crusty bread.',
    ],
    prep: {
      label: '1. Beef Stew (Monday)',
      steps: [
        'Cut beef chuck into 4cm cubes. Trim excess fat but leave some — it adds flavour during the braise.',
        'Season beef generously with salt, pepper, and a light dusting of garlic powder. Toss to coat.',
        'Cut carrots and potatoes into chunks. Store together in an airtight container in the fridge.',
        'Dice onion and mince garlic. Store in a small container in the fridge.',
      ],
      vacuumTips: [
        'Vacuum seal the seasoned beef cubes in a single layer. On Monday, sear straight from the bag — pat dry first for a good crust.',
        'Optionally vacuum seal the carrot and potato chunks with a small drizzle of olive oil to prevent browning.',
      ],
    },
  },

  // ── Tuesday ──────────────────────────────────────────────────────────────

  {
    day: 'Tuesday',
    name: 'Tuesday — Chicken Shawarma',
    baseServings: 4,
    prepTime: '10 min on the night (marinade done Sunday)',
    cookTime: '25 minutes',
    note: 'If you vacuum-sealed the chicken with marinade on Sunday, it\'s been marinating for two days. Simply take it out, rest 20 minutes, and roast.',
    ingredients: [
      { item: 'bone-in skin-on chicken thighs', amount: 1.5, unit: 'kg', category: 'proteins' },
      { item: 'olive oil (marinade)', amount: 3, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'lemons (juice, marinade)', amount: 2, unit: 'pieces', category: 'produce', scaleType: 'seasoning' },
      { item: 'cumin (marinade)', amount: 2, unit: 'tsp', category: 'spices', scaleType: 'seasoning' },
      { item: 'smoked paprika (marinade)', amount: 1.5, unit: 'tsp', category: 'spices', scaleType: 'seasoning' },
      { item: 'turmeric (marinade)', amount: 1, unit: 'tsp', category: 'spices', scaleType: 'seasoning' },
      { item: 'coriander (marinade)', amount: 1, unit: 'tsp', category: 'spices', scaleType: 'seasoning' },
      { item: 'cinnamon (marinade)', amount: 0.5, unit: 'tsp', category: 'spices', scaleType: 'seasoning' },
      { item: 'garlic powder (marinade)', amount: 0.5, unit: 'tsp', category: 'spices', scaleType: 'seasoning' },
      { item: 'plain Greek yogurt (garlic sauce)', amount: 4, unit: 'tbsp', category: 'dairy', scaleType: 'seasoning' },
      { item: 'garlic cloves, minced (sauce)', amount: 2, unit: 'cloves', category: 'produce', scaleType: 'fixed' },
      { item: 'pita bread', amount: 8, unit: 'pieces', category: 'pantry' },
      { item: 'tomatoes', amount: 2, unit: 'pieces', category: 'produce' },
      { item: 'lettuce', amount: 1, unit: 'head', category: 'produce', scaleType: 'fixed' },
      { item: 'pickled banana peppers or pickles', amount: 1, unit: 'jar', category: 'pantry', scaleType: 'fixed' },
    ],
    steps: [
      'Remove chicken from fridge 20 minutes before cooking. Preheat oven to 220°C (425°F).',
      'Arrange chicken thighs skin-side up on a baking tray. Roast for 25 minutes until skin is deeply golden and internal temperature reaches 74°C.',
      'Rest for 5 minutes, then slice or shred off the bone.',
      'Warm pita in a dry pan or oven. Load with chicken, garlic sauce, tomato, lettuce, and pickled peppers.',
    ],
    prep: {
      label: '2. Chicken Shawarma (Tuesday)',
      steps: [
        'Mix the full shawarma marinade: olive oil, lemon juice, cumin, paprika, turmeric, coriander, cinnamon, garlic powder, salt and pepper.',
        'Add chicken thighs to marinade and coat thoroughly.',
        'Make the garlic sauce: plain yogurt, minced garlic, lemon juice, pinch of salt. Store in a small sealed container.',
      ],
      vacuumTips: [
        'Vacuum seal the marinated chicken thighs with the marinade. The vacuum pressure forces marinade into the meat in under 30 minutes — by Tuesday it will be deeply flavoured throughout.',
      ],
    },
  },

  // ── Wednesday ────────────────────────────────────────────────────────────

  {
    day: 'Wednesday',
    name: 'Wednesday — Baked Cowboy Casserole',
    baseServings: 4,
    prepTime: '10 min if prepped Sunday',
    cookTime: '45 to 50 minutes',
    note: 'If the filling was assembled on Sunday, Wednesday night is just add the topping and bake.',
    ingredients: [
      { item: 'lean ground beef', amount: 700, unit: 'g', category: 'proteins' },
      { item: 'large onion, diced', amount: 1, unit: 'pieces', category: 'produce', scaleType: 'fixed' },
      { item: 'garlic cloves, minced', amount: 3, unit: 'cloves', category: 'produce', scaleType: 'fixed' },
      { item: 'canned diced tomatoes', amount: 2, unit: 'tins (400ml)', category: 'pantry' },
      { item: 'canned kidney beans, drained', amount: 1, unit: 'tins (400ml)', category: 'pantry' },
      { item: 'canned corn, drained', amount: 1, unit: 'tins (400ml)', category: 'pantry', scaleType: 'fixed' },
      { item: 'cumin', amount: 2, unit: 'tsp', category: 'spices', scaleType: 'seasoning' },
      { item: 'smoked paprika', amount: 1, unit: 'tsp', category: 'spices', scaleType: 'seasoning' },
      { item: 'chili powder', amount: 1, unit: 'tsp', category: 'spices', scaleType: 'seasoning' },
      { item: 'shredded cheddar', amount: 200, unit: 'g', category: 'dairy' },
      { item: 'biscuit mix or instant mash (topping)', amount: 1, unit: 'cups', category: 'pantry' },
      { item: 'sour cream', amount: 1, unit: 'tub', category: 'dairy', scaleType: 'fixed' },
    ],
    steps: [
      'Preheat oven to 190°C (375°F).',
      'If starting from raw: brown ground beef, drain fat, add onion and garlic, cook 3 minutes.',
      'If using Sunday-prepped filling: reheat beef in the pan, add onion and garlic briefly.',
      'Add diced tomatoes, beans, corn, and spices. Simmer 5 minutes. Taste and adjust seasoning.',
      'Spread biscuit or mashed potato topping evenly over the surface.',
      'Scatter cheddar generously over the top.',
      'Bake uncovered 30 to 35 minutes until topping is golden and cheese is bubbling.',
      'Rest 5 minutes. Serve with sour cream.',
    ],
    prep: {
      label: '3. Cowboy Casserole (Wednesday)',
      steps: [
        'Brown the ground beef in a pan, breaking it up well. Drain excess fat. Let cool completely.',
        'Dice the onion and mince the garlic for the casserole.',
        'Drain and rinse the kidney beans and corn. Store in a container.',
        'You can fully assemble the casserole filling (beef, onion, garlic, tomatoes, beans, corn, spices) in an oven-safe container. Cover and refrigerate. Wednesday night is just add the topping and bake.',
      ],
      vacuumTips: [
        'Vacuum seal the cooled browned beef in a flat bag. Reheat in the pan with onion and garlic on Wednesday before adding the rest.',
      ],
    },
  },

  // ── Thursday ─────────────────────────────────────────────────────────────

  {
    day: 'Thursday',
    name: 'Thursday — Honey Garlic Salmon with Stir-Fried Rice',
    baseServings: 4,
    prepTime: '5 min on the night (salmon pre-marinated)',
    cookTime: '20 minutes',
    note: 'A lighter mid-week meal. Day-old rice fries better than freshly cooked — use leftovers if you have any.',
    ingredients: [
      { item: 'salmon fillets (~150g each)', amount: 4, unit: 'pieces', category: 'proteins' },
      { item: 'soy sauce (glaze)', amount: 3, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'honey', amount: 2, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'garlic cloves, minced (glaze)', amount: 3, unit: 'cloves', category: 'produce', scaleType: 'seasoning' },
      { item: 'sesame oil', amount: 1, unit: 'tsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'cooked long-grain rice', amount: 2, unit: 'cups', category: 'pantry' },
      { item: 'frozen peas or corn', amount: 1, unit: 'cups', category: 'pantry' },
      { item: 'eggs', amount: 2, unit: 'pieces', category: 'dairy' },
      { item: 'soy sauce (rice)', amount: 2, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'broccoli, cut into florets', amount: 1, unit: 'head', category: 'produce' },
    ],
    steps: [
      'Steam or boil broccoli 4 to 5 minutes. Keep warm.',
      'Heat 1 tbsp oil in a wok over high heat. Add rice, press flat, let sit 2 minutes to crisp.',
      'Push rice aside. Crack in eggs, scramble, mix through the rice. Add peas, soy sauce, green onions. Stir-fry 2 minutes.',
      'In a second pan, heat oil over medium-high. Season salmon and cook skin-side up 3 minutes.',
      'Flip, pour glaze over, cook 3 to 4 minutes, spooning glaze over as it caramelises.',
      'Serve salmon over stir-fried rice with broccoli on the side.',
    ],
    prep: {
      label: '4. Honey Garlic Salmon (Thursday)',
      steps: [
        'Portion salmon fillets if they came as a larger piece — roughly 150g per person.',
        'Mix the honey garlic glaze: soy sauce, honey, minced garlic, sesame oil, water. Store extra glaze in a small jar.',
      ],
      vacuumTips: [
        'Vacuum seal each salmon portion with a small spoonful of glaze. The sealer pushes the glaze into the fish without mess. Perfectly marinated by Thursday.',
      ],
    },
  },

  // ── Friday ───────────────────────────────────────────────────────────────

  {
    day: 'Friday',
    name: 'Friday — Smash Burgers & Oven Fries',
    baseServings: 4,
    prepTime: '5 min if prepped Sunday',
    cookTime: '30 minutes',
    note: 'The smashing technique creates a crispier, more flavourful burger. Press hard and don\'t touch it until it\'s time to flip.',
    ingredients: [
      { item: 'ground beef (burger patties)', amount: 700, unit: 'g', category: 'proteins' },
      { item: 'burger buns', amount: 4, unit: 'pieces', category: 'pantry' },
      { item: 'sliced cheese', amount: 4, unit: 'pieces', category: 'dairy' },
      { item: 'large russet potatoes', amount: 4, unit: 'pieces', category: 'produce' },
      { item: 'olive oil (fries)', amount: 3, unit: 'tbsp', category: 'pantry', scaleType: 'seasoning' },
      { item: 'garlic powder (fries)', amount: 1, unit: 'tsp', category: 'spices', scaleType: 'seasoning' },
      { item: 'smoked paprika (fries)', amount: 1, unit: 'tsp', category: 'spices', scaleType: 'seasoning' },
      { item: 'mayo, mustard, ketchup, hot sauce', amount: 1, unit: 'set', category: 'pantry', scaleType: 'fixed' },
    ],
    steps: [
      'Preheat oven to 220°C (425°F). Toss potato matchsticks with olive oil and seasoning.',
      'Spread fries in a single layer on a baking tray. Bake 25 to 30 minutes, flipping halfway.',
      'Heat a cast-iron pan over very high heat until smoking. Lightly oil the surface.',
      'Place a beef ball on the pan, smash hard with a wide spatula for 10 seconds until roughly 1cm thick.',
      'Season the top. Cook 2 minutes until edges are deeply browned.',
      'Flip once, place cheese on top, cook 1 more minute. Do not press after flipping.',
      'Toast buns in the same pan. Build burgers and serve with fries.',
    ],
    prep: {
      label: '5. Smash Burgers (Friday)',
      steps: [
        'Weigh ground beef into portions (see recipe for scaled weight per patty). Keep them loose — do not overwork the meat.',
        'Cut potatoes into thick matchsticks. Rinse in cold water, then dry thoroughly.',
      ],
      vacuumTips: [
        'Vacuum seal burger portions individually or in pairs with parchment between them.',
        'Vacuum seal the dried potato matchsticks with olive oil and fry seasoning. Straight from bag to baking tray on Friday.',
      ],
    },
  },

];

export const planA: MealPlan = {
  id: 'a',
  label: 'Plan A — Primary Week',
  description: 'Primary week. Mix of Dutch oven, baked casserole, and quick weeknight meals.',
  recipes,
};
