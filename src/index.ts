#!/usr/bin/env ts-node
/**
 * Meal Plan Generator — CLI entry point
 *
 * Usage:
 *   npm run generate                          # Both plans, serves 4
 *   npm run generate -- --servings 6          # Both plans, scaled to 6
 *   npm run generate -- --servings 6 --plan a # Plan A only, scaled to 6
 *   npm run generate -- --servings 8 --output ./dist
 *
 * The --servings flag controls how all ingredient amounts are scaled.
 * For a family of 4 with leftovers/freezer portions, --servings 6 is a
 * good starting point. Use --servings 8 for generous batch cooking.
 */

import { Command } from 'commander';
import * as path from 'path';
import { planA } from './plans/plan-a';
import { planB } from './plans/plan-b';
import { generateDocx } from './generators/docx';
import { generateChecklist } from './generators/checklist';
import type { GeneratorConfig, MealPlan } from './types';

const program = new Command();

program
  .name('mealplan')
  .description('Generate weekly meal plan documents and grocery checklists.')
  .option(
    '-s, --servings <number>',
    'Target serving count. Use 6 for family of 4 + 2 leftover portions, 8 for generous batch cooking.',
    '4',
  )
  .option(
    '-p, --plan <id>',
    'Which plan(s) to include: "a", "b", or "both".',
    'both',
  )
  .option(
    '-o, --output <dir>',
    'Output directory for generated files.',
    './output',
  )
  .option(
    '--suffix <label>',
    'Custom suffix for output filenames. Defaults to "serves<N>".',
  );

program.parse(process.argv);
const opts = program.opts<{
  servings: string;
  plan: string;
  output: string;
  suffix?: string;
}>();

// Resolve plans
const allPlans: Record<string, MealPlan> = { a: planA, b: planB };

let selectedPlans: MealPlan[];
if (opts.plan === 'both') {
  selectedPlans = [planA, planB];
} else if (allPlans[opts.plan]) {
  selectedPlans = [allPlans[opts.plan]];
} else {
  console.error(`Unknown plan "${opts.plan}". Use "a", "b", or "both".`);
  process.exit(1);
}

const targetServings = parseInt(opts.servings, 10);
if (isNaN(targetServings) || targetServings < 1) {
  console.error('--servings must be a positive integer.');
  process.exit(1);
}

const config: GeneratorConfig = {
  targetServings,
  plans: selectedPlans,
  outputDir: path.resolve(opts.output),
  outputSuffix: opts.suffix,
};

// Run generators
(async () => {
  const planLabels = selectedPlans.map(p => p.label).join(', ');
  console.log(`\nGenerating meal plan...`);
  console.log(`  Plans:    ${planLabels}`);
  console.log(`  Servings: ${targetServings}`);
  console.log(`  Output:   ${config.outputDir}\n`);

  try {
    await generateDocx(config);
    generateChecklist(config);
    console.log('\nDone.\n');
  } catch (err) {
    console.error('\nGeneration failed:', err);
    process.exit(1);
  }
})();
