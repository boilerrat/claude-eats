/**
 * Word Document Generator
 *
 * Produces a .docx file containing both plans with overview tables,
 * Sunday prep guides, grocery lists, and full recipes — all scaled
 * to the configured target serving count.
 */

import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageBreak,
} from 'docx';
import * as fs from 'fs';
import * as path from 'path';
import type { GeneratorConfig, MealPlan, Recipe } from '../types';
import { scaleIngredients, formatIngredientLine } from '../utils/scale';
import { buildGroceryList, CATEGORY_ORDER, CATEGORY_CONFIG } from '../utils/grocery';

// ── Theme tokens ──────────────────────────────────────────────────────────────

const T = {
  accentA:  '1F5C8B',
  accentB:  '7B3F00',
  lightBgA: 'EEF4FB',
  lightBgB: 'FBF3EE',
  medBgA:   'D0E4F5',
  greenBg:  'E8F5E9',
  greenAc:  '2E7D32',
};

const BORDER     = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } as const;
const BORDERS    = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const NO_BORDER  = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' } as const;
const NO_BORDERS = { top: NO_BORDER, bottom: NO_BORDER, left: NO_BORDER, right: NO_BORDER };

// ── Typography helpers ────────────────────────────────────────────────────────

function h1(text: string, color = T.accentA): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, bold: true, size: 36, color, font: 'Arial' })],
    spacing: { before: 360, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 6, color, space: 4 } },
  });
}

function h2(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, bold: true, size: 28, color: '333333', font: 'Arial' })],
    spacing: { before: 300, after: 100 },
  });
}

function h3(text: string, color = T.accentA): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 24, color, font: 'Arial' })],
    spacing: { before: 200, after: 80 },
  });
}

function body(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: 'Arial' })],
    spacing: { before: 40, after: 40 },
  });
}

function bulletPara(text: string): Paragraph {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    children: [new TextRun({ text, size: 22, font: 'Arial' })],
    spacing: { before: 30, after: 30 },
  });
}

function numberedPara(text: string, ref = 'steps'): Paragraph {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    children: [new TextRun({ text, size: 22, font: 'Arial' })],
    spacing: { before: 40, after: 40 },
  });
}

function spacer(n = 1): Paragraph {
  return new Paragraph({ children: [new TextRun('')], spacing: { before: 60 * n, after: 0 } });
}

function pageBreak(): Paragraph {
  return new Paragraph({ children: [new PageBreak()] });
}

function label(text: string, color = '666666'): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 20, color, font: 'Arial', allCaps: true })],
    spacing: { before: 140, after: 50 },
  });
}

function infoBox(text: string, bgColor = T.lightBgA, textColor = '444444'): Table {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [new TableRow({ children: [new TableCell({
      borders: NO_BORDERS,
      shading: { fill: bgColor, type: ShadingType.CLEAR },
      margins: { top: 120, bottom: 120, left: 220, right: 220 },
      width: { size: 9360, type: WidthType.DXA },
      children: [new Paragraph({
        children: [new TextRun({ text, size: 21, font: 'Arial', italics: true, color: textColor })],
      })],
    })]})],
  });
}

function vacuumTag(text: string): Table {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [400, 8960],
    rows: [new TableRow({ children: [
      new TableCell({
        borders: NO_BORDERS,
        shading: { fill: T.greenBg, type: ShadingType.CLEAR },
        width: { size: 400, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 120, right: 80 },
        children: [new Paragraph({ alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: 'VS', bold: true, size: 18, font: 'Arial', color: T.greenAc })] })],
      }),
      new TableCell({
        borders: NO_BORDERS,
        shading: { fill: T.greenBg, type: ShadingType.CLEAR },
        width: { size: 8960, type: WidthType.DXA },
        margins: { top: 80, bottom: 80, left: 100, right: 120 },
        children: [new Paragraph({
          children: [new TextRun({ text, size: 20, font: 'Arial', color: T.greenAc })] })],
      }),
    ]})],
  });
}

// ── Meal overview table ───────────────────────────────────────────────────────

function mealTable(plan: MealPlan, accent: string, lightBg: string): Table {
  const headerRow = new TableRow({
    tableHeader: true,
    children: ['Day', 'Dinner'].map((h, i) => new TableCell({
      borders: BORDERS,
      shading: { fill: accent, type: ShadingType.CLEAR },
      width: { size: [1800, 7560][i], type: WidthType.DXA },
      margins: { top: 100, bottom: 100, left: 140, right: 140 },
      children: [new Paragraph({
        children: [new TextRun({ text: h, bold: true, color: 'FFFFFF', size: 22, font: 'Arial' })],
      })],
    })),
  });

  const dataRows = plan.recipes.map((r, idx) => new TableRow({
    children: [r.day, r.name].map((val, i) => new TableCell({
      borders: BORDERS,
      shading: { fill: idx % 2 === 0 ? 'FFFFFF' : lightBg, type: ShadingType.CLEAR },
      width: { size: [1800, 7560][i], type: WidthType.DXA },
      margins: { top: 90, bottom: 90, left: 140, right: 140 },
      children: [new Paragraph({
        children: [new TextRun({ text: val, size: 22, font: 'Arial', bold: i === 0 })],
      })],
    })),
  }));

  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [1800, 7560],
    rows: [headerRow, ...dataRows],
  });
}

// ── Recipe section ────────────────────────────────────────────────────────────

function recipeSection(recipe: Recipe, targetServings: number): (Paragraph | Table)[] {
  const scaledIngredients = scaleIngredients(
    recipe.ingredients,
    recipe.baseServings,
    targetServings,
  );

  const metaRow = (lbl: string, val: string) => new TableRow({ children: [
    new TableCell({
      borders: NO_BORDERS, width: { size: 2400, type: WidthType.DXA },
      margins: { top: 60, bottom: 60, left: 0, right: 80 },
      children: [new Paragraph({ children: [new TextRun({ text: lbl, bold: true, size: 20, font: 'Arial', color: '666666' })] })],
    }),
    new TableCell({
      borders: NO_BORDERS, width: { size: 6960, type: WidthType.DXA },
      margins: { top: 60, bottom: 60, left: 0, right: 0 },
      children: [new Paragraph({ children: [new TextRun({ text: val, size: 20, font: 'Arial' })] })],
    }),
  ]});

  const servingNote = targetServings !== recipe.baseServings
    ? `${targetServings} (scaled from ${recipe.baseServings})`
    : String(targetServings);

  return [
    h2(recipe.name),
    new Table({
      width: { size: 9360, type: WidthType.DXA }, columnWidths: [2400, 6960],
      rows: [
        metaRow('Serves:', servingNote),
        metaRow('Prep time:', recipe.prepTime),
        metaRow('Cook time:', recipe.cookTime),
      ],
    }),
    spacer(),
    ...(recipe.note ? [infoBox(recipe.note), spacer()] : []),
    h3('Ingredients'),
    ...scaledIngredients.map(i => bulletPara(formatIngredientLine(i))),
    spacer(),
    h3('Method'),
    ...recipe.steps.map(s => numberedPara(s, 'steps')),
    spacer(),
  ];
}

// ── Prep guide section ────────────────────────────────────────────────────────

function prepGuide(plan: MealPlan, accentColor: string): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [
    h1(`${plan.label.split(' — ')[0]} — Sunday Prep Guide`, T.greenAc),
    spacer(),
    body('A solid Sunday session means weeknight dinners become assembly and reheating rather than starting from scratch. The vacuum sealer is a major advantage here — it lets you marinate faster, portion proteins cleanly, and keep prepped items in peak condition all week.'),
    spacer(),
    infoBox('VS = Vacuum Sealer tip. Label every bag with the meal name and day before sealing.', T.greenBg, T.greenAc),
    spacer(2),
    h3('Afternoon — Prep Session Order', '333333'),
    body('Work in this order so marinades get maximum time and you\'re not cross-contaminating between proteins:'),
    spacer(),
  ];

  for (const recipe of plan.recipes) {
    if (!recipe.prep) continue;
    elements.push(h3(recipe.prep.label, T.greenAc));
    recipe.prep.steps.forEach(s => elements.push(numberedPara(s, 'prepsteps')));
    recipe.prep.vacuumTips.forEach(t => elements.push(vacuumTag(t)));
    elements.push(spacer());
  }

  elements.push(
    infoBox('Stack all vacuum-sealed bags in the fridge in day order — Monday at the front, Friday at the back. Weeknight cooking becomes open bag, cook, eat.', T.greenBg, T.greenAc),
  );

  return elements;
}

// ── Grocery list section ──────────────────────────────────────────────────────

function groceryListSection(plan: MealPlan, targetServings: number, accent: string): (Paragraph | Table)[] {
  const scaledRecipes = plan.recipes.map(r => ({
    ...r,
    ingredients: scaleIngredients(r.ingredients, r.baseServings, targetServings),
  }));
  const groceryList = buildGroceryList(scaledRecipes);

  const elements: (Paragraph | Table)[] = [
    h1(`${plan.label.split(' — ')[0]} — Grocery List`, accent),
    spacer(),
  ];

  for (const cat of CATEGORY_ORDER) {
    const items = groceryList[cat];
    if (items.length === 0) continue;
    elements.push(label(CATEGORY_CONFIG[cat].label));
    items.forEach(i => elements.push(bulletPara(i.display)));
    elements.push(spacer());
  }

  return elements;
}

// ── Plan section ──────────────────────────────────────────────────────────────

function planSection(
  plan: MealPlan,
  targetServings: number,
  accent: string,
  lightBg: string,
): (Paragraph | Table)[] {
  const elements: (Paragraph | Table)[] = [
    // Divider
    spacer(3),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: plan.label.split(' — ')[0], bold: true, size: 48, font: 'Arial', color: accent })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: plan.description, size: 26, font: 'Arial', color: '888888', italics: true })],
      spacing: { before: 80, after: 0 },
    }),
    pageBreak(),

    // Overview
    h1(`${plan.label} — Meal Overview`, accent),
    spacer(),
    mealTable(plan, accent, lightBg),
    spacer(2),
    pageBreak(),

    // Prep guide
    ...prepGuide(plan, accent),
    pageBreak(),

    // Grocery list
    ...groceryListSection(plan, targetServings, accent),
    pageBreak(),

    // Recipes
    h1(`${plan.label.split(' — ')[0]} — Recipes`, accent),
  ];

  plan.recipes.forEach((recipe, idx) => {
    elements.push(...recipeSection(recipe, targetServings));
    if (idx < plan.recipes.length - 1) elements.push(pageBreak());
  });

  return elements;
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function generateDocx(config: GeneratorConfig): Promise<void> {
  const { targetServings, plans, outputDir } = config;
  const suffix = config.outputSuffix ?? `serves${targetServings}`;
  const outputPath = path.join(outputDir, `meal_plan_${suffix}.docx`);

  const servingNote = targetServings > 4
    ? `Family of 4 + ${targetServings - 4} extra servings for leftovers/freezing`
    : 'Family of 4 · Monday to Friday · Dinners';

  const children: (Paragraph | Table)[] = [
    // Cover
    spacer(4),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: 'Weekly Meal Plan', bold: true, size: 56, font: 'Arial', color: T.accentA })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: servingNote, size: 24, font: 'Arial', color: '777777' })],
      spacing: { before: 120, after: 120 },
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: T.medBgA, space: 1 } },
      children: [new TextRun({ text: '' })],
    }),
    spacer(2),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: `${plans.map(p => p.label.split(' — ')[0]).join('  •  ')}  •  Sunday Prep  •  Grocery Lists  •  Full Recipes`, size: 22, font: 'Arial', color: '999999', italics: true })],
    }),
    pageBreak(),
  ];

  // Append each plan
  const planThemes = [
    { accent: T.accentA, lightBg: T.lightBgA },
    { accent: T.accentB, lightBg: 'FBF3EE' },
  ];

  plans.forEach((plan, idx) => {
    const theme = planThemes[idx] ?? planThemes[0];
    children.push(...planSection(plan, targetServings, theme.accent, theme.lightBg));
  });

  const doc = new Document({
    numbering: {
      config: [
        { reference: 'bullets',
          levels: [{ level: 0, format: LevelFormat.BULLET, text: '\u2022', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 600, hanging: 300 } } } }] },
        { reference: 'steps',
          levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 600, hanging: 300 } } } }] },
        { reference: 'prepsteps',
          levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 600, hanging: 300 } } } }] },
      ],
    },
    styles: {
      default: { document: { run: { font: 'Arial', size: 22 } } },
      paragraphStyles: [
        { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 36, bold: true, font: 'Arial', color: T.accentA },
          paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
        { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
          run: { size: 28, bold: true, font: 'Arial', color: '333333' },
          paragraph: { spacing: { before: 280, after: 100 }, outlineLevel: 1 } },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 12240, height: 15840 },
          margin: { top: 1440, right: 1296, bottom: 1440, left: 1296 },
        },
      },
      children,
    }],
  });

  fs.mkdirSync(outputDir, { recursive: true });
  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync(outputPath, buffer);
  console.log(`  ✓ Meal plan → ${outputPath}`);
}
